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

  API_ENDPOINT_URL = 'http://10.168.2.115:8080/backend/services/users';

  usernameEmitter = new Subject<string>();
  private loggedUser: User;

  constructor(private http: HttpClient, private datasetService: DatasetService) {
    this.setExternalUser();
  }

  setExternalUser() {
    this.loggedUser = new User('Unknown', false, 'TODO', 'TODO');
    /*const logoutUrl = this.API_ENDPOINT_URL +
                      'boh/logout' +
                      '&id=' + this.datasetService.getTokenId() +
                      '&scenario=' + this.datasetService.getCurrentScenario();
    this.http.get(logoutUrl).subscribe(resData => {
      console.log(resData);
    });*/
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
                          '/login/?username=' + username +
                          '&psw=' + md5.appendStr(password).end() +
                          '&id=' + this.datasetService.getTokenId() +
                          '&scenario=' + this.datasetService.getCurrentScenario();
    console.log(userAuthUrl);
    return this.http.get<User>(userAuthUrl);
  }

}
