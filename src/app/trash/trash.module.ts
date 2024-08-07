import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashRoutingModule } from './trash-routing.module';
import { TrashComponent } from './trash.component';
import { RouterModule } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AiContentOutputModule } from '../ai-content-output/ai-content-output.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { DocumentEditorModule } from '../document-editor/document-editor.module';
import { FileText } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

const icons = {
  FileText
};
@NgModule({
  declarations: [TrashComponent],
  imports: [
    CommonModule,
    RouterModule,
    TrashRoutingModule,
    NzTabsModule,
    NzAvatarModule,
    NzIconModule,
    NzPaginationModule,
    NzCardModule,
    NzEmptyModule,
    NzDropDownModule,
    NzTableModule,
    AiContentOutputModule,
    DocumentEditorModule,
    FeatherModule.pick(icons)
  ]
})
export class TrashModule { }
