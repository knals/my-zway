import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { Command, Devices } from './enums';
import { VoiceRecognitionService } from './voice.recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  // private subscription: Subscription
  private source = interval(1000);

  constructor(private appService: AppService, public voiceRecognitionService: VoiceRecognitionService) {
  }

  ngOnInit(): void {

    // throw new Error('Method not implemented.');
    this.voiceRecognitionService.init();

  }

  public onClickCommandButton(device: Devices, command: Command): void {
    this.appService.executeCommand(device, command).subscribe(
      (response) => {
        console.log(response);

      },
      error => {
        console.log(error);

      }
    );

  }

  public get Command() {
    return Command;

  }

  public get Devices() {
    return Devices;

  }

  public activeVoice(event: MouseEvent): void {
    this.voiceRecognitionService.start();
  }

/*  */  public cancelVoice(event: MouseEvent): void {
    this.voiceRecognitionService.stop();
  }







/* const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
}; */

}
