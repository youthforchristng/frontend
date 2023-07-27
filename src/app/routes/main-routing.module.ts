// import { ChannelsComponent } from './../components/channels/channels.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from "../authentication/admin.guard";
import { AuthGuard } from "../authentication/auth.guard";
import { UserComponent } from "../components/user/user.component";

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('../modules/dashboard.module').then(m => m.DashboardModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'channel/:id',
  //   component: ChannelsComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: '',
    component: UserComponent,
    loadChildren: () => import('../modules/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('../modules/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, //AdminGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRoutingModule { }
