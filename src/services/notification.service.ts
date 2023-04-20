/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {BindingScope, injectable} from '@loopback/core';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor() {}

  SendNotification(data: any, url: string) {
    fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-type': 'application/json'},
    });
  }

  
}
