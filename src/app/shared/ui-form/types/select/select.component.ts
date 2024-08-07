import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends FieldType implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
