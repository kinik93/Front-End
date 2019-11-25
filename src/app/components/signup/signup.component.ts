import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private username = '';
  private password = '';

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  onRegisterClick() {
    this.userService.signUpUser(this.username, this.password);
    this.router.navigate(['/']);
  }

  onCancelClick() {
    this.router.navigate(['/']);
  }

}
