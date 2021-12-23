import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../angular-material.module";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin/admin.component";

@NgModule({
    declarations: [AdminComponent, AdminHomeComponent],
    imports: [
        CommonModule, 
        AdminRoutingModule,
        AngularMaterialModule
    ]
})

export class AdministrationModule {}