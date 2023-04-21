import {BindingScope, injectable} from '@loopback/core';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
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
