import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthenticationService } from './authentication.service';


@Injectable()
export class TokenAuthentication {
  helper = new JwtHelperService();
  constructor(private authenticationService: AuthenticationService) {

  }
  verifyTokenExpiry() {
    let token = this.authenticationService.currentUserValue;
    if (token) {
      if (this.helper.isTokenExpired(token)) this.authenticationService.logout();
      return this.helper.isTokenExpired(token);
    }
    return false;
  }
}
