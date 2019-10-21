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

  constructor(private videoService: VideoService,
              private router: Router,
              private userService: UserService) { }

  loadedVideoSubscription: Subscription;

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

  onSelectVideo(videoUUId: string, index: number) {
    console.log('Video selected: ', videoUUId);
    this.loadedVideo.changeVideoInfo(index);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfoLoggedUser(videoUUId).subscribe( resData => {
        this.loadedVideo.setSubscribe(index, resData['subscribe']) ;
        if (resData['like']) {
          this.loadedVideo.setLike(index, 'blue');
        } else {
          this.loadedVideo.setLike(index, 'black');
        }
      });
    } else {
      this.videoService.getVideoInfoExtUser(videoUUId).subscribe(resData => {
        console.log(resData);
      });
    }
  }

  onCommentSave(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      console.log('Save comment: ', this.loadedVideo.getComments()[index]);
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      (this.loadedVideo.getLike(index) === 'black') ?
        (this.loadedVideo.setLike(index, 'blue')) :
        (this.loadedVideo.setLike(index, 'black'));
    } else {
      alert('You must be logged to like the videos');
    }
  }


  onChannelClick(channelUUId: string) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
  }

}
