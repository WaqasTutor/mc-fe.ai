import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-form-field-adapted',
  templateUrl: './form-field-adapted.component.html',
  styleUrls: ['./form-field-adapted.component.scss']
})
export class FormFieldAdaptedComponent extends FieldWrapper implements OnInit {
  label;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.label = this.to.label.replace(' Or ', '/')
  }
}
