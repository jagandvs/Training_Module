import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AdministratorComponent } from "./administrator.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserRightsComponent } from "./user-rights/user-rights.component";

const routes: Routes = [
  { path: "", component: AdministratorComponent },
  { path: "userRights", component: UserRightsComponent },
];

@NgModule({
  declarations: [UserRightsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes),
  ],
})
export class AdministratorModule {}
