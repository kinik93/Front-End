import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import { Subject } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usernameEmitter = new Subject<string>();
  private loggedUser: User;

  constructor(private http: HttpClient) {
    this.setExternalUser();
  }

  setExternalUser() {
    this.loggedUser = new User('Unknown', false, 'TODO');
  }

  setUser(newUser: User) {
    this.loggedUser.setUsername(newUser.getUsername());
    this.loggedUser.setLogInfo(newUser.getLogInfo());
    this.loggedUser.setUuid(newUser.getUuid());
  }

  getUser(): User {
    return this.loggedUser;
  }

  checkLogUser(username: string, password: string) {
    const md5 = new Md5();
    return this.http.get<User>('http://10.168.2.115:8080/backend/services/login/?username='
        + username + '&psw=' + md5.appendStr(password).end());
  }

}
