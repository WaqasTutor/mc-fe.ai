import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AiContentOutputRoutingModule } from './ai-content-output-routing.module';
import { AiContentOutputComponent } from './ai-content-output.component';
import { SharedModule } from '../shared/shared.module';
import { AiContentOutputHeaderComponent } from './components/ai-content-output-header/ai-content-output-header.component';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ContentBoxComponent } from './components/content-box/content-box.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ContentBoxModalComponent } from './components/content-box-modal/content-box-modal.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { EllipsisModule } from 'ngx-ellipsis';
import { FeatherModule } from 'angular-feather';
import { Search, Copy, Trash2, Flag, Star, Save, Clock, Plus } from 'angular-feather/icons'

/** Assign all ng-zorro modules to this array*/
const antdModule = [
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzGridModule,
  NzAvatarModule,
  NzPaginationModule,
  NzModalModule,
  NzToolTipModule,
  NzDrawerModule,
  NzDropDownModule
]

@NgModule({
  declarations: [AiContentOutputComponent, AiContentOutputHeaderComponent, ContentBoxComponent, ContentBoxModalComponent],
  imports: [
    SharedModule,
    AiContentOutputRoutingModule,
    ReactiveFormsModule,
    EllipsisModule,
    FeatherModule.pick({
      Search,
      Copy,
      Trash2,
      Flag,
      Star,
      Save,
      Clock,
      Plus
    }),
    ...antdModule
  ],
  exports: [ContentBoxComponent, ContentBoxModalComponent]
})
export class AiContentOutputModule { }
