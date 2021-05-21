import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AdministratorComponent } from "./administrator.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserRightsComponent } from "./user-rights/user-rights.component";
import { UserMasterComponent } from "./user-master/user-master.component";
import { AdministratorService } from "./administrator.service";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { JwtInterceptor } from "src/app/_helper/JwtInterceptor";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxPaginationModule } from "ngx-pagination";
import { TableModule } from "primeng/table";

const routes: Routes = [
  { path: "", component: AdministratorComponent },
  { path: "userRights", component: UserRightsComponent },
  { path: "userMaster", component: UserMasterComponent },
];

@NgModule({
  declarations: [UserRightsComponent, UserMasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AdministratorService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class AdministratorModule {}
