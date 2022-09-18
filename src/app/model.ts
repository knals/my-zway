import { Command, Devices } from "./enums";

export class Acction {
  device?: Devices;
  command?: Command;
  time?: number; // time in seconds
}
