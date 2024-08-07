import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { SearchPipe } from './pipes/search.pipe';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';


import { PaymentPlansComponent } from './components/payment-plans/payment-plans.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { PaymentPlanComponent } from './components/payment-plan/payment-plan.component';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NzIconModule,
    PerfectScrollbarModule,
    SearchPipe,
    NzRadioModule,
    PaymentPlansComponent,
    PaymentPlanComponent,
    InfoCardComponent,
    NzCardModule,
    NzButtonModule,

  ],
  imports: [
    RouterModule,
    CommonModule,
    NzIconModule,
    NzToolTipModule,
    PerfectScrollbarModule,
    NzRadioModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzAvatarModule,
    NzButtonModule
  ],
  declarations: [
    SearchPipe,
    InfoCardComponent,
    PaymentPlanComponent,
    PaymentPlansComponent
  ],
  providers: [
    ThemeConstantService
  ]
})

export class SharedModule { }
