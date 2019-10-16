import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usernameLog: string;
  private viewModal: boolean;
  inputSearch = '';

  constructor(private userService: UserService,
              private router: Router,
              private videoService: VideoService) {
    this.usernameLog = userService.getUser().getUsername();
  }

  ngOnInit() {
    this.viewModal = false;
    this.userService.usernameEmitter.subscribe(logName => {
      this.usernameLog = logName;
    });
  }

  onProfileClick() {
    if (this.userService.getUser().getLogInfo()) {
      this.videoService.getProfileVideos();
      this.videoService.getProfileSubscVideos();
      this.viewModal = false;
      this.router.navigate(['profile']);
    } else {
      alert('You must be logged to view your profile');
    }
  }

  onUserClick() {
    if (!this.userService.getUser().getLogInfo()) {
      this.router.navigate(['login']);
    } else {
      this.viewModal = !this.viewModal;
    }
  }

  onLogoutClick() {
    this.userService.setExternalUser();
    this.userService.usernameEmitter.next('Unknown');
    this.viewModal = false;
    this.router.navigate(['login']);
  }

  onSearchClick() {
    this.videoService.setInputSearchText(this.inputSearch);
    this.videoService.searchVideos();
    this.router.navigate(['video']);
  }

}
