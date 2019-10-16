import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ListVideo } from 'src/app/model/ListVideo.model';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  videoTitle = '';
  videoDescription = '';

  myVideos: ListVideo;
  readyMyVideos = false;
  mySubscVideos: ListVideo;
  readySubscVideos = false;

  constructor(private userService: UserService,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit() {
    if (!this.userService.getUser().getLogInfo()) {
      this.router.navigate(['']);
    } else {
      this.videoService.profileLoadedVideoEmitter.subscribe(resVideos => {
        this.myVideos = resVideos;
        this.readyMyVideos = true;
      });

      this.videoService.profileSubVideoEmitter.subscribe(resVideos => {
        this.mySubscVideos = resVideos;
        this.readySubscVideos = true;
      });
    }
  }

  onSelectProfileVideo(videoUUid, index) {
    this.myVideos.changeVideoInfo(index);
  }

  onSelectSubVideo(videoUUid, index) {
    this.mySubscVideos.changeVideoInfo(index);
  }

  uploadVideo() {
    console.log('upload video', this.videoDescription, this.videoTitle);
  }

  onMyVideoLikeClick(index) {
    console.log('Mi piascee')
  }

  onMyVideoCommentSave(index) {
    console.log('Commenta')
  }

  onSubVideoLikeClick(index) {
    console.log('Mi piascee sub')
  }

  onSubVideoCommentSave(index) {
    console.log('Commenta sub')
  }

  onChannelClick(channelUUId: number) {
    this.videoService.setChannelSelected(channelUUId);
    this.videoService.getChannelVideos();
    this.videoService.getChannelLikedVideos();
    this.router.navigate(['channel']);
  }
}
