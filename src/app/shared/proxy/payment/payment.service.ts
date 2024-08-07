import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { createCheckoutSessionInput } from './payment.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private http: HttpClient) { }
  getPlans(): Observable<any> {
    return this.http.get<any>(environment.apiUrls.payments.config);
  }
  getSessionId(input: createCheckoutSessionInput): Observable<any> {
    return this.http.post<any>(environment.apiUrls.payments.checkoutSession, input);
  }
}
