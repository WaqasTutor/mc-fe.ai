import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DocumentEditorComponent } from './document-editor.component';
import { DocSidebarComponent } from './doc-sidebar/doc-sidebar.component';
import { DocumentTableComponent } from './document-table/document-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { UiFormModule } from '../shared/ui-form/ui-form.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DocumentListComponent } from './document-list/document-list.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { RouterModule } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FeatherModule } from 'angular-feather';
import { File, Film } from 'angular-feather/icons';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

const antdModule = [
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzGridModule,
  NzIconModule,
  NzSliderModule,
  NzFormModule,
  NzDrawerModule,
  NzSelectModule,
  NzDropDownModule,
  NzModalModule,
  NzAvatarModule,
  NzPaginationModule,
  NzToolTipModule,
  NzPopoverModule,
  NzSpinModule,
  NzTableModule,
  NzEmptyModule,
  NzTagModule
]

@NgModule({
  declarations: [DocumentEditorComponent, DocSidebarComponent, DocumentListComponent, DocumentTableComponent, VideoModalComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule,
    CKEditorModule,
    UiFormModule,
    FeatherModule.pick({
      File, Film
    }),
    ...antdModule
  ],
  exports: [DocumentTableComponent]
})
export class DocumentEditorModule { }
