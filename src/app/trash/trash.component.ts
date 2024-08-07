import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { ContentInterface } from '../shared/proxy/content/content.interface';
import { ContentService } from '../shared/proxy/content/content.service';
import { DocumentEditorService } from '../shared/proxy/document-editor/document-editor.service';
import { ProjectInterface } from '../shared/proxy/project/project.interface';
import { ProjectService } from '../shared/proxy/project/project.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
  searchVisible: boolean;
  selectedProject: ProjectInterface;
  selectedTabIndex: number;
  documentList: any = [];
  contPage = 1;
  contPageSize = 8;
  contMin = 0;
  contMax = this.contPageSize;
  docPage = 1;
  docPageSize = 8;
  docMin = 0;
  docMax = this.docPageSize;
  contents: ContentInterface[];
  contLoading = false;
  constructor(private router: Router, private route: ActivatedRoute, private documentService: DocumentEditorService, private contentSvc: ContentService) {}

  ngOnInit(): void {
    this.contLoading = true;
    this.contentSvc.trash().pipe(finalize(() => {
      this.contLoading = false;
    })).subscribe((response) => {
      this.contents = response;
    });
    this.documentService.trash().pipe(finalize(() => {
    })).subscribe((resp) => {
      this.documentList = resp;
    });
    this.route.params.subscribe(({type}) => {
      if (type == 'contents') {
        this.selectedTabIndex = 0;
      } else if (type == 'documents') {
        this.selectedTabIndex = 1;
      } else {
        this.router.navigateByUrl('/dashboard')
      }
    })
  }

  onTabClick(title: any): void {
    if (title === 'contents') {
      this.router.navigateByUrl('/trash/contents')
    } else if (title === 'documents' ) {
      this.router.navigateByUrl('/trash/documents')
    }
  }
  columns = [
    {
      title: 'Document name',
      sortOrder: null,
      sortFn: (a:any, b:any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      priority: 1,
      centered: false,
    }, 
    {
      title: 'Created on',
      sortOrder: null,
      sortFn: (a:any, b:any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      priority: 3,
      centered: true
    }, 
    {
      title: 'Updated on',
      sortOrder: null,
      sortFn: (a:any, b:any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      priority: 2,
      centered: true
    },
    {
      title: 'User',
      sortOrder: null,
      sortFn: (a:any, b:any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      centered: true
    }, 
    {
      title: '',
      centered: true
    }
  ]

  toDate(date: Date) {
    return moment.utc(date).local().format('DD MMM, YY');
  }

  removeElement(singleContent: ContentInterface) {
      this.contents = this.contents.filter(ele => ele.trashed === '1')
  }

  nzContPageIndexChange(e) {
    this.contMin = (e * this.contPageSize) - this.contPageSize;
    this.contMax = e * this.contPageSize;
  }

  nzDocPageIndexChange(e) {
    this.docMin = (e * this.docPageSize) - this.docPageSize;
    this.docMax = e * this.docPageSize;
  }
}
