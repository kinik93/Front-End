import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        videos.push(new Video(item['uuid'], item['name'], item['description'], item['chUUID']));
      }
      return videos;
    }))
    .subscribe(receivedVideos => {
      this.homeVideo = new ListVideo(receivedVideos);
      this.ready = true;
    });
  }

  onVideoClick(videoUuid: string, index: number) {
    this.homeVideo.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfo(videoUuid).subscribe( resData => {
        this.homeVideo.setSubscribe(index, resData['subscribe']) ;
        if (resData['like']) {
          this.homeVideo.setLike(index, 'blue');
        } else {
          this.homeVideo.setLike(index, 'black');
        }
      });
    }
  }

  onChannelClick(channelUUId: string) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
    this.videoService.getChannelLikedVideos();
    this.router.navigate(['channel']);
  }

  onCommentSave(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      console.log(index);
      console.log(this.homeVideo.getComments()[index]);
      //this.videoService.saveCommentOnVideo(videoUUId, this.homeVideo.setComment(commentIndex, 'fdfh'));
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      (this.homeVideo.getLike(index) === 'black') ? (this.homeVideo.setLike(index, 'blue')) : (this.homeVideo.setLike(index, 'black'));
    } else {
      alert('You must be logged to like the video');
    }
  }
}
