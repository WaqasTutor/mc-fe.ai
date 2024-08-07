import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, ViewContainerRef, EventEmitter, HostListener } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContentBoxModalComponent } from '../content-box-modal/content-box-modal.component';
import * as moment from 'moment';
import { ContentService } from 'src/app/shared/proxy/content/content.service';
import { ContentInterface, ContentStatus } from 'src/app/shared/proxy/content/content.interface';
import { ClipboardService } from 'ngx-clipboard';
import { finalize } from 'rxjs/operators';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';

@Component({
  selector: 'app-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss']
})
export class ContentBoxComponent implements OnInit {
  isEdit: boolean = false;
  productEditForm: FormGroup;
  previewImage: string = '';
  previewVisible: boolean = false;
  isVisibleMiddle = false;
  item: ContentInterface;
  favorite = false;
  trashed = false;
  copied = false;
  flag = false;
  status = ContentStatus;


  @Input() contentData: ContentInterface;
  @Input() iconOption: string;
  @Input() open: string;

  @Output() remove: EventEmitter<ContentInterface> = new EventEmitter<ContentInterface>();

  constructor(private fb: FormBuilder, private message: NzMessageService, private modal: NzModalService, private viewContainerRef: ViewContainerRef,
    private contentSvc: ContentService, private clipboardApi: ClipboardService) {
  }

  ngOnInit(): void {
    if (this.open == this.contentData.uuid) {
      this.createComponentModal();
    }
  }

  createComponentModal(): void {
    const modal = this.modal.create({
      nzClosable: false,
      nzCentered: true,
      nzWidth: "55%",
      nzFooter: [],
      nzWrapClassName: 'content-modal',
      nzContent: ContentBoxModalComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        title: this.iconOption,
        content: this.contentData,
      },
    });
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.contentData = result;
      }
      if (this.iconOption) {
        this.remove.emit(this.contentData);
      }
    });

  }

  updateContent(contentData) {
    this.contentSvc.update({
      ...contentData
    }, this.contentData.uuid).subscribe((resp) => {
      // this.contentSvc.list({projectId:this.contentData.}).subscribe((response) => {
      //   this.contentData = response.find(x => x.uuid === contentData.uuid);
      // });
    })
  }

  favoriteItem() {
    this.favorite = true;
    this.contentSvc.update({
      favourite: this.changeStatus(this.contentData.is_favourite)
    }, this.contentData.uuid)
      .pipe(finalize(() => this.favorite = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.contentData.is_favourite = this.changeStatus(this.contentData.is_favourite);
        if (this.iconOption) {
          this.remove.emit(this.contentData);
        }
      });
  }

  copy() {
    this.clipboardApi.copyFromContent(this.contentData.text);
    this.copied = true
  }

  deleteItem() {
    this.trashed = true;
    this.contentSvc.update({
      trashed: this.changeStatus(this.contentData.trashed)
    }, this.contentData.uuid)
      .pipe(finalize(() => this.trashed = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.contentData.trashed = this.changeStatus(this.contentData.trashed);
        if (!this.iconOption) {
          setTimeout(() => {
          this.remove.emit(this.contentData);
            }, 1000)
        } else if (this.iconOption === 'trash') {
          this.remove.emit(this.contentData);
        }
      });
  }
  addToFlag() {
    this.flag = true;
    this.contentSvc.update({
      flagged: this.changeStatus(this.contentData.flagged),
    }, this.contentData.uuid)
      .pipe(finalize(() => this.flag = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.contentData.flagged = this.changeStatus(this.contentData.flagged);
        this.remove.emit(this.contentData);
      })
  }

  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
  changeStatus(option) {
    return option === ContentStatus.selected ? ContentStatus.notSelected : ContentStatus.selected;
  }
  contentStatus(option) {
    return option === ContentStatus.selected;
  }

}
