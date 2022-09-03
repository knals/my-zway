import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Command, Devices } from './enums';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public HttpClient: HttpClient) { }


  public executeCommand(device: Devices, command: Command): Observable<any> {
    const url = `http://192.168.1.109:8083/ZAutomation/api/v1/devices/${device}/command/${command}`;
    return this.HttpClient.get<any>(url, {});

  }

  public executeCommandStr(device: string, command: string): Observable<any> {
    const url = `http://192.168.1.109:8083/ZAutomation/api/v1/devices/${device}/command/${command}`;
    return this.HttpClient.get<any>(url, {});

  }

  public commandOn(device: string | 'ZWayVDev_zway_8-0-38'): Observable<any> {
    const url = `http://192.168.1.109:8083/ZAutomation/api/v1/devices/${device}/command/on`;
    return this.HttpClient.get<any>(url, {});

  }

  public commandOff(device: string | 'ZWayVDev_zway_8-0-38'): Observable<any> {
    const url = `http://192.168.1.109:8083/ZAutomation/api/v1/devices/ZWayVDev_zway_8-0-38/command/off`;
    return this.HttpClient.get<any>(url, {});

  }

  public commandStop(device: string | 'ZWayVDev_zway_8-0-38'): Observable<any> {
    const url = `http://192.168.1.109:8083/ZAutomation/api/v1/devices/ZWayVDev_zway_8-0-38/command/stop`;
    return this.HttpClient.get<any>(url, {});

  }



}
