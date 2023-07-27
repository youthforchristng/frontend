import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { WelcomeImageComponent } from '../shared/welcome-image/welcome-image.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RouterModule, //RouterLinkActiveOptions
} from '@angular/router';
import { RepliesComponent } from '../shared/replies/replies.component';
import { MatSidenavModule } from '@angular/material/sidenav'; // Import the MatSidenavModule
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SideBarSkeletonLoaderComponent } from '../shared/sidebar-skeleton-loader/sidebar-skeleton-loader.component';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';
import { TableSkeletonLoaderComponent } from '../shared/table-skeleton-loader/table-skeleton-loader.component';

import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { NightModeToggleComponent } from '../shared/night-mode-toggle/night-mode-toggle.component';


@NgModule({
  declarations: [
    WelcomeImageComponent,
    SidebarComponent,
    AdminSidebarComponent,
    LoaderComponent,
    RepliesComponent,
    SkeletonLoaderComponent,
    SideBarSkeletonLoaderComponent,
    TableSkeletonLoaderComponent,
    ConfirmationDialogComponent,
    NightModeToggleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSidenavModule,
    MatDialogModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    WelcomeImageComponent,
    SidebarComponent,
    AdminSidebarComponent,
    LoaderComponent,
    RepliesComponent,
    SkeletonLoaderComponent,
    SideBarSkeletonLoaderComponent,
    TableSkeletonLoaderComponent,
    ConfirmationDialogComponent,
    NightModeToggleComponent,
  ],
  providers: [
    // { provide: RouterLinkActiveOptions, useValue: { exact: true } }
  ],
  schemas: [],
})
export class SharedModule { }
