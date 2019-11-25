import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Video } from '../model/video.model';
import { UserService } from './user.service';
import { ListVideo } from '../model/ListVideo.model';
import { DatasetService } from './dataset.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  API_ENDPOINT_URL: string;

  private channelSelected: string;
  private inputSearchText: string;

  searchedVideoEmitter = new Subject<ListVideo>();
  channelLoadedVideoEmitter = new Subject<ListVideo>();
  profileLoadedVideoEmitter = new Subject<ListVideo>();

  constructor(private http: HttpClient,
              private userService: UserService,
              private router: Router,
              private datasetService: DatasetService) {
    this.API_ENDPOINT_URL = datasetService.API_ENDPOINT_URL;
    this.inputSearchText = '';
    this.channelSelected = '';
  }

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
      return this.http.get<Video[]>(
        this.API_ENDPOINT_URL.concat('/videos/random')
      );
    } else {
      return this.http.get<Video[]>(
        this.API_ENDPOINT_URL.concat('/videos/random')
      );
    }
  }

  searchVideos() {
    console.log('Search for: ', this.inputSearchText);
    let requestUrl = this.API_ENDPOINT_URL.concat('/videos/search?query=')
      .concat(this.inputSearchText)
      .concat('&id=' + this.datasetService.getTokenId());
    if (this.datasetService.getCurrentScenario() !== '') {
      requestUrl = requestUrl.concat(
        '&scenario=' + this.datasetService.getCurrentScenario()
      );
    }
    console.log(requestUrl);
    this.http
      .get<Video[]>(requestUrl)
      .pipe(
        map(resVideos => {
          const videos = [];
          for (const item of resVideos) {
            videos.push(
              new Video(
                item['uuid'],
                item['name'],
                item['videoDescriptor'],
                item['channel']['uuid'],
                item['channel']['owner']['username']
              )
            );
          }
          return videos;
        })
      )
      .subscribe(resVideos => {
        this.searchedVideoEmitter.next(new ListVideo(resVideos));
      });
  }

  getChannelVideos() {
    console.log('Ottieni video del canale: ', this.channelSelected);
    let requestUrl = this.API_ENDPOINT_URL.concat(
      '/channel/viewchannel/?chUUID='
    )
      .concat(this.channelSelected)
      .concat('&id=' + this.datasetService.getTokenId());
    if (this.datasetService.getCurrentScenario() !== '') {
      requestUrl = requestUrl + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    this.http
      .get<Video[]>(requestUrl)
      .pipe(
        map(resVideos => {
          const videos = [];
          for (const item of resVideos) {
            videos.push(
              new Video(
                item['uuid'],
                item['name'],
                item['videoDescriptor'],
                item['channel']['uuid'],
                item['channel']['owner']['username']
              )
            );
          }
          return videos;
        })
      )
      .subscribe(resVideos => {
        this.channelLoadedVideoEmitter.next(new ListVideo(resVideos));
      });
  }

  getProfileVideos() {
    console.log('Ottieni video utente: ', this.userService.getUser());
    let requestUrl =
      this.API_ENDPOINT_URL +
      '/channel/viewchannel/?' +
      'chUUID=' +
      this.userService.getUser().getChUUID() +
      '&id=' +
      this.datasetService.getTokenId();
    if (this.datasetService.getCurrentScenario() !== '') {
      requestUrl = requestUrl + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    this.http
      .get<Video[]>(requestUrl)
      .pipe(
        map(resVideos => {
          const videos = [];
          for (const item of resVideos) {
            videos.push(
              new Video(
                item['uuid'],
                item['name'],
                item['videoDescriptor'],
                item['channel']['uuid'],
                item['channel']['owner']['username']
              )
            );
          }
          return videos;
        })
      )
      .subscribe(resVideos => {
        this.profileLoadedVideoEmitter.next(new ListVideo(resVideos));
      });
  }

  // Methods for getting information for each video

  getVideoInfoLoggedUser(videoUUID: string) {
    console.log('Get info for video: ', videoUUID, ' for user: ', this.userService.getUser().getUuid());
    let videoInfoUrl = this.API_ENDPOINT_URL.concat(
      '/videos/watch?videoUUID='
    )
      .concat(videoUUID)
      .concat('&usrUUID=')
      .concat(this.userService.getUser().getUuid())
      .concat('&id=' + this.datasetService.getTokenId());
    if (this.datasetService.getCurrentScenario() !== '') {
      videoInfoUrl =  videoInfoUrl +
                      '&scenario=' +
                      this.datasetService.getCurrentScenario();
    }
    return this.http.get(videoInfoUrl);
  }

  getVideoInfoExtUser(videoUUID: string) {
    console.log('Get info for video: ', videoUUID, ' for external user');
    let videoInfoUrl = this.API_ENDPOINT_URL.concat(
      '/videos/watch?videoUUID='
    ).concat(videoUUID)
    .concat('&id=' + this.datasetService.getTokenId());
    if (this.datasetService.getCurrentScenario() !== '') {
      videoInfoUrl =  videoInfoUrl +
                      '&scenario=' +
                      this.datasetService.getCurrentScenario();
    }
    return this.http.get(videoInfoUrl);
  }

  saveLikeOnVideo(videoUUID: string, listVideo: ListVideo, index: number) {
    if (this.userService.getUser().getLogInfo()) {
      let likeUrl =
        this.API_ENDPOINT_URL +
        '/videos/like/?videoUUID=' +
        videoUUID +
        '&usrUUID=' +
        this.userService.getUser().getUuid() +
        '&id=' +
        this.datasetService.getTokenId();
      if (this.datasetService.getCurrentScenario() !== '') {
        likeUrl = likeUrl + '&scenario=' + this.datasetService.getCurrentScenario();
      }
      this.http.get(likeUrl).subscribe(
        resData => {
          resData['like'] === 'true'
            ? listVideo.setLike(index, 'blue')
            : listVideo.setLike(index, 'black');
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  saveCommentOnVideo(videoUUId: string, comment: string) {
    console.log('Saving ', comment, 'on video ', videoUUId);
    let commentUrl =
      this.API_ENDPOINT_URL +
      '/videos/comment/?videoUUID=' +
      videoUUId +
      '&usrUUID=' +
      this.userService.getUser().getUuid() +
      '&comment=' +
      comment +
      '&id=' +
      this.datasetService.getTokenId();
    if (this.datasetService.getCurrentScenario() !== '') {
      commentUrl = commentUrl + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    this.http.get(commentUrl).subscribe(
      resData => {
        console.log(resData);
      },
      error => {
        console.log(error);
      }
    );
  }

  subscribeOnChannel(chUUID: string) {
    let subscribeURL =
      this.API_ENDPOINT_URL +
      '/channel/subscribe/?chUUID=' +
      chUUID +
      '&usrUUID=' +
      this.userService.getUser().getUuid() +
      '&id=' +
      this.datasetService.getTokenId();
    if (this.datasetService.getCurrentScenario() !== '') {
      subscribeURL = subscribeURL + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    return this.http.get(subscribeURL);
  }

  checkSubscription(userUUID: string, chUUID: string) {
    const checksubUrl =
    this.API_ENDPOINT_URL +
    '/channel/checkSubscription?' +
    'userUUID=' +
    userUUID +
    '&channelUUID=' +
    chUUID;
    return this.http.get(checksubUrl);
  }

  updateAllSubscription(listVideo: ListVideo, newSubscription: boolean, chUUID: string ) {
    for (let i = 0 ; i < listVideo.getVideos().length; i++) {
      if (listVideo.getVideo(i).getChannelUUId() === chUUID) {
        listVideo.setSubscribe(i, newSubscription);
      }
    }
  }

  // *****************
  // Profile functionalities
  // *****************

  uploadVideo(videoName: string, videoDescriptor: string) {
    let uploadURL =
      this.API_ENDPOINT_URL +
      '/channel/uploadvideo/?' +
      'videoname=' +
      videoName +
      '&descriptor=' +
      videoDescriptor +
      '&channelUUID=' +
      this.userService.getUser().getChUUID() +
      '&id=' +
      this.datasetService.getTokenId();
    if (this.datasetService.getCurrentScenario() !== '') {
      uploadURL = uploadURL + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    return this.http.get(uploadURL).subscribe(
      resData => {
        console.log(resData);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
      },
      () => {
        alert('Video uploaded');
      }
    );
  }

  viewMyChannels(userUUID: string) {
    let listChUrl =
      this.API_ENDPOINT_URL +
      '/users/followedChannels/?' +
      'usrUUID=' +
      userUUID +
      '&id=' +
      this.datasetService.getTokenId();
    if (this.datasetService.getCurrentScenario() !== '') {
      listChUrl = listChUrl + '&scenario=' + this.datasetService.getCurrentScenario();
    }
    return this.http.get<{ chUUID: string; chName: string }[]>(listChUrl);
  }

  deleteVideo(videoUUID: string, userUUID: string) {
    const deleteVideoUrl =  this.API_ENDPOINT_URL +
                          '/channel/deletevideo/?' +
                          'usrUUID=' + userUUID +
                          '&videoUUID=' + videoUUID +
                          '&id=' + this.datasetService.getTokenId();
    this.http.get(deleteVideoUrl).subscribe(() => {
      console.log('Video deleted');
      this.getProfileVideos();
    });
  }
}
