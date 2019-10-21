import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {

  loadedVideo: ListVideo;
  readyLoadedVideo = false;

  loadedVideoSubscription: Subscription;

  constructor(private videoService: VideoService,
              private router: Router,
              private userService: UserService) { }

  // *******************
  // List video subscribing and operations
  // *******************

  ngOnInit() {
    this.loadedVideoSubscription = this.videoService.channelLoadedVideoEmitter.subscribe(resVideos => {
      this.loadedVideo = resVideos;
      this.readyLoadedVideo = true;
      console.log('Loaded channel videos: ', this.loadedVideo);
    });
  }

  ngOnDestroy() {
    this.loadedVideoSubscription.unsubscribe();
  }

  // *******************
  // Single video operations
  // *******************

  onVideoClick(videoUuid: string, index: number) {
    this.loadedVideo.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfoLoggedUser(videoUuid).subscribe( resData => {
        console.log(resData);
        (resData['subscribe'] === 'true') ? this.loadedVideo.setSubscribe(index, true) : this.loadedVideo.setSubscribe(index, false);
        (resData['like'] === 'true') ? this.loadedVideo.setLike(index, 'blue') : this.loadedVideo.setLike(index, 'black');
      });
    } else {
      this.videoService.getVideoInfoExtUser(videoUuid).subscribe(resData => {
        console.log(resData);
      });
    }
  }

  onCommentSave(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveCommentOnVideo(videoUUID, this.loadedVideo.getComments()[index]);
      this.loadedVideo.getComments()[index] = '';
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveLikeOnVideo(videoUUID, this.loadedVideo, index);
    } else {
      alert('You must be logged to like the video');
    }
  }

  onSubscribeClick(channelUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.subscribeOnChannel(channelUUID, this.loadedVideo, index);
    } else {
      alert('You must be logged to subscribe to the channel');
    }
  }

}
