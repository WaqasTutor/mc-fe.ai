import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ClipboardService } from 'ngx-clipboard';
import { ContentInterface, ContentStatus } from 'src/app/shared/proxy/content/content.interface';
import { ContentService } from 'src/app/shared/proxy/content/content.service';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-content-box-modal',
  templateUrl: './content-box-modal.component.html',
  styleUrls: ['./content-box-modal.component.scss']
})
export class ContentBoxModalComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() content: ContentInterface;
  copied: boolean = false;
  item: ContentInterface;
  status = ContentStatus;
  favorite = false;
  trashed = false;
  flag = false;
  conSave: boolean = false;
  saved: boolean = false;
  modalText: string;
  constructor(private modal: NzModalRef, private contentSvc: ContentService, private clipboardApi: ClipboardService,
    private message: NzMessageService) {

  }

  ngOnInit(): void {
    this.modalText = this.content.text;
  }

  ngOnDestroy() {
    if (this.content.text.trim() !== this.modalText.trim()) {
      let currentTime = new Date(Date.now());
      this.content.updated_on = currentTime;
      this.content.text = this.modalText.trim();
      this.updateContent({ text: this.modalText.trim(), updated_on: currentTime });
    }
  }

  editContent() {
    this.conSave = true;
    let currentTime = new Date()
    this.updateContent({ text: this.modalText.trim() });
    this.content.updated_on = currentTime;
    setTimeout(() => {
      this.conSave = false
    }, 1500);
    this.saved = true;
  }

  updateContent(content) {
    this.contentSvc.update({
      ...content
    }, this.content.uuid).subscribe((resp) => {
      this.modal.afterClose.next({ ...this.content, text: content.text, updated_on: content.updated_on });
    })
  }

  favoriteItem() {
    this.favorite = true;
    this.contentSvc.update({
      favourite: this.changeStatus(this.content.is_favourite)
    }, this.content.uuid)
      .pipe(finalize(() => this.favorite = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.is_favourite = this.changeStatus(this.content.is_favourite);
        if (this.title === 'favourites') {
          this.modal.close();
          this.closeModal();
        }

      });
  }
  changeStatus(option) {
    return option === ContentStatus.selected ? ContentStatus.notSelected : ContentStatus.selected;
  }
  contentStatus(option) {
    return option === ContentStatus.selected;
  }


  copy() {
    this.clipboardApi.copyFromContent(this.content.text);
    this.copied = true;
  }

  deleteItem() {
    this.trashed = true;
    this.contentSvc.update({
      trashed: this.changeStatus(this.content.trashed)
    }, this.content.uuid)
      .pipe(finalize(() => this.trashed = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.trashed = this.changeStatus(this.content.trashed);
        if (this.title === 'trash') {
          this.modal.close();
          this.closeModal();
        }
      });
  }
  addToFlag() {
    this.flag = true;
    this.contentSvc.update({
      flagged: this.changeStatus(this.content.flagged),
    }, this.content.uuid)
      .pipe(finalize(() => this.flag = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.flagged = this.changeStatus(this.content.flagged);
        if (this.title === 'flagged') {
          this.modal.close();
          this.closeModal();
        }
      })
  }

  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
  closeModal() {
    setTimeout(() => {
      this.modal.afterClose.next(this.content);
    }, 500)
  }
}

