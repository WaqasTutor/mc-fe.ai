import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { finalize } from 'rxjs/operators';
import { userService } from './../../shared/proxy/user/user.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  googleLoading = false;

  constructor(private fb: FormBuilder, private authService: SocialAuthService, private route: Router, private auth: AuthenticationService, private message: NzMessageService, private userService: userService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((?!.*\.\.)[a-zA-Z0-9-]{1,253})+?\.[a-zA-Z]{2,24}$/)]],
      password: [null, [Validators.required]]
    });
  }
  googleLogin() {
    this.googleLoading = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(ele => {
      this.auth.googleLogin(ele).pipe(finalize(() => {
        this.googleLoading = true;
      })).subscribe(res => console.log(res));
    }).catch(ele => {
      console.log(ele);
    }).finally(() => this.googleLoading = false);
  }
  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.auth.login({ ...this.loginForm.value }).pipe(finalize(() => this.loading = false)).subscribe(ele => {
        if (!ele.data) {
          this.message.error(ele.message);
        }
        else {
          this.userService.getUser().subscribe(ele => { });
          // this.message.success(ele.message);
        }
      }, (err) => {
        console.log(err);
      })
    }
    else {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
