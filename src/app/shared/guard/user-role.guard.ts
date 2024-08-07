import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userService } from 'src/app/shared/proxy/user/user.service';
import { userStatus } from '../proxy/user/user.interface';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleGuard implements CanActivate {
  constructor(
    private user: userService,
    private router: Router,
    private auth: AuthenticationService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.currentUserValue) {
      return this.user.getUser().pipe(
        map((user) => {
          if (
            route.data.userStatus &&
            user.onboarding_step == route.data.userStatus
          ) {
            if (route.data.userStatus == userStatus.COMPLETE) {
              if (subscriptionRoutes.includes(user.subscription_status)) {
                this.router.navigate(['subscription']);
                return
              } else if (updatePaymentRoutes.includes(user.subscription_status)) {
                this.router.navigate(['update-payment-details']);
                return
              }
            }
            return true
          }
          if (user.onboarding_step == userStatus.ONBOARDING) {
            this.router.navigate(['onboarding']);
          } else if (user.onboarding_step == userStatus.SUBSCRIPTION) {
            this.router.navigate(['subscription']);
          } else if (user.onboarding_step == userStatus.COMPLETE) {
            if (!updatePaymentRoutes.concat(subscriptionRoutes).includes(user.subscription_status)) {
              if (!checkRoute(route, 'subscription') && !checkRoute(route, 'update-payment-details')) {
                return true;
              }
              this.router.navigate([''])
            } else if (subscriptionRoutes.includes(user.subscription_status)) {
              if (checkRoute(route, 'subscription')) {
                return true;
              }
              this.router.navigate(['subscription']);
            } else if (updatePaymentRoutes.includes(user.subscription_status)) {
              if (checkRoute(route, 'update-payment-details')) {
                return true;
              }
              this.router.navigate(['update-payment-details']);
            } else {
              this.router.navigate(['']);
            }
            return;
          } else {
            this.auth.logout();
          }
        })
      );
    }
    this.router.navigate(['login']);
    return;
  }
}

const updatePaymentRoutes = ['unpaid'];

const subscriptionRoutes = ['incomplete', 'incomplete_expired', 'canceled', 'past_due'];

const checkRoute = (route: ActivatedRouteSnapshot, url: string) => {
  return route.url[0].path === url
}
