import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { Location } from '@angular/common';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username = '';
  private password = '';

  isLoading: boolean;

  constructor(private userService: UserService,
              private videoService: VideoService,
              private location: Location) { }

  ngOnInit() {
    this.isLoading = false;
  }

  onLogin() {
    if (this.userService.getUser().getLogInfo() === false) {
      this.isLoading = true;
      this.userService.checkLogUser(this.username, this.password).subscribe( tmpUserLogged => {
        const userLogged =  new User(tmpUserLogged['username'],
                                    tmpUserLogged['status'],
                                    tmpUserLogged['uuid'],
                                    tmpUserLogged['chUUID']);
        this.userService.setUser(userLogged);
        if (userLogged.getLogInfo()) {
          console.log('Log in successfull');
          this.userService.usernameEmitter.next(userLogged.getUsername());
          this.isLoading = false;
        }
        this.goBack();
      },
      error => {
        alert('Login failed, connection error');
        console.log('Errore: ', error);
        this.isLoading = false;
        this.goBack();
      });
      this.username = '';
      this.password = '';
    } else {
      alert('Logout before');
    }
  }

  onCancelClick() {
    this.goBack();
  }

  goBack() {
    if (typeof this.videoService.getInputSearchText() !== "undefined") {
      this.videoService.searchVideos();
    }
    if (typeof this.videoService.getChannelSelected() !== "undefined") {
      this.videoService.getChannelVideos();
    }

    this.location.back();
  }

}
