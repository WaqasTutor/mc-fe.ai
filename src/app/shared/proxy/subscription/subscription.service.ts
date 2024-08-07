import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PlanInterface } from './subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }
  getPlans(): Observable<PlanInterface> {
    return this.http.get<PlanInterface>(environment.apiUrls.subscription.plans);
  }

  cancelPlan(data:any): Observable<PlanInterface> {
    return this.http.post<PlanInterface>(environment.apiUrls.subscription.cancel, data);
  }
}
