import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { VideoService } from 'src/app/services/video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  videoTitle = '';
  videoDescription = '';

  myVideos: ListVideo;
  readyMyVideos = false;

  myVideosSubscription: Subscription;

  constructor(private userService: UserService,
              private router: Router,
              private videoService: VideoService) { }

  // *******************
  // List video subscribing and operations
  // *******************

  ngOnInit() {
    if (!this.userService.getUser().getLogInfo()) {
      this.router.navigate(['']);
    } else {
      this.myVideosSubscription = this.videoService.profileLoadedVideoEmitter.subscribe(resVideos => {
        this.myVideos = resVideos;
        this.readyMyVideos = true;
        console.log('Loaded channel videos: ', this.myVideos);
      });
    }
  }

  ngOnDestroy() {
    this.myVideosSubscription.unsubscribe();
  }

  // *******************
  // Single video operations
  // *******************

  onVideoClick(videoUuid: string, index: number) {
    this.myVideos.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfoLoggedUser(videoUuid).subscribe( resData => {
        console.log(resData);
        (resData['subscribe'] === 'true') ? this.myVideos.setSubscribe(index, true) : this.myVideos.setSubscribe(index, false);
        (resData['like'] === 'true') ? this.myVideos.setLike(index, 'blue') : this.myVideos.setLike(index, 'black');
      });
    } else {
      this.videoService.getVideoInfoExtUser(videoUuid).subscribe(resData => {
        console.log(resData);
      });
    }
  }

  onCommentSave(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveCommentOnVideo(videoUUID, this.myVideos.getComments()[index]);
      this.myVideos.getComments()[index] = '';
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(videoUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.saveLikeOnVideo(videoUUID, this.myVideos, index);
    } else {
      alert('You must be logged to like the video');
    }
  }

  // Uploading video feature

  uploadVideo() {
    console.log('upload video', this.videoDescription, this.videoTitle);
  }
}
