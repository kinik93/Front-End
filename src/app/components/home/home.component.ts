import { Component, OnInit, SecurityContext } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { Video } from 'src/app/model/video.model';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ready = false;
  private homeVideo: ListVideo;

  constructor(private videoService: VideoService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.getRandomVideos();
  }

  getRandomVideos() {
    this.videoService.getRandomVideos()
    .pipe(map(receivedVideos => {
      const videos = [];
      for (const item of receivedVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['videoDescriptor'],
                              item['channel']['uuid'],
                              item['channel']['owner']['username']));
      }
      return videos;
    }))
    .subscribe(receivedVideos => {
      this.homeVideo = new ListVideo(receivedVideos);
      this.ready = true;
    });
  }

  onVideoClick(videoUuid: string, index: number, chUUID: string) {
    this.homeVideo.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.homeVideo.getVideoInfo(index)) {
      if (this.userService.getUser().getLogInfo()) {
        console.log(this.userService.getUser().getChUUID(), chUUID);
        if (this.userService.getUser().getChUUID() === chUUID) {
          this.homeVideo.setIsSubscribable(index, true);
        } else {
          this.videoService.getVideoInfoLoggedUser(videoUuid).subscribe( resData => {
            console.log(resData);
            (resData['subscribe'] === 'true') ? this.homeVideo.setSubscribe(index, true) : this.homeVideo.setSubscribe(index, false);
            (resData['like'] === 'true') ? this.homeVideo.setLike(index, 'blue') : this.homeVideo.setLike(index, 'black');
          });
        }
      } else {
        this.videoService.getVideoInfoExtUser(videoUuid).subscribe(resData => {
          console.log(resData);
        });
      }
    }
  }

  onChannelClick(channelUUId: string) {
    if (this.userService.getUser().getChUUID() === channelUUId) {
      this.videoService.getProfileVideos();
      this.router.navigate(['profile']);
    } else {
      this.videoService.setChannelSelected(channelUUId);
      this.videoService.getChannelVideos();
      this.router.navigate(['channel']);
    }
  }

  onCommentSave(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveCommentOnVideo(videoUUID, this.homeVideo.getComments()[index]);
      this.homeVideo.getComments()[index] = '';
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveLikeOnVideo(videoUUID, this.homeVideo, index);
    } else {
      alert('You must be logged to like the video');
    }
  }

  onSubscribeClick(channelUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.subscribeOnChannel(channelUUID).subscribe(resData => {
        this.homeVideo.setSubscribe(index, !this.homeVideo.getSubscribe(index));
        this.videoService.updateAllSubscription(this.homeVideo, this.homeVideo.getSubscribe(index), channelUUID);
      }, error => {
        console.log(error);
      });
    } else {
      alert('You must be logged to subscribe to the channel');
    }
  }
}
