import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { AdminComponent } from "./admin/admin.component";

const routes: Routes = [
    { path: '', children: [
        { path: 'adminHome', component: AdminHomeComponent },
        { path: 'admin', component: AdminComponent },
        { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}