import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {


  private LANG: string = 'es-ES';
  public recognition =  new webkitSpeechRecognition();
  public isStoppedSpeechRecog = false;
  public text = '';
  public tempWords: any;

  public lastTranscript: Date = new Date();

  public subscription: Subscription = new Subscription;
  private source = interval(1000);

  constructor() {}

private unsubscription(){
  this.subscription.unsubscribe();
}

  public init() {
    this.subscription = this.source.subscribe((val) => {
      if (!this.isStoppedSpeechRecog && (this.lastTranscript.getTime()+ 5000) < (new Date().getTime() )) {
        this.stop();

      }
     });

    this.recognition.interimResults = true;
    this.recognition.lang = this.LANG;

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
      this.lastTranscript = new Date();
    });
  }

  public start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }
  public stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
  }

  private wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }



  private levenshteinDistance(s: string, t: string): number {
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
  };




}
