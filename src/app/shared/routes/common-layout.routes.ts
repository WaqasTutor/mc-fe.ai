import { Routes } from '@angular/router';
import { DocumentEditorComponent } from 'src/app/document-editor/document-editor.component';
import { DocumentListComponent } from 'src/app/document-editor/document-list/document-list.component';
import { ProjectsComponent } from 'src/app/projects/projects.component';
import { SettingComponent } from 'src/app/setting/setting.component';
import { TemplateComponent } from 'src/app/template/template.component';
import { AuthGuard } from '../guard/auth.guard';
import { UserRoleGuard } from '../guard/user-role.guard';
import { userStatus } from '../proxy/user/user.interface';
import { AiContentComponent } from 'src/app/ai-content/ai-content.component';
import { TrashComponent } from 'src/app/trash/trash.component';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Dashboard',
      userStatus: userStatus.COMPLETE
    }
  },
  {
    path: 'tools',
    component: TemplateComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Tools',
      userStatus: userStatus.COMPLETE
    }
  },
  {
    path: 'tools/view/:id',
    component: AiContentComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Marketing copy generator',
      userStatus: userStatus.COMPLETE
    }
  },
  {
    path: 'settings/:tab',
    component: SettingComponent,
    canActivate: [AuthGuard, UserRoleGuard],
    data: {
      title: 'Settings',
      headerDisplay: "none",
      userStatus: userStatus.COMPLETE
    }
  },
  {
    path: '',
    canActivate: [AuthGuard, UserRoleGuard],
    loadChildren: () => import('src/app/ai-content-output/ai-content-output.module').then(m => m.AiContentOutputModule),
    data: {
      userStatus: userStatus.COMPLETE,
      title: 'Contents',
    }
  },
  {
    path: 'projects',
    canActivate: [AuthGuard, UserRoleGuard],
    component: ProjectsComponent,
    data: {
      userStatus: userStatus.COMPLETE,
      title: 'Projects',
    }
  },
  {
    path: 'documents/:uuid/edit',
    canActivate: [AuthGuard, UserRoleGuard],
    component: DocumentEditorComponent,
    data: {
      userStatus: userStatus.COMPLETE,
      title: 'Document Editor',
    }
  },
  {
    path: 'documents',
    canActivate: [AuthGuard, UserRoleGuard],
    component: DocumentListComponent,
    data: {
      userStatus: userStatus.COMPLETE,
      title: 'Documents',
    }
  },
  {
    path: 'trash',
    canActivate: [AuthGuard, UserRoleGuard],
    loadChildren: () => import('src/app/trash/trash.module').then(m => m.TrashModule),
    data: {
      userStatus: userStatus.COMPLETE,
      title: 'Trash'
    }
  }
];
