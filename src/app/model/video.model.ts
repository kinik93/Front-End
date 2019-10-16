export class Video {
  private uuid: string;
  private title: string;
  private description: string;
  private channelUUId: string;

  constructor(uuid: string, title: string, description: string, channelUUId: string) {
    this.uuid = uuid;
    this.title = title;
    this.description = description;
    this.channelUUId = channelUUId;
  }

  getUUId() {
    return this.uuid;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title: string) {
    this.title = title;
  }

  getDescription() {
    return this.description;
  }

  public setDescription(desc: string) {
    this.description = desc;
  }

  getChannelUUId() {
    return this.channelUUId;
  }
}
