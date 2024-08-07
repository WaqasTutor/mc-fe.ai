import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToolInterface } from '../shared/proxy/tools/tool.interface';
import { ToolService } from '../shared/proxy/tools/tool.service';
import { userService } from '../shared/proxy/user/user.service';
import { AppsService } from '../shared/services/apps.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FeedbackService } from '../shared/proxy/feedback/feeback.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  view: string = 'cardView';
  toolList: ToolInterface[];
  searchInput: string;
  checkedTag = 'All';
  form: FormGroup;
  createFormLoading = false;
  modalSHow = false;
  tags = [];

  constructor(private toolService: ToolService, private fb: FormBuilder, private message: NzMessageService, private userService: userService) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      request: [null, [Validators.required]]
    })
    this.toolService.ToolsObservable.subscribe(tools => {
      this.toolList = tools;
      tools?.forEach(tool => {
        for (let category of tool.categories) {
          if (!this.tags.includes(category.name)) {
            this.tags.push(category.name);
          }
        }
      })
    })
    this.toolService.list().subscribe(ele => {})
  }

  submitForm() {
    this.createFormLoading = true;
    this.toolService.requestTool({
      request: this.form.value.request
    }).pipe(finalize(() => this.createFormLoading = false)).subscribe(({message}) => {
      this.message.info(message);
      this.modalSHow = !this.modalSHow;
    })
  }

  filterList(tag: string) {
    if (!tag || tag?.length == 0) {
      return this.toolList;
    }
    else {
      return tag == "All" ? this.toolList : tag == "Favourites" ? this.toolList.filter((tool) => tool.favourite) : this.toolList.filter(ele => this.checkCategories(ele, tag));
    }
  }
  checkCategories(ele: ToolInterface, tag: string) {
    for (let category of ele.categories) {
      if (tag == category.name) {
        return true;
      }
    }
    return false;
  }

  changeStatus (tool: ToolInterface, currentStatus: boolean) {
    let status = currentStatus ? "0" : "1";
    let statusData = {
      favourite: status
    }
    this.toolService.update(statusData, tool.uuid).subscribe(({message}) => {
      this.message.success(message);
      tool.favourite = !currentStatus;
      this.toolService.updateObservable(this.toolList)
    })
  }

}
