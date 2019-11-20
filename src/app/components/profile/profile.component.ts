import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { VideoService } from 'src/app/services/video.service';
import { Subscription } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';

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
  myChannelList: {chUUID: string, chOwner: string}[] =  [];

  myVideosSubscription: Subscription;

  constructor(private userService: UserService,
              private router: Router,
              private videoService: VideoService,
              private datasetService: DatasetService) { }

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

      this.listMyChannels();
    }
  }

  ngOnDestroy() {
    if (this.userService.getUser().getLogInfo()) {
      this.myVideosSubscription.unsubscribe();
    }
  }

  // *******************
  // Single video operations
  // *******************

  onVideoClick(videoUuid: string, index: number) {
    this.myVideos.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);

    if (this.myVideos.getVideoInfo(index)) {
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

  // ******************
  // Profile functionalities
  // ******************

  uploadVideo() {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.uploadVideo(this.videoTitle,
                                    this.videoDescription,
                                    this.userService.getUser().getUuid());
      this.videoTitle = '';
      this.videoDescription = '';
    } else {
      alert('You must be logged to upload a video');
    }
  }

  listMyChannels() {
    this.videoService.viewMyChannels(this.userService.getUser().getUuid())
    .subscribe(resCh => {
      for (const chItem of resCh) {
        this.myChannelList.push({chUUID: chItem['uuid'], chOwner: chItem['owner']});
      }
    }, error => {
      console.log(error);
    });
  }

  onChannelClick(channelUUId: string) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
    this.router.navigate(['channel']);
  }
}
