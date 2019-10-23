import { Video } from './video.model';

export class ListVideo {
  private toogleLike: string[] = [];
  private toogleSubscribe: boolean[] = [];
  private isSubscribable: boolean[] = [];
  private viewVideoInfo: boolean[] = [];
  private videos: Video[] = [];
  private comments: string[] = [];

  constructor(videos: Video[]) {
    this.videos = videos;
    this.initializeVideoInfo();
  }

  initializeVideoInfo() {
    for (let i = 0; i < this.videos.length; i++) {
      this.viewVideoInfo[i] = false;
      this.comments[i] = '';
      this.isSubscribable[i] = false;
      this.toogleLike[i] = 'black';
      this.toogleSubscribe[i] = false;
    }
  }

  getVideos() {
    return this.videos;
  }

  getVideo(i) {
    return this.videos[i];
  }

  getLike(i) {
    return this.toogleLike[i];
  }

  setLike(i, col) {
    this.toogleLike[i] = col;
  }

  getIsSubscribable(i) {
    return this.isSubscribable[i];
  }

  setIsSubscribable(i, newValue) {
    this.isSubscribable[i] = newValue;
  }

  getSubscribe(i) {
    return this.toogleSubscribe[i];
  }

  setSubscribe(i, tmp) {
    this.toogleSubscribe[i] = tmp;
  }

  getVideoInfo(i) {
    return this.viewVideoInfo[i];
  }

  changeVideoInfo(i) {
    this.viewVideoInfo[i] = !this.viewVideoInfo[i];
  }

  getComments() {
    return this.comments;
  }
}
