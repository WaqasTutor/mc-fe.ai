import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DocumentInterface } from 'src/app/shared/proxy/document-editor/document-editor.interface';
import { DocumentEditorService } from 'src/app/shared/proxy/document-editor/document-editor.service';
import { userService } from 'src/app/shared/proxy/user/user.service';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements OnInit {
  constructor(private router: Router, private modal: NzModalService,
    private documentService: DocumentEditorService, private userService: userService) { }
  @Input() documentList: any;
  @Input() search?: string;
  @Input() min: number;
  @Input() max: number;
  userName: string;
  ngOnInit(): void {
    this.userService.currentUser.subscribe(({first_name, last_name}) => {
      this.userName = `${first_name} ${last_name}`
    })
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

  onDocumentClick(document: any): void {
    this.router.navigate([`/documents/${document.uuid}/edit`]);
  }

  onEdit(doc: DocumentInterface) {
    this.router.navigate([`/documents/${doc.uuid}/edit`]);
  }
  onDelete(doc: DocumentInterface) {
    this.modal.confirm({
      nzTitle: ' Are you sure you want to delete this document ?',
      nzContent: '<p class="color-darkest"> Deleting the document will result in all the contents of the document to be deleted as well. This action cannot be reversed.</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.documentService.updateDocument({uuid: doc.uuid, trashed: '1'})
          .subscribe(() => {
            this.documentList = this.documentList.filter(({uuid}) => uuid !== doc.uuid)
        })
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  permanetDelete(doc: DocumentInterface) {
    this.modal.confirm({
      nzTitle: ' Are you sure you want to delete this document ?',
      nzContent: '<p class="color-darkest"> Deleting the document will result in all the contents of the document to be deleted as well. This action cannot be reversed.</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.documentService.permanentDeleteDocument({uuid: doc.uuid, trashed: '1'})
          .subscribe(() => {
            this.documentList = this.documentList.filter(({uuid}) => uuid !== doc.uuid)
        })
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  removeFromTrash(doc: DocumentInterface) {
    this.documentService.updateDocument({uuid: doc.uuid, trashed: '0'})
          .subscribe(() => {
            this.documentList = this.documentList.filter(({uuid}) => uuid !== doc.uuid)
        })
  }
}
