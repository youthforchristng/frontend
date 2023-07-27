import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { GenerateOtpComponent } from "../components/reset-user/01-generate-otp/generate-otp.component";
import { CompleteResetComponent } from '../components/reset-user/02-complete-reset/complete-reset.component';

const routes: Routes = [
  { path: 'generate-otp', component: GenerateOtpComponent },
  { path: 'complete-reset', component: CompleteResetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResetUserRoutingModule {



}
