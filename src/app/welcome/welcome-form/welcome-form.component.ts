import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface, userStatus } from 'src/app/shared/proxy/user/user.interface';
import { userService } from 'src/app/shared/proxy/user/user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrls: ['./welcome-form.component.scss']
})
export class WelcomeFormComponent implements OnInit {
  step = 1;
  radioValue;
  otherValue = '';
  options = [{ value: 'Hello', label: 'Marketing' },
  { value: 'other', label: 'other' }];
  checkboxes = ['Emails', 'Social Media Content', 'Digital Ads Copy', 'Website/Landing page copy', 'Blogs & Articles', 'Product Descriptions',  'Sales Copy', 'Writing Tools', 'Brainstorming / Idea Generation', 'Other'];
  name;
  checked = [];
  userData: UserInterface;
  loading = false;
  constructor(private user: userService, private route: Router) { }

  ngOnInit(): void {
    this.user.getUser().subscribe(ele => {
      this.userData = ele;
      this.name = ele.first_name;
    })
  }
  // http://localhost:4200/subscription/success?session_id=cs_test_b1btrRElOnIauqEezhTJxsBBDl4L8ytIIdw79s4BUU56brwaa99GyBtRG9
  redirectPricing() {
    this.loading = true;
    this.user.updateUser({
      role: this.radioValue != 'other' ? this.radioValue : this.otherValue,
      use_case: this.checked.join(','),
      onboarding_step: userStatus.COMPLETE
    }, this.userData.uuid).pipe(finalize(() => this.loading = false)).subscribe(ele => {
      this.user.updateUserLocal({ ...this.userData, onboarding_step: userStatus.COMPLETE });
      // this.route.navigate(['subscription']) ;
      this.route.navigate(['']) ;
    });

  }
  checkField(value) {
    return this.checked.includes(value);
  }
  checkChange(event, val) {
    if (event.target.checked) {
      this.checked.push(val)
    } else {
      this.checked = this.checked.filter(ele => ele != val);
    }
  }

}
