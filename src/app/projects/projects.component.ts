import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToolInterface } from '../shared/proxy/tools/tool.interface';
import { userService } from '../shared/proxy/user/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FeedbackService } from '../shared/proxy/feedback/feeback.service';
import { ProjectService } from '../shared/proxy/project/project.service';
import { ProjectInterface } from '../shared/proxy/project/project.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  colors: string[] = [
    'mc-bg-dgr',
    'mc-bg-pnk',
    'mc-bg-org',
    'mc-bg-skn',
    'mc-bg-lgr',
    'mc-bg-wht'
  ];
  view: string = 'cardView';
  toolList: ToolInterface[];
  projects: ProjectInterface[];
  searchInput: string;
  checkedTag = '';
  tags = [];
  pageSize = 8;
  min = 0;
  max = this.pageSize;
  constructor(private modalService: NzModalService, private projectService: ProjectService, private modal: NzModalService,
    private feedback: FeedbackService, private userService: userService, private message: NzMessageService, private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.projectService.projectsObservable.subscribe(ele => this.projects = ele)
    // this.projectService.list().subscribe(ele => { });
  }


  search() {}
  selectProject(project: ProjectInterface) {  }
  openEdit(project: ProjectInterface) {
    this.projectService.showEditModal(project)
  }
  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
  nzPageIndexChange(e) {
    this.min = (e * this.pageSize) - this.pageSize;
    this.max = e * this.pageSize;
  }
  delete(project: ProjectInterface) {
    if (project.default == '0') {
      this.modal.confirm({
        nzTitle: ' Are you sure you want to delete this project ?',
        nzContent: '<p class="color-darkest" style="color: red;"> Deleting the project will result in all the contents and documents of the project to be deleted. This action cannot be reversed.</p>',
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.projectService.delete(project.uuid).subscribe(ele => console.log(ele)),
        nzCancelText: 'No',
        nzOnCancel: () => console.log('Cancel')
      });
    }
    else {
      this.message.error(`can't delete default project`);
    }
  }
  openModal () {
    this.projectService.showModal();
  }
}
