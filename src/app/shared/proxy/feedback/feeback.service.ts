// https://doorbell.io/api/applications/12529/submit?key=AgEvm1hkkyekGgTDmKs0XCsnmrUDGLqPv5IFOZmWXAWVS4EeO3TvqJlqKkDpXyyu

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageInterface } from './../common.interface';
import { map, tap } from 'rxjs/operators';
import { FeedbackInputInterface } from './feeback.interface';
import { userService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  constructor(private http: HttpClient, private userService: userService) {

  }
  sendFeedback(input: FeedbackInputInterface) {
    let requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({'Authorization': `Bearer ${this.userService.currentAuth}`}), 
    };
    return this.http.post<any>(environment.apiUrls.feedback, input, requestOptions).pipe();
  }
}
