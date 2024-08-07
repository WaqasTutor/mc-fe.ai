import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          //this.loginService.logout();
          // tslint:disable-next-line: deprecation
          //location.reload(true);
        }
        if (err.error && err.error.status) {
          this.message.error(err.error.message);
        }
        else {
          this.message.error(err.statusText);
        }
        return throwError(err);
      }))
  }
}
