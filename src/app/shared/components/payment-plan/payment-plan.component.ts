import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { finalize } from 'rxjs/operators';
import { PaymentStatus } from 'src/app/subscription/subscription.component';
import { data } from '../../database/faq.database';
import { PaymentService } from '../../proxy/payment/payment.service';
import { PlanInterface } from '../../proxy/subscription/subscription.interface';
import { SubscriptionService } from '../../proxy/subscription/subscription.service';
import { userStatus } from '../../proxy/user/user.interface';
import { userService } from '../../proxy/user/user.service';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss']
})
export class PaymentPlanComponent implements OnInit{
  paymentStatus = PaymentStatus;
  @Input() userUsage: any;
  @Input() disableId;
  @Input() modal: boolean = true;
  plan;
  starterLoading = false;
  proLoading = false;
  pageStatus;
  plans: PlanInterface;
  hideError = false;
  data = data;

  constructor(private subscriptionService: SubscriptionService, private paymentService: PaymentService,
    private route: Router,
    private activeRoute: ActivatedRoute, private user: userService) {

  }
  ngOnInit(): void {
    this.plan = this.userUsage ? this.userUsage.subscription_plan.period_billing : "month"
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
      }
    })
    this.subscriptionService.getPlans().subscribe(ele => {
      this.plans = ele;
    })
  }

  changePlan() {
    window.open(this.userUsage.upgrade_plan)
  }

  buyPackage(id, type) {
    if (type == 'starter') {
      this.starterLoading = true
    } else {
      this.proLoading = true
    }
    this.paymentService.getPlans().subscribe(ele => {
      loadStripe(ele.public_key).then(onfulFilled => {
        this.paymentService.getSessionId({ plan_id: id }).subscribe(ele => {
          localStorage.setItem('session_id', ele.session_id);
          onfulFilled.redirectToCheckout({ sessionId: ele.session_id }).then(output => {
          })
        })
      })
    })

  }
}
