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

  API_ENDPOINT_URL = 'http://127.0.0.1:8080/backend/services';

  private channelSelected: string;
  private inputSearchText: string;

  searchedVideoEmitter = new Subject<ListVideo>();
  channelLoadedVideoEmitter = new Subject<ListVideo>();
  profileLoadedVideoEmitter = new Subject<ListVideo>();

  constructor(private http: HttpClient, private userService: UserService) { }

  // Methods for setting variable passed between pages

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

  // Methods for getting videos in each page

  getRandomVideos() {
    if (this.userService.getUser().getLogInfo()) {
      return this.http.get<Video[]>(this.API_ENDPOINT_URL.concat('/videos/random'));
    } else {
      return this.http.get<Video[]>(this.API_ENDPOINT_URL.concat('/videos/random'));
    }
  }

  searchVideos() {
    console.log('Search for: ', this.inputSearchText);
    const requestUrl = this.API_ENDPOINT_URL.concat('/videos/search?query=').concat(this.inputSearchText);
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['videoDescriptor'],
                              item['channel']['uuid']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.searchedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getChannelVideos() {
    console.log('Ottieni video del canale: ', this.channelSelected);
    const requestUrl =  this.API_ENDPOINT_URL
                        .concat('/channel/viewchannel/?chUUID=')
                        .concat(this.channelSelected);
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['videoDescriptor'],
                              item['channel']['uuid']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.channelLoadedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  getProfileVideos() {
    console.log('Ottieni video utente: ', this.userService.getUser());
    const requestUrl =  this.API_ENDPOINT_URL + '/channel/viewchannel/?' +
                        'chUUID=' + this.userService.getUser().getChUUID();
    this.http.get<Video[]>(requestUrl)
    .pipe(map(resVideos => {
      const videos = [];
      for (const item of resVideos) {
        videos.push(new Video(item['uuid'],
                              item['name'],
                              item['videoDescriptor'],
                              item['channel']['uuid']));
      }
      return videos;
    }))
    .subscribe(resVideos => {
      this.profileLoadedVideoEmitter.next(new ListVideo(resVideos));
    });
  }

  // Methods for getting information for each video

  getVideoInfoLoggedUser(videoUUID: string) {
    console.log('Get info for video: ', videoUUID, ' for user: ', this.userService.getUser().getUuid());
    const videoInfoUrl = this.API_ENDPOINT_URL.concat('/videos/watch?videoUUID=')
                          .concat(videoUUID).concat('&usrUUID=')
                          .concat(this.userService.getUser().getUuid());
    return this.http.get(videoInfoUrl);
  }

  getVideoInfoExtUser(videoUUID: string) {
    console.log('Get info for video: ', videoUUID, ' for external user');
    const videoInfoUrl = this.API_ENDPOINT_URL.concat('/videos/watch?videoUUID=')
                          .concat(videoUUID);
    return this.http.get(videoInfoUrl);
  }

  saveLikeOnVideo(videoUUID: string, listVideo: ListVideo, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      const likeUrl = this.API_ENDPOINT_URL + '/videos/like/?videoUUID=' + videoUUID +
                                              '&usrUUID=' + this.userService.getUser().getUuid();
      this.http.get(likeUrl).subscribe(resData => {
        (resData['like'] === 'true') ? listVideo.setLike(index, 'blue') : listVideo.setLike(index, 'black');
      }, error => {
        console.log(error);
      });
    }
  }

  saveCommentOnVideo(videoUUId: string, comment: string) {
    console.log('Saving ', comment, 'on video ', videoUUId);
    const commentUrl = this.API_ENDPOINT_URL +  '/videos/comment/?videoUUID=' + videoUUId +
                                                '&usrUUID=' + this.userService.getUser().getUuid() +
                                                '&comment=' + comment;
    this.http.get(commentUrl).subscribe(resData => {
      console.log(resData);
    }, error => {
      console.log(error);
    });
  }

  subscribeOnChannel(chUUID: string, listVideo: ListVideo, index: number) {
    const subscribeURL = this.API_ENDPOINT_URL +  '/channel/subscribe/?chUUID=' + chUUID +
                         '&usrUUID=' + this.userService.getUser().getUuid();
    this.http.get(subscribeURL).subscribe(resData => {
      console.log(resData);
      listVideo.setSubscribe(index, !listVideo.getSubscribe(index));
    }, error => {
      console.log(error);
    });
  }

  // *****************
  // Profile functionalities
  // *****************

  uploadVideo(videoName, videoDescriptor, userUUID) {
    const uploadURL = this.API_ENDPOINT_URL + '/channel/uploadvideo/?' +
                      'videoname=' + videoName +
                      '&descriptor=' + videoDescriptor +
                      '&channelUUID=' + this.userService.getUser().getChUUID();
    return this.http.get(uploadURL).subscribe(resData => {
      console.log(resData);
    }, error => {
      console.log(error);
    }, () => {
      alert('Video uploaded');
    });
  }

  viewMyChannels(userUUID: string) {
    const listChUrl = this.API_ENDPOINT_URL + '/users/followedChannels/?' +
                      'usrUUID=' + userUUID;
    return this.http.get<{chUUID: string, chName: string}[]>(listChUrl);
  }

}
