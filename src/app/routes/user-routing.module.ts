import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../authentication/auth.guard";
// import { AdminChannelsComponent } from "../components/admin/channels/channels.component";
// import { AdminPostsComponent } from "../components/admin/posts/posts.component";
// import { AdminUsersComponent } from "../components/admin/users/users.component";
import { ChannelsComponent } from "../components/channels/channels.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../modules/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'channel/:id',
    component: ChannelsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }
