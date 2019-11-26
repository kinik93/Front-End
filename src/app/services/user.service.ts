import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import { Subject } from 'rxjs';
import { User } from '../model/user.model';
import { DatasetService } from './dataset.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_ENDPOINT_URL: string;

  usernameEmitter = new Subject<string>();
  private loggedUser: User;

  constructor(private http: HttpClient, private datasetService: DatasetService) {
    this.API_ENDPOINT_URL = datasetService.API_ENDPOINT_URL;
    this.setExternalUser(false);
  }

  setExternalUser(sendRequestToLog: boolean) {
    this.loggedUser = new User('EXTERNAL', false, 'TODO', 'TODO');
    if (sendRequestToLog) {
      const logoutUrl = this.API_ENDPOINT_URL +
                        '/logout?' +
                        'id=' + this.datasetService.getTokenId() +
                        '&scenario=' + this.datasetService.getCurrentScenario();
      this.http.get(logoutUrl).subscribe(resData => {
      console.log(resData);
      });
    }
  }

  setUser(newUser: User) {
    this.loggedUser.setUsername(newUser.getUsername());
    this.loggedUser.setLogInfo(newUser.getLogInfo());
    this.loggedUser.setUuid(newUser.getUuid());
    this.loggedUser.setChUUID(newUser.getChUUID());
  }

  getUser(): User {
    return this.loggedUser;
  }

  checkLogUser(username: string, password: string) {
    const md5 = new Md5();
    const userAuthUrl =  this.API_ENDPOINT_URL +
                          '/users/login/?username=' + username +
                          '&psw=' + md5.appendStr(password).end() +
                          '&id=' + this.datasetService.getTokenId() +
                          '&scenario=' + this.datasetService.getCurrentScenario();
    console.log(userAuthUrl);
    return this.http.get<User>(userAuthUrl);
  }

  signUpUser(username: string, password: string) {
    const md5 = new Md5();
    const userSignUpUrl = this.API_ENDPOINT_URL +
                          '/signup/?' +
                          'username=' + username +
                          '&psw=' + md5.appendStr(password).end();
    this.http.get(userSignUpUrl).subscribe(() => {
      console.log('Registered a new user');
    }, resError => {
      console.log('Error: ', resError);
    });
  }

}
