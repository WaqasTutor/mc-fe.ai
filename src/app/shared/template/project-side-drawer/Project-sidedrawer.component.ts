import { EventEmitter } from '@angular/core';
import { OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { ProjectInterface } from '../../proxy/project/project.interface';
import { ProjectService } from '../../proxy/project/project.service';

@Component({
  selector: 'app-project-side-drawer',
  templateUrl: './Project-sidedrawer.component.html',
  styleUrls: ['./Project-sidedrawer.component.scss']
})

export class ProjectSideDrawerComponent implements OnInit {
  search: any;
  modalShow = false;
  projects: ProjectInterface[];
  colors: string[] = [
    'mc-bg-dgr',
    'mc-bg-pnk',
    'mc-bg-org',
    'mc-bg-skn',
    'mc-bg-lgr',
    'mc-bg-wht'
  ];  
  @Output() projectSelected: EventEmitter<any> = new EventEmitter();
  constructor(private projectService: ProjectService) {
    Array.prototype['random'] = function (length) {
      return this[Math.floor((Math.random() * length))];
    }
  }
  ngOnInit(): void {
    this.projectService.projectsObservable.subscribe(ele => this.projects = ele)
    this.projectService.list().subscribe(ele => { });
  }
  selectProject(project: ProjectInterface) {
    this.projectService.selectProject(project.uuid);
    this.projectSelected.emit(project);
  }
  visibleModal() {
    this.modalShow = !this.modalShow;
  }
  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
}