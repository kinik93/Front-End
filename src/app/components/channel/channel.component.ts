import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {

  loadedVideo: ListVideo;
  readyLoadedVideo = false;
  isSubscribed = false;

  loadedVideoSubscription: Subscription;

  constructor(private videoService: VideoService,
              private userService: UserService,
              private router: Router) { }

  // *******************
  // List video subscribing and operations
  // *******************

  ngOnInit() {
    if (this.videoService.getChannelSelected() === '') {
      this.router.navigate(['/']);
    }
    if (this.videoService.getChannelSelected() === this.userService.getUser().getChUUID()) {
      this.videoService.getProfileVideos();
      this.router.navigate(['/profile']);
    }
    this.loadedVideoSubscription = this.videoService.channelLoadedVideoEmitter.subscribe(resVideos => {
      this.loadedVideo = resVideos;
      this.readyLoadedVideo = true;
    });

    if (this.userService.getUser().getLogInfo()) {
      this.videoService.checkSubscription(this.userService.getUser().getUuid(), this.videoService.getChannelSelected())
            .subscribe(resData => {
        (resData['subscribe'] === 'true') ? (this.isSubscribed = true) : (this.isSubscribed = false);
      });
    }
  }

  ngOnDestroy() {
    this.loadedVideoSubscription.unsubscribe();
  }

  // *******************
  // Single video operations
  // *******************

  onVideoClick(videoUuid: string, index: number, chUUID: string) {
    this.loadedVideo.changeVideoInfo(index);
    console.log('Video clicked: ', videoUuid);
    if (this.loadedVideo.getVideoInfo(index)) {
      if (this.userService.getUser().getLogInfo()) {
        if (this.userService.getUser().getChUUID() === chUUID) {
          this.loadedVideo.setIsSubscribable(index, true);
        } else {
          this.videoService.getVideoInfoLoggedUser(videoUuid).subscribe( resData => {
            console.log(resData);
            (resData['subscribe'] === 'true') ? this.loadedVideo.setSubscribe(index, true) : this.loadedVideo.setSubscribe(index, false);
            (resData['like'] === 'true') ? this.loadedVideo.setLike(index, 'blue') : this.loadedVideo.setLike(index, 'black');
          });
        }
      } else {
        this.videoService.getVideoInfoExtUser(videoUuid).subscribe(resData => {
          console.log(resData);
        });
      }
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

  onChannelSubscription() {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.subscribeOnChannel(this.videoService.getChannelSelected()).subscribe(() => {
        this.isSubscribed = !this.isSubscribed;
        this.videoService.updateAllSubscription(this.loadedVideo, this.isSubscribed, this.videoService.getChannelSelected());
      }, error => {
        console.log(error);
      });
    } else {
      alert('You must be logged to subscribe to the channel');
    }
  }

  onSubscribeClick(channelUUID: string, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.subscribeOnChannel(channelUUID).subscribe(resData => {
        this.loadedVideo.setSubscribe(index, !this.loadedVideo.getSubscribe(index));
        this.videoService.updateAllSubscription(this.loadedVideo, this.loadedVideo.getSubscribe(index), channelUUID);
        this.isSubscribed = this.loadedVideo.getSubscribe(index);
      }, error => {
        console.log(error);
      });
    } else {
      alert('You must be logged to subscribe to the channel');
    }
  }

}
