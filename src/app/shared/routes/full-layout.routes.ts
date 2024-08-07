import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { SignUpComponent } from './../../authentication/sign-up/sign-up.component';
import { AuthGuard } from '../guard/auth.guard';
import { UserRoleGuard } from '../guard/user-role.guard';
import { userStatus } from '../proxy/user/user.interface';
import { UnsuccessfulSubscriptionsComponent } from 'src/app/unsuccessful-subscriptions/unsuccessful-subscriptions.component';
import { ForgotPasswordComponent } from 'src/app/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/authentication/reset-password/reset-password.component';
import { WelcomeFormComponent } from 'src/app/welcome/welcome-form/welcome-form.component';
import { SubscriptionComponent } from 'src/app/subscription/subscription.component';
import { MaintenanceComponent } from 'src/app/maintenance/maintenance.component';
export const FullLayout_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Login'
    }
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Signup'
    }

  },
  {
    path: 'unsuccessful',
    component: UnsuccessfulSubscriptionsComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Payment Unsuccessful'
    }
  }, {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Forgot Password'
    }
  }, {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Reset Password'
    }
  },
  {
    path: 'onboarding',
    canActivate: [AuthGuard, UserRoleGuard],
    component: WelcomeFormComponent,
    data: {
      title: 'Onboarding',
      userStatus: userStatus.ONBOARDING
    }
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Subscription',
      userStatus: userStatus.SUBSCRIPTION
    }
  },
  {
    path: 'subscription/:status',
    component: SubscriptionComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Subscription',
      userStatus: userStatus.SUBSCRIPTION
    }
  },{
    path: 'update-payment-details',
    component: UnsuccessfulSubscriptionsComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Update Payment Details'
    }
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'We are currently down for a bit of maintenance',
    }
  },
  {
    path: 'early-access',
    component: MaintenanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Early Access'
    }
  }
];
