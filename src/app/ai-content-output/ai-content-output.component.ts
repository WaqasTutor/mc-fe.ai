import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContentService } from '../shared/proxy/content/content.service';
import { ProjectService } from '../shared/proxy/project/project.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ContentInterface, ContentStatus } from '../shared/proxy/content/content.interface';
import * as moment from 'moment';
export interface commonContentType {
  [key: string]: any
}
export interface ContentTypes {
  favourites: commonContentType;
  flagged: commonContentType;
  untrash: commonContentType;
}
@Component({
  selector: 'app-ai-content-output',
  templateUrl: './ai-content-output.component.html',
  styleUrls: ['./ai-content-output.component.scss']
})
export class AiContentOutputComponent implements OnInit {
  search: any;
  pageSize = 8;
  min = 0;
  max = this.pageSize;
  form: FormGroup;
  content: ContentInterface[];
  loading = false;
  showModal: boolean;
  contentTypes: ContentTypes = {
    favourites: {
      favourite: '1'
    },
    flagged: {
      flagged: '1'
    },
    untrash: {
      trashed: '0'
    }
  };
  idIcon;
  selectedProject;
  openContentId: string;
  page = 1;
  constructor(private contentSvc: ContentService, private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
    })
  }

  ngOnInit(): void {
    this.showModal = false;
    this.route.params.subscribe(ele => {
      if (ele) {
        this.idIcon = ele.id;
        this.loading = true;
        if (ele.uuid) {
          this.selectedProject = ele.uuid;
          this.loading = true;
          this.contentSvc.fullList({ "project-uuid": ele.uuid }).pipe(finalize(() => {
            this.projectService.selectProject(ele.uuid)
            this.loading = false
          })).subscribe((response) => {
            this.content = response;
            if (ele.cid) {
              this.page = this.goToContent(response, ele.cid);
              this.nzPageIndexChange(this.page);
              this.openContentId = ele.cid;
            }
          });
        }
        else {
          this.projectService.projectSelectedObservable.subscribe(res => {
            if (res) {
              this.selectedProject = res.uuid;
              if (this.selectedProject) {
                this.loading = true;
                if (this.idIcon) {
                  if (this.contentTypes[this.idIcon]) {
                    this.loading = true;
                    this.contentSvc.fullList({ "project-uuid": this.selectedProject, ...this.contentTypes[this.idIcon] }).pipe(finalize(() => {
                      this.loading = false
                    })).subscribe((response) => {
                      this.content = response.sort(function (a, b) {
                        var c = new Date(a.updated_on);
                        var d = new Date(b.updated_on);
                        return Number(d) - Number(c);
                      });
                    });
                  }
                  else {
                    if (this.router.url.includes('/projects')) {
                      this.loading = true;
                      this.contentSvc.fullList({ "project-uuid": this.selectedProject }).pipe(finalize(() => {
                        this.loading = false
                      })).subscribe((response) => {
                        this.content = response.sort(function (a, b) {
                          var c = new Date(a.updated_on);
                          var d = new Date(b.updated_on);
                          return Number(d) - Number(c);
                        });
                      });
                    } else {
                      this.router.navigate(['content']);
                    }
                  }
                }
                else {
                  this.loading = true;
                  this.contentSvc.fullList({ "project-uuid": this.selectedProject, ...this.contentTypes['untrash'] }).pipe(finalize(() => {
                    this.loading = false
                  })).subscribe((response) => {
                    this.content = response.sort(function (a, b) {
                      var c = new Date(a.updated_on);
                      var d = new Date(b.updated_on);
                      return Number(d) - Number(c);
                    });
                  });
                }
              }
            }
          })
        }
      }
    })
  }

  searchStr(e) {
    this.search = e;
  }
  goToContent(contents: ContentInterface[], id) {
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].uuid === id) {
        return (Math.ceil(contents.length / i ? i : 0));
      }
    }
    return 1;
  }

  openModal(e) {
    this.showModal = e;
  }
  nzPageIndexChange(e) {
    this.min = (e * this.pageSize) - this.pageSize;
    this.max = e * this.pageSize;
  }

  sendIcon(idIcon) {
    return idIcon;
  }

  removeElement(singleContent: ContentInterface) {
    if (this.idIcon) {
      this.content = this.content.filter(ele => {
        if (this.idIcon == 'favourites' && ele.is_favourite == ContentStatus.notSelected) {
          return false;
        }
        else if (this.idIcon == 'flagged' && ele.flagged == ContentStatus.notSelected) {
          return false;
        }
        else if (this.idIcon == 'trash' && ele.trashed == ContentStatus.notSelected) {
          return false;
        }
        else {
          return true;
        }
      })
    } else {
      this.content = this.content.filter(ele => {
        if (ele.trashed === ContentStatus.selected) {
          return false;
        }
        else {
          return true;
        }
      })
    }
  }
  submitForm() {
    // if (!this.form.valid)
    //   for (const i in this.form.controls) {
    //     this.form.controls[i].markAsDirty();
    //     this.form.controls[i].updateValueAndValidity();
    //   }
    // else {
    //   this.createFormLoading = true;
    //   this.userService.getUser().subscribe(res => {
    //     this.projectService.create({ ...this.form.value, workspace_uuid: res.workspaces[0].uuid }).pipe(finalize(() => this.createFormLoading = false)).subscribe(ele => {
    //       this.form.reset();
    //       this.projectService.hideModal()
    //     })
    //   })

    // }
  }

  closeModal() {
    this.projectService.hideModal();
    this.form.reset();
  }
  timeAgo(date) {
    return moment.utc(date).local().fromNow()
  }
}
