import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  loadedVideo: ListVideo;
  readyLoadedVideo = false;
  likedVideo: ListVideo;
  readyLikedVideo = false;

  constructor(private videoService: VideoService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.videoService.channelLoadedVideoEmitter.subscribe(resVideos => {
      this.loadedVideo = resVideos;
      this.readyLoadedVideo = true;
    });

    this.videoService.channelLikedVideoEmitter.subscribe(resVideos => {
      this.likedVideo = resVideos;
      this.readyLikedVideo = true;
    });
  }

  onSelectVideo(videoUUId: number, index: number) {
    console.log('Video selected: ', videoUUId);
    this.loadedVideo.changeVideoInfo(index);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfo(videoUUId).subscribe( resData => {
        this.loadedVideo.setSubscribe(index, resData['subscribe']) ;
        if (resData['like']) {
          this.loadedVideo.setLike(index, 'blue');
        } else {
          this.loadedVideo.setLike(index, 'black');
        }
      });
    }
  }

  onSelectLikedVideo(videoUUId: number, index: number) {
    console.log('Video selected: ', videoUUId);
    this.likedVideo.changeVideoInfo(index);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfo(videoUUId).subscribe( resData => {
        this.likedVideo.setSubscribe(index, resData['subscribe']) ;
        if (resData['like']) {
          this.likedVideo.setLike(index, 'blue');
        } else {
          this.likedVideo.setLike(index, 'black');
        }
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

  onLikedVideoComment(index: number) {
    console.log('prova comment');
  }

  onLikedVideolike(index: number) {
    console.log('prova like');
  }


  onChannelClick(channelUUId: number) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
    this.videoService.getChannelLikedVideos();
    //this.router.navigate(['channel']);
  }

}
