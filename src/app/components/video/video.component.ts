import { Component, OnInit, OnDestroy} from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {

  searchedVideo: ListVideo;
  ready = false;

  searchedVideoSubscription: Subscription;

  constructor(private videoService: VideoService,
              private userService: UserService,
              private router: Router) {
  }

  // *******************
  // List video subscribing and operations
  // *******************

  ngOnInit() {
    this.searchedVideoSubscription = this.videoService.searchedVideoEmitter.subscribe(resVideos => {
      this.searchedVideo = resVideos;
      this.ready = true;
      console.log('Loaded searched videos: ', this.searchedVideo);
    });
  }

  ngOnDestroy() {
    this.searchedVideoSubscription.unsubscribe();
  }

  // *******************
  // Single video operations
  // *******************

  onVideoClick(videoUuid: string, index: number, chUUID: string) {
    this.searchedVideo.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.userService.getUser().getLogInfo()) {
      if (this.userService.getUser().getChUUID() === chUUID) {
        this.searchedVideo.setIsSubscribable(index, true);
      } else {
        this.videoService.getVideoInfoLoggedUser(videoUuid).subscribe( resData => {
          console.log(resData);
          (resData['subscribe'] === 'true') ? this.searchedVideo.setSubscribe(index, true) : this.searchedVideo.setSubscribe(index, false);
          (resData['like'] === 'true') ? this.searchedVideo.setLike(index, 'blue') : this.searchedVideo.setLike(index, 'black');
        });
      }
    } else {
      this.videoService.getVideoInfoExtUser(videoUuid).subscribe(resData => {
        console.log(resData);
      });
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
      this.videoService.saveCommentOnVideo(videoUUID, this.searchedVideo.getComments()[index]);
      this.searchedVideo.getComments()[index] = '';
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveLikeOnVideo(videoUUID, this.searchedVideo, index);
    } else {
      alert('You must be logged to like the video');
    }
  }

  onSubscribeClick(channelUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.subscribeOnChannel(channelUUID, this.searchedVideo, index);
    } else {
      alert('You must be logged to subscribe to the channel');
    }
  }

}
