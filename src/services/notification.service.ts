/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {BindingScope, injectable} from '@loopback/core';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor() {}

  /**
   *
   * @param data object with destinationEmail: string,
   *  destinationName: string ,contectEmail: string ,
   * subjectEmail: string
   * @param url
   * @returns boolean
   */
  SendNotification(data: any, url: string): boolean {
    try {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-type': 'application/json'},
      });
      return true;
    } catch {
      return false;
    }
  }
}
