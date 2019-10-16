import { Component, OnInit} from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  searchedVideo: ListVideo;
  ready = false;

  constructor(private videoService: VideoService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.videoService.searchedVideoEmitter.subscribe(resVideos => {
      this.searchedVideo = resVideos;
      this.ready = true;
      console.log(this.searchedVideo);
    });
  }

  onSelectVideo(videoUUId: number, index: number) {
    console.log('Video selected: ', videoUUId);
    this.searchedVideo.changeVideoInfo(index);
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getVideoInfo(videoUUId).subscribe( resData => {
        this.searchedVideo.setSubscribe(index, resData['subscribe']) ;
        if (resData['like']) {
          this.searchedVideo.setLike(index, 'blue');
        } else {
          this.searchedVideo.setLike(index, 'black');
        }
      });
    }
  }

  onCommentSave(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      console.log('Save comment: ', this.searchedVideo.getComments()[index]);
    } else {
      alert('You must be logged to comment');
    }
  }

  onLikeClick(index: number) {
    if (this.userService.getUser().getLogInfo()) {
      (this.searchedVideo.getLike(index) === 'black') ?
        (this.searchedVideo.setLike(index, 'blue')) :
        (this.searchedVideo.setLike(index, 'black'));
    } else {
      alert('You must be logged to like the videos');
    }
  }

  onChannelClick(channelUUId: number) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
    this.videoService.getChannelLikedVideos();
    this.router.navigate(['channel']);
  }
}
