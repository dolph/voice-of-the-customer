import { Injectable } from '@angular/core';

@Injectable()
export class FromComponentService {

  private from: string
  private storage: any

  constructor() { }

  public setFrom(value: string) {
    //console.log('Setting from Component to ' + value)
    this.from = value
  }

  public getFrom() {
    return this.from
  }

  public setData(value: any) {
    this.storage = value
  }

  public getData() {
    return this.storage
  }
}
