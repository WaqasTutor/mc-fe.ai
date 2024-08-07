import { UserInterface } from './../shared/proxy/user/user.interface';
import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { ProjectInterface } from '../shared/proxy/project/project.interface';
import { ProjectService } from '../shared/proxy/project/project.service';
import { userService } from './../shared/proxy/user/user.service';
import { Details } from '../shared/interfaces/user.type';
import { ToolInterface } from '../shared/proxy/tools/tool.interface';
import notifications from "./jsons/notifications.json"
import resources from "./jsons/resources.json"
import { NzModalService } from 'ng-zorro-antd/modal';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { ClipboardService } from 'ngx-clipboard';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';
  Usage: Details;
  projects: ProjectInterface[];
  mcUser: UserInterface;
  tools: ToolInterface[];
  resources;
  refGenerating: boolean = false;
  refCopied: boolean = false;
  selectedIndex: number = 0;
  hideNotification = false;
  notificationMessages: any[];
  colors: string[] = [
    'mc-bg-dgr',
    'mc-bg-pnk',
    'mc-bg-org',
    'mc-bg-skn',
    'mc-bg-lgr',
    'mc-bg-wht',
  ];

  constructor(
    private userService: userService,
    private projectService: ProjectService,
    private modal: NzModalService,
    private clipboard: ClipboardService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.notificationMessages = notifications;
    this.resources = resources;
    this.projectService.projectsObservable.subscribe((ele) => {
      this.projects = ele
    });
    this.userService.currentUser.subscribe((user) => this.mcUser = user)
    this.userService.UsageObservable.subscribe((details) => {
        this.Usage = details;
    });
    this.userService.getUsage().subscribe(ele => { })
  }

  createVideoModal(): void {
    const modal = this.modal.create({
      nzClosable: false,
      nzCentered: true,
      nzWidth: "70vw",
      nzFooter: null,
      nzWrapClassName: 'content-modal',
      nzBodyStyle: {'padding': '0'},
      nzContent: VideoModalComponent,
      nzAutofocus: null,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
      },
    });
    modal.afterClose.subscribe((result) => {
    });

  }

  toDate(date: string) {
    return moment.utc(date).local().format("DD MMMM YYYY");
  }
  toTime(date: string) {
    return moment.utc(date).local().format('hh:mm A');
  }

  timeAgo(date) {
    return moment.utc(date).local().fromNow();
  }
  fileList = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  openModal() {
    this.projectService.showModal();
  }

  copyReferral() {
    this.refGenerating = true;
    this.userService.getReferral().pipe(finalize(() => this.refGenerating = false)).subscribe(({referral_link}) => {
      this.clipboard.copy(referral_link);
      this.refCopied = true;
    })
  }
}
