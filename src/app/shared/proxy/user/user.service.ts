import { Details } from '../../interfaces/user.type';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, Observable, ObservableInput } from 'rxjs';
import { UserInterface, signupInput, signupOutput, UserUpdateInput, UserUpdatePassword } from './user.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class userService {
  private currentUserSubject: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(JSON.parse(localStorage.getItem('user')));
  public currentUser: Observable<UserInterface>;
  private currentAuthSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('token'));
  public currentAuth: Observable<string>;
  private UsageSubject: BehaviorSubject<Details> = new BehaviorSubject<Details>(null);;
  public UsageObservable: Observable<Details>
  constructor(private http: HttpClient) {
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentAuth = this.currentAuthSubject.asObservable();
    this.UsageObservable = this.UsageSubject.asObservable();
  }
  user(): Observable<UserInterface> {
    return this.http.get<UserInterface>(environment.apiUrls.auth.user).pipe(tap((res) => {
      localStorage.setItem('user', JSON.stringify(res));
      this.currentUserSubject.next(res);
    }))
  }
  getUser(): Observable<UserInterface> {
    let user: UserInterface;
    if (this.currentUserSubject.value) {
      return from<ObservableInput<UserInterface>>([this.currentUserSubject.value])
    } else {
      return this.user()
    }
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
  updateUser(data: UserUpdateInput, uuid: string) {
    return this.http.put(environment.apiUrls.user.update + uuid, data);
  }
  updatePassword(data: UserUpdatePassword) {
    return this.http.post(environment.apiUrls.auth.changePassword, data);
  }
  getUserUsage(uuid: string) {
    const header = {headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)}
    return this.http.get(environment.apiUrls.user.usage + uuid + '/usage', header);
  }
  deleteUser(uuid: string) {
    const header = {headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)}
    return this.http.get(environment.apiUrls.user.delete + uuid, header);
  }
  updateUserLocal(user: UserInterface) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders({'Authorization': `Bearer ${this.currentAuthSubject.value}`}), 
  };
  usage(): Observable<UserInterface> {
    return this.http.get<UserInterface>(environment.apiUrls.auth.user).pipe(tap((res) => {
      localStorage.setItem('user', JSON.stringify(res));
      this.currentUserSubject.next(res);
    }))
  }
  getUsage(): Observable<Details> {
    return this.http.get<Details>(`${environment.apiUrls.user.details}${this.currentUserSubject.value.uuid}/usage`, this.requestOptions)
    .pipe(tap((details) => this.UsageSubject.next(details)))
  }
  getReferral(): Observable<{referral_link: string}> {
    return this.http.get<{referral_link: string}>(`${environment.apiUrls.user.referral}${this.currentUserSubject.value.uuid}/referral`)
  }
}