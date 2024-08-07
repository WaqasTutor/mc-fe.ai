import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Details } from '../shared/interfaces/user.type';
import { UserInterface } from '../shared/proxy/user/user.interface';
import { userService } from '../shared/proxy/user/user.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-unsuccessful-subscriptions',
  templateUrl: './unsuccessful-subscriptions.component.html',
  styleUrls: ['./unsuccessful-subscriptions.component.scss'],
})
export class UnsuccessfulSubscriptionsComponent implements OnInit {
  user: UserInterface;
  usage: Details = null;

  constructor(
    private auth: AuthenticationService,
    private userService: userService
  ) {}

  ngOnInit(): void {
    this.userService.getUser()
      .pipe(
        map((user) => {
          this.user = user;
        })
      ).subscribe();

    this.userService.getUsage()
      .pipe(
        map((usage) => {
          usage.billing_cycle_renewal = moment(moment(usage.billing_cycle_renewal)).fromNow();
          this.usage = usage;
        })
      ).subscribe();
  }
  reload() {
    window.location.reload();
  }

  updateDetails() {
    window.open(this.usage.edit_payment_details);
  }

  logout() {
    this.auth.logout();
  }
}
