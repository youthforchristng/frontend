import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MaterialModule } from 'src/material.module';
// import { SharedModule } from './shared.module';

import { ResetUserRoutingModule } from '../routes/reset-user-routing.module';

import { GenerateOtpComponent } from '../components/reset-user/01-generate-otp/generate-otp.component';
import { CompleteResetComponent } from '../components/reset-user/02-complete-reset/complete-reset.component';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    GenerateOtpComponent,
    CompleteResetComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ResetUserRoutingModule,
    SharedModule,
    // MaterialModule
  ]
})
export class ResetUserModule { }
