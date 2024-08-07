import { ConfigOption } from "@ngx-formly/core";
import { minlengthValidationMessage, maxlengthValidationMessage, minValidationMessage, maxValidationMessage } from "./helpers/validations-messages";
import { InputComponent } from "./types/input/input.component";
import { SelectComponent } from "./types/select/select.component";
import { TextareaComponent } from "./types/textarea/textarea.component";
import { FormFieldAdaptedComponent } from "./wrappers/form-field-adapted/form-field-adapted.component";

export const config: ConfigOption = {
  // extras: {
  //   lazyRender: true,
  //   checkExpressionOn: 'modelChange'
  // },
  types: [
    { name: 'input', component: InputComponent, wrappers: ['form-field-adapted'] },
    { name: 'textarea', component: TextareaComponent,  wrappers: ['form-field-adapted'] },
    { name: 'select', component: SelectComponent, wrappers:['form-field-adapted']}
  ],
  wrappers: [
    { name: 'form-field-adapted', component: FormFieldAdaptedComponent }
  ],
  validationMessages: [{ name: 'required', message: 'This field is required' },
  { name: 'minlength', message: minlengthValidationMessage },
  { name: 'maxlength', message: maxlengthValidationMessage },
  { name: 'min', message: minValidationMessage },
  { name: 'max', message: maxValidationMessage },
  { name: 'maximumMoneyValidation', message: 'should be 100' }],
};
