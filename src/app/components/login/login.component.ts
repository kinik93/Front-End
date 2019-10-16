import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
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

  constructor(private userService: UserService,
              private videoService: VideoService,
              private router: Router,
              private location: Location) { }

  ngOnInit() {
  }

  onLogin() {
    if (this.userService.getUser().getLogInfo() === false) {
      this.userService.checkLogUser(this.username, this.password).subscribe( tmpUserLogged => {
        console.log(tmpUserLogged);
        let userLogged =  new User(tmpUserLogged['username'],
                                    tmpUserLogged['status'],
                                    tmpUserLogged['uuid']);
        this.userService.setUser(userLogged);
        console.log(userLogged.getLogInfo());
        if (userLogged.getLogInfo()) {
          console.log('ok');
          this.userService.usernameEmitter.next(userLogged.getUsername());
        } else {
          console.log('fail');
          alert('Login failed');
        }
        // this.location.back();
        this.router.navigate(['']);
      },
      error => {
        alert('Login failed, connection error');
        console.log('Errore: ', error);
        // this.location.back();
        this.router.navigate(['']);
      });
      this.username = '';
      this.password = '';
    } else {
      alert('Logout before');
    }
  }

  onCancelClick() {
    this.videoService.searchVideos();

    // this.location.back();  TODO: sarebbe da usare questa, ma non funziona perchè quando
    //                              indietro non ricarica correttamente i video

    this.router.navigate(['']);
  }

}
