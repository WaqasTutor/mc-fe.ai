import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClipboardService } from 'ngx-clipboard';
import { finalize } from 'rxjs/operators';
import { ContentInterface, ContentStatus } from 'src/app/shared/proxy/content/content.interface';
import { ContentService } from 'src/app/shared/proxy/content/content.service';
import { ProjectService } from 'src/app/shared/proxy/project/project.service';

@Component({
  selector: 'app-content-box-search',
  templateUrl: './content-box-search.component.html',
  styleUrls: ['./content-box-search.component.scss']
})
export class ContentBoxSearchComponent implements OnInit {
  coping = false;
  star = false;
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
  constructor(private clipboardApi: ClipboardService, private message: NzMessageService, private projectService: ProjectService, private contentService: ContentService) { }

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
}
