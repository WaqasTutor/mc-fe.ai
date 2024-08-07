import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { registerLocaleData, PathLocationStrategy, LocationStrategy } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { AiContentComponent } from './ai-content/ai-content.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormModule } from './shared/ui-form/ui-form.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { TemplateBarComponent } from './ai-content/template-bar/template-bar.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ContentBoxComponent } from './ai-content/content-box/content-box.component';
// import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';
import { JwtInterceptor } from './shared/interceptor/token.interceptor';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { AuthGuard } from './shared/guard/auth.guard';
import { AuthenticationService } from './shared/services/authentication.service';
import { TokenAuthentication } from './shared/services/tokenAuthentication.service';
import { LoginComponent } from './authentication/login/login.component';
import { TemplateComponent } from './template/template.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { SettingComponent } from './setting/setting.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { UnsuccessfulSubscriptionsComponent } from './unsuccessful-subscriptions/unsuccessful-subscriptions.component';
import { WelcomeFormComponent } from './welcome/welcome-form/welcome-form.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ProjectsComponent } from './projects/projects.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { DocumentEditorModule } from './document-editor/document-editor.module';
import { LayoutModule } from '@angular/cdk/layout';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { EllipsisModule } from 'ngx-ellipsis';
import { FileText, Clock,MessageSquare, Folder, Save, Copy, Trash, Flag, File, Circle, XCircle, Plus, Edit } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { Google_oAuth } from 'src/environments/environment';
registerLocaleData(en);
const antdModule = [
  NzProgressModule,
  NzAvatarModule,
  NzBadgeModule,
  NzRadioModule,
  NzDropDownModule,
  NzListModule,
  NzDrawerModule,
  NzDividerModule,
  NzToolTipModule,
  NzSwitchModule,
  NzInputModule,
  NzButtonModule,
  NzSelectModule,
  NzFormModule,
  NzMessageModule,
  NzNotificationModule,
  NzSkeletonModule,
  NzStepsModule,
  NzCardModule,
  NzTagModule,
  NzModalModule,
  NzTabsModule,
  NzUploadModule,
  NzDatePickerModule,
  NzPaginationModule,
  NzCarouselModule,
  DocumentEditorModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzRateModule,
  NzStepsModule,
  EllipsisModule,
  PerfectScrollbarModule
];

const icons = {
  FileText,
  Clock,
  Folder,
  Save,
  Copy,
  Trash,
  Flag,
  Circle,
  XCircle,
  Plus,
  Edit,
  MessageSquare
};
@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    FullLayoutComponent,
    AiContentComponent,
    TemplateBarComponent,
    ContentBoxComponent,
    LoginComponent,
    SignUpComponent,
    TemplateComponent,
    SignUpComponent,
    SettingComponent,
    WelcomeFormComponent,
    SubscriptionComponent,
    UnsuccessfulSubscriptionsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProjectsComponent,
    MaintenanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzBreadCrumbModule,
    TemplateModule,
    SharedModule,
    ...antdModule,
    ReactiveFormsModule,
    UiFormModule,
    ClipboardModule,
    SocialLoginModule,
    LayoutModule,
    FeatherModule.pick(icons)
    // required animations module
    // ToastrModule.forRoot({
    //   positionClass: 'toast-top-center',
    //   preventDuplicates: true,
    //   closeButton: true
    // }),

  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(Google_oAuth)
          },
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: NZ_I18N,
      useValue: en_US,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    ThemeConstantService,
    AuthGuard,
    AuthenticationService,
    TokenAuthentication
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
