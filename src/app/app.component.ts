import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Command, Devices } from './enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');

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

}
