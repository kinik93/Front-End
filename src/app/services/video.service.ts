import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Video } from '../model/video.model';
import { UserService } from './user.service';
import { ListVideo } from '../model/ListVideo.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private channelSelected: string;
  private inputSearchText: string;

  searchedVideoEmitter = new Subject<ListVideo>();
  channelLoadedVideoEmitter = new Subject<ListVideo>();
  channelLikedVideoEmitter = new Subject<ListVideo>();
  profileLoadedVideoEmitter = new Subject<ListVideo>();
  profileSubVideoEmitter = new Subject<ListVideo>();

  constructor(private http: HttpClient, private userService: UserService) { }

  getChannelSelected() {
    return this.channelSelected;
  }

  setChannelSelected(chSel: string) {
    this.channelSelected = chSel;
  }

  getInputSearchText() {
    return this.inputSearchText;
  }

  setInputSearchText(searchtxt: string) {
    this.inputSearchText = searchtxt;
  }

  getRandomVideos() {
    if (this.userService.getUser().getLogInfo()) {
      return this.http.get<Video[]>('http://localhost:3000/video1.json');
    } else {
      return this.http.get<Video[]>('http://localhost:3000/video1.json');
    }
  }

  getVideoInfo(videoUUID) {
    console.log('Get info for video: ', videoUUID, ' for user: ', this.userService.getUser().getUuid());
    return this.http.get('http://localhost:3000/info.json');
  }

  searchVideos() {
    console.log('Ricerca: ', this.inputSearchText);
    const requestUrl = 'http://localhost:3000/'.concat(this.inputSearchText);
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['description'],
                              item['chUUID']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.searchedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getChannelVideos() {
    console.log('Ottieni video del canale: ', this.channelSelected);
    const requestUrl = 'http://localhost:3000/'.concat('video1.json');
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['description'],
                              item['chUUID']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.channelLoadedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getChannelLikedVideos() {
    console.log('Ottieni video del canale: ', this.channelSelected);
    const requestUrl = 'http://localhost:3000/'.concat('video2.json');
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['description'],
                              item['chUUID']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.channelLikedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getProfileVideos() {
    console.log('Ottieni video utente: ', this.userService.getUser().getUsername());
    const requestUrl = 'http://localhost:3000/'.concat('video2.json');
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['description'],
                              item['chUUID']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.profileLoadedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getProfileSubscVideos() {
    const requestUrl = 'http://localhost:3000/'.concat('video2.json');
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['description'],
                              item['chUUID']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.profileSubVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  saveCommentOnVideo(videoId: string, comment: string) {
    console.log('Saving ', comment, 'on video ', videoId);
    // this.http.get('').subscribe(resData => {});
  }




}
