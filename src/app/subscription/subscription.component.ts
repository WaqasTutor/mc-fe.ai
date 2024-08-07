import { Component } from '@angular/core'
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/shared/proxy/payment/payment.service';
import { PlanInterface } from 'src/app/shared/proxy/subscription/subscription.interface';
import { SubscriptionService } from 'src/app/shared/proxy/subscription/subscription.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from 'src/app/shared/proxy/user/user.service';
import { userStatus } from 'src/app/shared/proxy/user/user.interface';
import { data } from '../shared/database/faq.database';
export enum PaymentStatus {
  cancel = 'payment-cancelled',
  success = 'success'
}
@Component({
  templateUrl: './subscription.component.html', styleUrls: ['./subscription.component.scss']
})

export class SubscriptionComponent {
  paymentStatus = PaymentStatus;
  plan = 'year';
  loading = false;
  plans: PlanInterface;
  selectedId;
  pageStatus;
  hideError = false;
  data = data;
  constructor(private subscriptionService: SubscriptionService, private paymentService: PaymentService,
    private route: Router,
    private activeRoute: ActivatedRoute, private user: userService) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activeRoute.params.subscribe(ele => {
      this.pageStatus = ele.status
      if (ele.status === PaymentStatus.success) {
        this.activeRoute.queryParams.subscribe(query => {
          if (query.session_id && query.session_id === localStorage.getItem('session_id')) {
            this.user.getUser().subscribe(user => {
              this.user.updateUser({
                onboarding_step: userStatus.COMPLETE
              }, user.uuid).subscribe(ele => {
                this.user.updateUserLocal({ ...user, onboarding_step: userStatus.COMPLETE })
                localStorage.removeItem('session_id')
                this.route.navigate(['']);
              })
            })

          }
          else {
            this.pageStatus = PaymentStatus.cancel;
          }
        })

      } else {
      }
    })
  }

  planChange() {

  }
  buyPackage(id) {
    this.loading = true;
    this.paymentService.getPlans().subscribe(ele => {
      loadStripe(ele.public_key).then(onfulFilled => {
        this.loading = true;
        this.paymentService.getSessionId({ plan_id: id }).pipe(finalize(() => this.loading = false)).subscribe(ele => {
          this.loading = true;
          localStorage.setItem('session_id', ele.session_id);
          onfulFilled.redirectToCheckout({ sessionId: ele.session_id }).then(output => {
            console.log('Return', output);
          }).finally(() => {
            this.loading = false;
          });
        })
      }).finally(() => {
        this.loading = false;
      });
    })

  }
  growDiv(i) {
    var growDiv = document.getElementById(`grow${i}`) as HTMLElement;
    if (growDiv.clientHeight) {
      growDiv.style.height = '0px';
    } else {
      var wrapper = document.querySelector(`.measuringWrapper${i}`);
      let temp = wrapper.clientHeight;
      growDiv.style.height = temp + "px";

    }
  }
}
