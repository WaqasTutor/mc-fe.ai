  import { Component, ViewChildren } from '@angular/core';
  import { ROUTES } from './side-nav-routes.config';
  import { ThemeConstantService } from '../../services/theme-constant.service';
  import { ProjectService } from './../../proxy/project/project.service';
  import { ProjectInterface, Workspace } from './../../proxy/project/project.interface';
  import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
  import { tap, finalize } from 'rxjs/operators';
  import { userService } from './../../proxy/user/user.service';
  import * as moment from 'moment';
  import { Router } from '@angular/router';

  import { DomSanitizer } from '@angular/platform-browser';
import { SideNavInterface } from '../../interfaces/side-nav.type';

  @Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.scss']
  })

  export class SideNavComponent {
    public menuItems: any[]
    isFolded: boolean;
    isSideNavDark: boolean;
    isExpand: boolean;
    searchVisible: boolean = false;
    modalSHow = false;
    form: FormGroup;
    createFormLoading = false;
    selectedProject: ProjectInterface;
    edit = false;
    editingProjectId;
    SubActive: boolean;
    docEditor: boolean = false;
    typeFormOpen = false;
    url = "https://1lz8ahoedmv.typeform.com/to/IAb1KSXH";
    iframeLoading = false;
    constructor(public sanitizer: DomSanitizer, private themeService: ThemeConstantService, private projectService: ProjectService,
      private fb: FormBuilder, private userService: userService, private route: Router) {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(25)]],
        description: ['', [Validators.maxLength(100)]]
      });
    }

    ngOnInit(): void {
      this.menuItems = ROUTES.filter(menuItem => menuItem);
      this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
      this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
      this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
      this.projectService.projectSelectedObservable.subscribe(ele => this.selectedProject = ele);
      this.projectService.showModalSubject.subscribe((showModal) => this.modalSHow = showModal);
      this.projectService.showEditModalSubject.subscribe((project) => {
        if (project) {
          this.edit = true;
          this.modalSHow = true;
          this.editingProjectId = project.uuid;
          this.form.get('name').patchValue(project.name);
          this.form.get('description').patchValue(project.description? project.description : '')
        }
      })
      this.projectService.showDrawerObservable.subscribe(state => this.searchVisible = state);
      this.route.events.subscribe(() => {
        this.docEditor = this.route.url.includes('documents') && this.route.url.includes('edit')
      })
      if (this.route.url.includes('flagged') || this.route.url.includes('favourites')) { this.SubActive = true }
    }

    openMenu(item: SideNavInterface) {
      if (item.submenu?.length !== 0) {
        item.opened = !item.opened;
      } else {
        this.menuItems.map((mI: SideNavInterface) => {
          if (mI.title !== item.title) {
            mI.opened = false
          }
        })
      }
    }

    closeMobileMenu(): void {
      if (window.innerWidth < 992) {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
      }
    }
    searchToggle(): void {
      if (!this.searchVisible) {
        this.projectService.showDrawer();
      } else {
        this.projectService.hideDrawer();
      }
    }

    addProject() {
      this.projectService.create(this.form.value);
    }
    submitForm() {
      if (!this.form.valid)
        for (const i in this.form.controls) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      else {
        this.createFormLoading = true;
        this.userService.getUser().subscribe(res => {
          this.projectService.create({ ...this.form.value, workspace_uuid: res.workspaces[0].uuid }).pipe(finalize(() => this.createFormLoading = false)).subscribe(ele => {
            this.form.reset();
            this.projectService.hideModal()
          })
        })

      }
    }

    editProject(uuid) {
      if (!this.form.valid)
        for (const i in this.form.controls) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      else {
        this.createFormLoading = true;
        this.projectService.update({
          name: this.form.value.name,
          description: this.form.value.description,
          uuid: this.editingProjectId
        }).pipe(finalize(() => this.createFormLoading = false)).subscribe(ele => {
          this.form.reset()
          this.modalSHow = false;
        })
      }
    }
    resetEdit() {
      this.editingProjectId = null;
      this.edit = false;
    }

    openModal() {
      this.projectService.showModal()
    }
    closeModal() {
      this.projectService.hideModal();
      this.form.reset();
    }
    timeAgo(date) {
      return moment(date).fromNow()
    }
    navigate() {
      this.route.navigate(['tools']);
    }
    openChat() {
      (document.getElementsByClassName('cc-unoo')[0] as HTMLElement).click();
      var myVar = setInterval(() => {

        if ((document.getElementsByClassName('cc-1asz')[0] as HTMLElement)) {
          (document.getElementsByClassName('cc-1asz')[0] as HTMLElement).onclick = () => {
            (document.getElementsByClassName('cc-unoo')[0] as HTMLElement).setAttribute('style', "display:none !important");
          }
          clearInterval(myVar)
        }
      }, 1000);

    }

    sensitizeUrl(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    goToAffiliateProgram() {
      window.open('https://marketingcopy.tapfiliate.com');
    }
  }

