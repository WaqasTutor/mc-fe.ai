import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { PaymentStatus } from 'src/app/subscription/subscription.component';
import { data } from '../../database/faq.database';
import { PaymentService } from '../../proxy/payment/payment.service';
import { PlanInterface } from '../../proxy/subscription/subscription.interface';
import { SubscriptionService } from '../../proxy/subscription/subscription.service';
import { userStatus } from '../../proxy/user/user.interface';
import { userService } from '../../proxy/user/user.service';

@Component({
  selector: 'app-payment-plans',
  templateUrl: './payment-plans.component.html',
  styleUrls: ['./payment-plans.component.scss']
})
export class PaymentPlansComponent implements OnInit {
  @Input() userUsage: any;
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
    private activeRoute: ActivatedRoute, private user: userService,
    private modal: NzModalRef) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.activeRoute.params.subscribe(ele => {
    //   this.pageStatus = ele.status
    //   if (ele.status === PaymentStatus.success) {
    //     this.activeRoute.queryParams.subscribe(query => {
    //       if (query.session_id && query.session_id === localStorage.getItem('session_id')) {
    //         this.user.getUser().subscribe(user => {

    //           this.user.updateUser({
    //             onboarding_step: userStatus.COMPLETE
    //           }, user.uuid).subscribe(ele => {
    //             this.user.updateUserLocal({ ...user, onboarding_step: userStatus.COMPLETE })
    //             localStorage.removeItem('session_id')
    //             this.route.navigate(['']);
    //           })
    //         })

    //       }
    //       else {
    //         this.pageStatus = PaymentStatus.cancel;
    //       }
    //     })

    //   }
    // })
    // this.subscriptionService.getPlans().subscribe(ele => {
    //   this.plans = ele;
    // })
  }

  closeModal(): void {
    this.modal.close();
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
}
