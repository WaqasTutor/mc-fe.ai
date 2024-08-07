import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { signupInput, UserInterface, userStatus } from '../proxy/user/user.interface';
import { userService } from 'src/app/shared/proxy/user/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface ResponseInterface {
  status?: string;
  message?: string;
  data?: Data;
}
export interface Data {
  auth_token?: string;
  user?: UserInterface;
}


export interface Workspace {
  name?: string;
  created_on?: Date;
  admin_user_uuid?: null;
  uuid?: string;
}


@Injectable()
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('token'));
  public currentUser: Observable<string>;
  constructor(private http: HttpClient, private handler: HttpBackend, private route: Router, private user: userService, private notify: NzNotificationService) {
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }
  login(data) {
    return this.http.post<ResponseInterface>(environment.apiUrls.auth.login, data)
      .pipe(tap(({data, status}) => {
        if (data) {
          localStorage.setItem('token', JSON.stringify(data.auth_token));
          this.currentUserSubject.next(data.auth_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.user.updateUserLocal(data.user);
          this.route.navigate(['']);
        }
        if (status == 'redirect') {
          this.route.navigateByUrl('/early-access')
        }
      }));
  }
  googleLogin(loginData) {
    return this.http.post<ResponseInterface>(environment.apiUrls.auth.googleLogin, loginData)
      .pipe(tap(({status, data}) => {
        if (data) {
          localStorage.setItem('token', JSON.stringify(data.auth_token));
          this.currentUserSubject.next(data.auth_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.user.updateUserLocal(data.user);
          this.route.navigate([''])
        }
        if (status == 'redirect') {
          this.route.navigateByUrl('/early-access')
        }
      }));
  }

  register(userInput: signupInput): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(environment.apiUrls.auth.signup, userInput).pipe(tap(({data, status}) => {
      if (data) {
        localStorage.setItem('token', JSON.stringify(data.auth_token));
        this.currentUserSubject.next(data.auth_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.user.updateUserLocal(data.user);
        this.route.navigate([''])
      }
      if (status == 'redirect') {
        this.route.navigateByUrl('/early-access')
      }
    }));
  }
  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.route.navigate(['login'])
  }

  forgotPassword(email: string) {
    return new HttpClient(this.handler).post<ResponseInterface>(environment.apiUrls.auth.forgotPassword, { email })
      .pipe(
        tap(() => {
          this.notify.success('Reset Password', 'Check your inbox for the reset password link.')
        }),
        catchError(err => of(
          this.notify.error('Email Verification', `${err.error.message}.`)))
      )
  }

  resetPassword(new_password: string, confirm_password: string, reset_token: string) {
    return new HttpClient(this.handler).post<ResponseInterface>(environment.apiUrls.auth.resetPassword, {
      new_password,
      confirm_password,
      reset_token
    }).pipe(tap(() => {
      this.notify.success('Reset Password', 'Your password has reset successfully.', {
        nzDuration: 3000
      })
        .onClose!.pipe(
          tap(() => this.route.navigate(['login']))
        ).subscribe()
    }),
      catchError(err => {
        this.notify.error('Token Verification', `${err.error.message}. Please enter your email again.`, {
          nzDuration: 3000
        }).onClose.pipe(
          tap(() => this.route.navigate(["forgot-password"]))
        ).subscribe()
        return throwError(err)
      }))
  }
  
  public get inMaintenance(): boolean {
    return environment.inMaintenance
  }
}
