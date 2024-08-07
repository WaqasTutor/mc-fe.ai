import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: SocialAuthService, private route: Router, private auth: AuthenticationService) {
  }
  submitForm() {
    if (!this.forgotPasswordForm.valid) {
      for (const i in this.forgotPasswordForm.controls) {
        this.forgotPasswordForm.controls[i].markAsDirty();
        this.forgotPasswordForm.controls[i].updateValueAndValidity();
      }
    } else {
      this.loading = true;
      this.auth.forgotPassword(this.forgotPasswordForm.get('email').value)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe()
    }
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((?!.*\.\.)[a-zA-Z0-9-]{1,253})+?\.[a-zA-Z]{2,24}$/)]]
    });
  }
}
