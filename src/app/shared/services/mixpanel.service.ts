import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {
  init(token: string, config: Partial<mixpanel.Config>): void {
    mixpanel.init(token, {...config});
  }

  track(id: string, action: any = {}): void {
    mixpanel.track(id, action);
  }
}