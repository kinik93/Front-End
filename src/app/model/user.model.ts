export class User {
  private username: string;
  private logInfo: boolean;
  private uuid: string;
  private chUUID: string;

  constructor(username: string, logInfo: boolean, uuid: string, chUUID: string) {
    this.username = username;
    this.logInfo = logInfo;
    this.uuid = uuid;
    this.chUUID = chUUID;
  }

  getUsername() {
    return this.username;
  }

  getLogInfo() {
    return this.logInfo;
  }

  getUuid() {
    return this.uuid;
  }

  setUsername(username) {
    this.username = username;
  }

  setLogInfo(logInfo) {
    this.logInfo = logInfo;
  }

  setUuid(uuid) {
    this.uuid = uuid;
  }

  getChUUID() {
    return this.chUUID;
  }

  setChUUID(chUUID: string) {
    this.chUUID = chUUID;
  }
}
