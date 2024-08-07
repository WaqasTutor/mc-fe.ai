import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { DocumentInterface } from 'src/app/shared/proxy/document-editor/document-editor.interface';
import { DocumentEditorService } from 'src/app/shared/proxy/document-editor/document-editor.service';
import { ProjectInterface } from 'src/app/shared/proxy/project/project.interface';
import { ProjectService } from 'src/app/shared/proxy/project/project.service';
import { userService } from 'src/app/shared/proxy/user/user.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  documentList:any = [];
  search: any;
  searchVisible: boolean;
  selectedProject: ProjectInterface;
  pageSize = 8;
  min = 0;
  max = this.pageSize;
  page = 1;
  adding: boolean;
  userName;

  constructor(
    private documentService: DocumentEditorService,
    private projectService: ProjectService,
    private router: Router,
    private modal: NzModalService,
    private userService: userService
  ) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(({first_name, last_name}) => {
      this.userName = `${first_name} ${last_name}`
    })
    this.projectService.projectSelectedObservable.subscribe(
      (project) => {
        this.selectedProject = project
        project && this.documentService.getDocuments(project.uuid).subscribe((resp) => {
          this.documentList = resp;
        });
      }
    );
    this.projectService.showDrawerObservable.subscribe(
      (state) => (this.searchVisible = state)
    );
  }

  searchChanged(e) {}
  nzPageIndexChange(e) {
    this.min = (e * this.pageSize) - this.pageSize;
    this.max = e * this.pageSize;
  }

  searchToggle(): void {
    if (!this.searchVisible) {
      this.projectService.showDrawer();
    } else {
      this.projectService.hideDrawer();
    }
  }

  addDocument() {
    let data = {
      project_uuid: this.selectedProject.uuid,
    };
    this.adding = true;
    this.documentService.createDocument(data).pipe(finalize(() => this.adding = false)).subscribe((resp) => {
      if (resp.uuid != null) {
        this.router.navigate([`/documents/${resp.uuid}/edit`]);
      }
    });
  }
}
