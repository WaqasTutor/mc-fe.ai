import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { InputComponent } from './types/input/input.component';
import { config } from './config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldAdaptedComponent } from './wrappers/form-field-adapted/form-field-adapted.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { TextareaComponent } from './types/textarea/textarea.component';
import { SelectComponent } from './types/select/select.component';



@NgModule({
  declarations: [InputComponent, FormFieldAdaptedComponent, TextareaComponent, SelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzToolTipModule,
    NzSwitchModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    FormlyModule.forRoot(config),
    FormlyNgZorroAntdModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyNgZorroAntdModule,
  ],
})
export class UiFormModule { }
