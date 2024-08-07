import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { ProjectInterface } from '../../proxy/project/project.interface';
import { ProjectService } from './../../proxy/project/project.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  search: any;
  modalSHow = false;
  projects: ProjectInterface[];
  colors: string[] = ['ant-avatar-cyan', 'ant-avatar-blue', 'ant-avatar-purple', 'ant-avatar-green', 'ant-avatar-red',];
  constructor(private projectService: ProjectService) {
    Array.prototype['random'] = function (length) {
      return this[Math.floor((Math.random() * length))];
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.projectService.projectsObservable.subscribe(ele => this.projects = ele)
    this.projectService.list().subscribe(ele => { });
  }
  selectProject(project: ProjectInterface) {
    this.projectService.selectProject(project.uuid);
  }
  visibleModal() {
    this.modalSHow = !this.modalSHow;
  }
  random() {
    return this.colors[Math.floor((Math.random() * this.colors.length))];
  }
  getColor(i) {

  }
  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
}


