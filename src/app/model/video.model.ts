export class Video {
  private uuid: string;
  private title: string;
  private description: string;
  private channelUUId: string;
  private channelName: string;

  constructor(uuid: string, title: string, description: string, channelUUId: string, channelName: string) {
    this.uuid = uuid;
    this.title = title;
    this.description = description;
    this.channelUUId = channelUUId;
    this.channelName = channelName;
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

  getChannelName() {
    return this.channelName;
  }

  setChannelName(chName: string) {
    this.channelName = chName;
  }
}
