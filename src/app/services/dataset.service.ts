import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatasetService{
  API_ENDPOINT_URL = 'http://10.168.2.115:8080/backend/services';

  private tokenId: number;
  private currentScenario = '';

  constructor(private http: HttpClient) {
    this.setupId();
  }

  setupId() {
    const idURL = this.API_ENDPOINT_URL + '/log/ID';
    this.http.get(idURL).subscribe(resId => {
      this.tokenId = resId['ID'];
    });
  }

  getTokenId() {
    return this.tokenId;
  }

  getCurrentScenario() {
    return this.currentScenario;
  }

  setCurrentScenario(scenario: string) {
    this.currentScenario = scenario;
  }

  startScenario(selectedScenario: string) {
    this.setCurrentScenario(selectedScenario);
    const startScenarioUrl = this.API_ENDPOINT_URL  + '/log/startScenario?'
                                                    + 'scenario=' + selectedScenario
                                                    + '&id=' + this.tokenId;
    this.http.get(startScenarioUrl).subscribe(resScenario => {
      console.log(resScenario);
    });
  }

  stopScenario() {
    const stopScenarioUrl = this.API_ENDPOINT_URL + '/log/endScenario?'
                                                  + 'scenario=' + this.currentScenario
                                                  + '&id=' + this.tokenId;
    this.http.get(stopScenarioUrl).subscribe(resScenario => {
      console.log(resScenario);
    });
    this.setCurrentScenario('');
  }

}
