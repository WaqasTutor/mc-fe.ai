import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { userService } from 'src/app/shared/proxy/user/user.service';
import { finalize, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MixpanelService } from 'src/app/shared/services/mixpanel.service';


@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {

  signUpForm: FormGroup;
  loading = false;
  googleLoading = false;
  referralCode: any;

  submitForm(): void {
    if (!this.signUpForm.valid) {
      for (const i in this.signUpForm.controls) {
        this.signUpForm.controls[i].markAsDirty();
        this.signUpForm.controls[i].updateValueAndValidity();
      }
    } else {
      this.signup();
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value || control.value.length === 0) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
      return { error: true };
    }
  }

  constructor(private fb: FormBuilder, private user: AuthenticationService, private authService: SocialAuthService, private route: Router,private _activatedRoute: ActivatedRoute, private mixpanel: MixpanelService) {
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.pipe(tap((params) => {
      this.mixpanel.track('Sign up page visited', {
        ...params
      });
    })).subscribe(
      (params) => {
        this.referralCode = params['referral'];
      }
    );
    this.signUpForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((?!.*\.\.)[a-zA-Z0-9-]{1,253})+?\.[a-zA-Z]{2,24}$/)]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      agree: [null, [Validators.required]]
    });
  }
  signup() {
    this.loading = true;
    // if(this.referralCode != ''){
    //   {...this.signUpForm.value,'referral' : this.referralCode }
    // }
    this.user.register({...this.signUpForm.value,'referral' : this.referralCode}).pipe(finalize(() => this.loading = false)).subscribe(ele => {
    })
  }
  googleLogin() {
    this.googleLoading = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(ele => {
      this.loading = true;
      this.user.googleLogin(ele).pipe(finalize(() => 
        this.googleLoading = false
      )).subscribe()
    }).catch(ele => {
    }).finally(() => this.googleLoading = false);
  }
  requiredChange(required: boolean): void {
    if (!required) {
      this.signUpForm.get('agree')!.clearValidators();
      this.signUpForm.get('agree')!.markAsPristine();
    } else {
      this.signUpForm.get('agree')!.setValidators(Validators.required);
      this.signUpForm.get('agree')!.markAsDirty();
    }
    this.signUpForm.get('agree')!.updateValueAndValidity();
  }
}
