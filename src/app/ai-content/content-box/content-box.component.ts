import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ContentInterface, ContentStatus } from './../../shared/proxy/content/content.interface';
import { ContentService } from './../../shared/proxy/content/content.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss']
})
export class ContentBoxComponent implements OnInit {
  @ViewChild('pre') el: ElementRef;
  @Output() deleted: EventEmitter<boolean> = new EventEmitter()
  coping = false;
  save = false;
  flag = false;
  delete = false;
  favorite = false;
  size = {
    height: 0,
    width: 0
  }
  @Input() content: ContentInterface;
  status = ContentStatus;
  textareaToggle = false;
  constructor(private clipboardApi: ClipboardService, private contentService: ContentService, private message: NzMessageService) { }

  ngOnInit(): void {
  }
  copyContent(content) {
    this.coping = true;
    this.clipboardApi.copyFromContent(content);
    setTimeout(() => {
      this.coping = false;
      this.message.success('Copied successfully');
    }, 1000);
  }
  addToFlag() {
    this.flag = true;
    this.contentService.update({
      flagged: this.changeStatus(this.content.flagged),
    }, this.content.uuid)
      .pipe(finalize(() => this.flag = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.flagged = this.changeStatus(this.content.flagged);
      })
  }
  deleteItem() {
    this.delete = true;
    this.contentService.update({
      trashed: this.changeStatus(this.content.trashed)
    }, this.content.uuid)
      .pipe(finalize(() => this.delete = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.trashed = this.changeStatus(this.content.trashed);
        setTimeout(() => this.deleted.emit(true), 500)
    });
    
  }
  favoriteItem() {
    this.favorite = true;
    this.contentService.update({
      favourite: this.changeStatus(this.content.is_favourite)
    }, this.content.uuid)
      .pipe(finalize(() => this.favorite = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.is_favourite = this.changeStatus(this.content.is_favourite);
      });
  }
  saveItem() {
    this.save = true;
    this.contentService.update({
      saved: this.changeStatus(this.content.saved),
    }, this.content.uuid)
      .pipe(finalize(() => this.flag = false)).subscribe(ele => {
        this.message.success(ele.message);
        this.content.saved = this.changeStatus(this.content.saved);
      })
  }
  updateText(text) {
    if (text != this.content.text) {
      this.content.text = text;
      this.contentService.update({
        text: this.content.text
      }, this.content.uuid).subscribe(ele => {
        this.message.success(ele.message);
      });
    }
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
  getHeightWidth() {

    this.size.height = this.el.nativeElement.offsetHeight;
    this.size.width = this.el.nativeElement.offsetWidth;
    setTimeout(() => {
      (<HTMLInputElement>document.getElementsByClassName("input")[0]).focus()
    }, 200)

    // console.log(this.el.nativeElement.offsetHeight, this.el.nativeElement.offsetWidth)
  }
}

