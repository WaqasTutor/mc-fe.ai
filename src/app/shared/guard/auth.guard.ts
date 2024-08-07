import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { TokenAuthentication } from '../services/tokenAuthentication.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthenticationService, public router: Router, private tokenAuthentication: TokenAuthentication) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.auth.inMaintenance) {
      if (!NonMaintenanceRoutes.includes(route.url.join(""))) {
        this.router.navigate(['maintenance']);
        return false
      }
      return true
    } else if (NonMaintenanceRoutes.includes(route.url.join("")) && !this.auth.inMaintenance) {
      this.router.navigate(['']);
      return false
    } else {
      if (!this.auth.currentUserValue || this.tokenAuthentication.verifyTokenExpiry()) {
        if (!NonAuthRoutes.includes(route.url[0].path)) {
          localStorage.clear();
          this.router.navigate(['login']);
          return false
        }
        return true
      } else if (this.auth.currentUserValue) {
        if (NonAuthRoutes.includes(route.url.join(""))) {
          this.router.navigate(['']);
          return false
        }
        return true
      }
    }
  }
}


const NonAuthRoutes = [
  "login",
  "signup",
  "forgot-password",
  "reset-password",
  "new-password",
  "early-access"
]

const NonMaintenanceRoutes = [
  "maintenance"
]