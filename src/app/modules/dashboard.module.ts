import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {MatProgressBarModule} from '@angular/material/progress-bar';

// import { MaterialModule } from 'src/material.module';
import { SharedModule } from './shared.module';

import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DashboardRoutingModule } from '../routes/dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule,
    // NgxPaginationModule,
    // MatProgressBarModule,
    // MaterialModule
  ]
})
export class DashboardModule { }
