import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { Command, Devices } from './enums';
import { Acction } from './model';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  public error = '';
  private LANG: string = 'es-ES';
  public recognition = new webkitSpeechRecognition();
  public isStoppedSpeechRecog = true;
  public text = '';
  public tempWords: any;

  public lastTranscript: Date = new Date();

  public subscription: Subscription = new Subscription;
  private source = interval(1000);

  private finalWords = '';

  constructor(private appService: AppService) {}

  private unsubscription() {
    this.subscription.unsubscribe();
  }

  public init() {
/*     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // speech recognition API supported
    } else {
      // speech recognition API not supported

      //redirect to another page
      alert('SPEECH NOT SUPORTED');

    }


    this.recognition.start(); */
0

    // auto stop speech
    this.subscription = this.source.subscribe((val) => {
      if (this.isStoppedSpeechRecog === false && (this.lastTranscript.getTime() + 500) < (new Date().getTime() )) {
        const acction: Acction = this.findMatchedAction(this.finalWords);

        console.log(acction);
        if (acction.device === undefined || acction.command === undefined) {
          console.log('DEVICE OR COMMAND IS NULL');
          return;
        }


        this.appService.executeCommandStr((acction.device + "") || "", (acction.command+"") || "").subscribe(
          (response) => {
            console.log('SE EJECUTA EL PRIMERO');
            if (acction.time !== undefined) {


              setTimeout(
                () => {
                  this.appService.executeCommandStr((acction.device + "") || "", (Command.STOP+"") || "").subscribe(
                    () => {
                      this.stop();
                      console.log('SE EJECUTA EL SEGUNDO');
                    }
                  )

                } , (acction.time - .25) * 1000 );

            } else {
              this.stop();
            }


          },
          error => {
            console.log(error);
            this.error += JSON.stringify(error).toString();
            console.log(error);
            this.stop();
          }
        );
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
      this.finalWords = transcript.toString();
      this.lastTranscript = new Date();
    });
  }

  public start() {
    this.lastTranscript = new Date();
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

  private findMatchedAction(text: string): Acction {
    console.log(text);
    const wordsArr = text.split(' ');

    // Command
    const rollerCommands = [
      {
        command: Command.ON,
        keywords: ['subir', 'sube', 'abrir', 'abre', 'elevar', 'eleva']
      },
      {
        command: Command.OFF,
        keywords: ['baja', 'bajar', 'cierra', 'cerrar' ]
      },
      {
        command: Command.STOP,
        keywords: ['off', 'desactivar', 'parar', 'apagar', 'stop' ]
      }
    ];

    const doorKeywords        = ['puerta', 'door']
    const windowKeywords      = ['ventana', 'window'];
    const kitchenHallKeywords = ['salón','cocina', 'kitchen', 'salon', 'comedor'];
    const mainRoomKeywords    = ['principal', 'principal'];

    const devices = [
      {
        device: Devices.KITCHEN_DOOR,
        keywords: [
          kitchenHallKeywords,
          doorKeywords
        ],
        command: rollerCommands
      },
      {
        device: Devices.KITCHEN_WINDOW,
        keywords: [
          kitchenHallKeywords,
          windowKeywords,
        ],
        command: rollerCommands
      },
      {
        device: Devices.MAIN_ROOM_WINDOW,
        keywords: [
          mainRoomKeywords,
          windowKeywords,
        ],
        command: rollerCommands
      },
      {
        device: Devices.MAIN_ROOM_DOOR,
        keywords: [
          mainRoomKeywords,
          doorKeywords,
        ],
        command: rollerCommands
      },
    ];

    let acction: Acction = {
      device: undefined,
      command: undefined,
    };

    // let matchedDevice: Devices;
    // let matchedCommand: Command;

    devices.forEach(device => {

      if (acction.device && acction.command) {
        return;
      }

      let matched = true;

      // match all device keywords
      device.keywords.forEach(
        deviceKeyword => {
          // match device keyword
          if ( !this.simpleMatcher(wordsArr, deviceKeyword)) {
            matched = false;
            return;

          }
        }
      );

      if (!matched) {
        return;

      }

      acction.device = device.device;

      //device matched now match command
      // match all device keywords
      device.command.forEach(
        command => {
          let matched = true;

            // match device keyword
            if ( !this.simpleMatcher(wordsArr, command.keywords)) {
              matched = false;
              return;

            }

          if (!matched) {
            return;

          }

          acction.command = command.command;

        }
      );


      wordsArr.forEach(word => {
        if (isNaN(+word) === false) {
          acction.time = +word;
        }

      });

    });


    return acction;
  }



  private findCommand(command: any[]): Command {



    return Command.OFF;
  }


  private simpleMatcher(wordsArr: string[], keywordItem: string[]): boolean {
    let matched = false;

    wordsArr.forEach( wa => {
      if (matched){
        return;
      }
      keywordItem.forEach( ki => {
        if (this.levenshteinDistance(ki, wa) < 2) {
          matched = true;
          return;
        }
      });
    });


    //levenshteinDistance(s: string, t: string

    return matched;

  }




}
