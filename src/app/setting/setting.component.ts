import { Component, ViewContainerRef } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { userService } from '../shared/proxy/user/user.service';
import { User } from '../shared/interfaces/user.type';
import { UserInterface } from '../shared/proxy/user/user.interface';
import { finalize } from 'rxjs/operators';
import { ContentBoxModalComponent } from '../ai-content-output/components/content-box-modal/content-box-modal.component';
import { PaymentPlansComponent } from '../shared/components/payment-plans/payment-plans.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { SubscriptionService } from '../shared/proxy/subscription/subscription.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent {
  formatOne = (percent: number) => `${percent} Days`;
  constructor(private modal: NzModalService, private viewContainerRef: ViewContainerRef, private fb: FormBuilder, private modalService: NzModalService, private message: NzMessageService, private notify: NzNotificationService, private user: userService, private route: ActivatedRoute, private router: Router, private subscriptionService: SubscriptionService) { }

  openModal() {
    const modal = this.modal.create({
      nzClosable: false,
      nzCentered: true,
      nzWidth: "65%",
      nzFooter: [],
      nzWrapClassName: 'content-modal payment-modal',
      nzContent: PaymentPlansComponent,
      nzAutofocus: null,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        userUsage: this.userUsage
      },

    });
    // Return a result when closed
    modal.afterClose.subscribe((result) => {

    });
  }
  selectedTabIndex: number;
  wordsPercentage: number;
  userUsage: any;
  changePWForm: FormGroup;
  profileSetting: FormGroup;
  avatarUrl: string = "http://www.themenate.net/applicator/dist/assets/images/avatars/thumb-13.jpg";
  selectedCountry: any;
  selectedLanguage: any;
  networkList = [
    {
      name: 'Facebook',
      icon: 'facebook',
      avatarColor: '#4267b1',
      avatarBg: 'rgba(66, 103, 177, 0.1)',
      status: true,
      link: 'https://facebook.com'
    }
  ];

  notificationConfigList = [
    {
      title: "Everyone can look me up",
      desc: "Allow people found on your public.",
      icon: "user",
      color: "ant-avatar-blue",
      status: true
    },
    {
      title: "Everyone can contact me",
      desc: "Allow any peole to contact.",
      icon: "mobile",
      color: "ant-avatar-cyan",
      status: true
    },
    {
      title: "Show my location",
      desc: "Turning on Location lets you explore what's around you.",
      icon: "environment",
      color: "ant-avatar-gold",
      status: false
    },
    {
      title: "Email Notifications",
      desc: "Receive daily email notifications.",
      icon: "mail",
      color: "ant-avatar-purple",
      status: true
    },
    {
      title: "Unknow Source ",
      desc: "Allow all downloads from unknow source.",
      icon: "question",
      color: "ant-avatar-red",
      status: false
    },
    {
      title: "Data Synchronization",
      desc: "Allow data synchronize with cloud server",
      icon: "swap",
      color: "ant-avatar-green",
      status: true
    },
    {
      title: "Groups Invitation",
      desc: "Allow any groups invitation",
      icon: "usergroup-add",
      color: "ant-avatar-orange",
      status: true
    },
  ];
  loading = false;
  userData: UserInterface;
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.changePWForm.controls.confirmPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value || control.value.length === 0) {
      return { required: true };
    } else if (control.value !== this.changePWForm.controls.newPassword.value) {
      return { error: true };
    }
  }
  ngOnInit(): void {
    this.createCancelSubscriptionForm();
    this.changePWForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]]
    });

    this.user.getUser().subscribe(ele => {
      this.userData = ele;
      this.profileSetting = this.fb.group({
        first_name: [ele.first_name, [Validators.required]],
        last_name: [ele.last_name, [Validators.required]],
        email: [ele.email, [Validators.required, Validators.pattern(/^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((?!.*\.\.)[a-zA-Z0-9-]{1,253})+?\.[a-zA-Z]{2,24}$/)]],
      });

      this.user.getUserUsage(ele.uuid).pipe(finalize(() => this.loading = false)).subscribe((ele: any) => {
        ele.subscription_plan.name = ele.subscription_plan.name.split('_').join(' ');
        ele.billing_cycle_renewal = moment(new Date(ele.billing_cycle_renewal)).fromNow();
        this.userUsage = ele;
        this.wordsPercentage = Math.round((this.userUsage.words_generated_current_month / this.userUsage.total_words_in_plan) * 100);
      });
    });

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.route.snapshot.url[1].path === 'profile') {
          this.selectedTabIndex = 0;
        } else {
          this.selectedTabIndex = 1;
        }
      }
    })

    if (this.route.snapshot.url[1].path === 'profile') {
      this.selectedTabIndex = 0;
    } else {
      this.selectedTabIndex = 1;
    }
  }

  onTabClick(title: any):void {
    if (title === 'account') {
      this.router.navigateByUrl('/settings/profile')
    } else {
      this.router.navigateByUrl('/settings/usage-billing')
    }
  }

  viewBillingHistory(): void {
    window.open(this.userUsage.billing_history)
  }

  onCancel(): void {
    window.open(this.userUsage.cancel_subscription);
  }

  editPayment(): void {
    window.open(this.userUsage.edit_payment_details);
  }

  showConfirm(title): void {
    // this.modalService.confirm({
    //   nzTitle: '<i>Do you want to change your password?</i>',
    //   nzOnOk: () => this.message.success('Password Change Successfully')
    // });
  }

  submitForm(): void {
    for (const i in this.changePWForm.controls) {
      this.changePWForm.controls[i].markAsDirty();
      this.changePWForm.controls[i].updateValueAndValidity();
    }

    let data = {
      current_password: this.changePWForm.controls.oldPassword.value,
      new_password: this.changePWForm.controls.newPassword.value,
      confirm_password: this.changePWForm.controls.confirmPassword.value,
      auth_token: this.user.getToken().split('"').join(''),
    }

    this.user.updatePassword(data).pipe(finalize(() => this.loading = false)).subscribe(ele => {
      this.changePWForm.reset();
      this.message.success('Password updated successfully');
    });

    // this.showConfirm();
  }
  UpdateProfileSubmitForm(): void {
    if (!this.profileSetting.valid) {
      for (const i in this.profileSetting.controls) {
        this.profileSetting.controls[i].markAsDirty();
        this.profileSetting.controls[i].updateValueAndValidity();
      }
      return;
    }
    this.loading = true;
    this.user.updateUser({
      ...this.profileSetting.value
    }, this.userData.uuid).pipe(finalize(() => this.loading = false)).subscribe(ele => {
      this.message.success('User updated successfully')
      this.user.updateUserLocal({ ...this.userData, ...this.profileSetting.value });
    });
  }


  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.avatarUrl = img;
    });
  }

  cancelSubscriptionBodyStyle:any = {
    'height': '420px',
    'overflow-y': 'auto'
  }
  cancelSubscriptionFormVisible = false;
  showCancelSubscriptionForm(): void {
    this.cancelSubscriptionFormVisible = true;
  }
  cancel_subscription_form:any;
  createCancelSubscriptionForm() {
    this.cancel_subscription_form = this.fb.group({
      'subscription_duration': ['', Validators.required],
      'subscription_usage': ['', Validators.required],
      'suscription_satisfaction': ['', Validators.required],
      'cancel_reason': ['', Validators.required],
      'other_reason': ['', Validators.required],
      'future_usage': ['', Validators.required],
      'recommend': ['', Validators.required],
      'suggestions': ['', Validators.required]
    })
  }

  submitCancelSubscriptionData() {
    if(this.cancel_subscription_form.valid) {
      let data = this.cancel_subscription_form.value;
      this.subscriptionService.cancelPlan(data).subscribe((response:any) => {
        this.cancelSubscriptionFormVisible = false;
        this.notify.error('Subscription cancelled', response.message);
      }, error => {
        console.log(error)
      })
    }
  }

  handleCancel() {

  }
}
