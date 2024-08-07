import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  reset_token = null;
  constructor(private fb: FormBuilder, private authService: SocialAuthService, private router: Router, private route: ActivatedRoute, private auth: AuthenticationService) {
  }
  submitForm() {
    if (!this.resetForm.valid) {
      for (const i in this.resetForm.controls) {
        this.resetForm.controls[i].markAsDirty();
        this.resetForm.controls[i].updateValueAndValidity();
      }
    } else {
      this.loading = true;
      this.auth.resetPassword(this.resetForm.get('password').value, this.resetForm.get('checkPassword').value, this.reset_token)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe()
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe(({ token }) => {
      if (token) { this.reset_token = token }
    })
    this.resetForm = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.resetForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value || control.value.length === 0) {
      return { required: true };
    } else if (control.value !== this.resetForm.controls.password.value) {
      return { error: true };
    }
  }

}
