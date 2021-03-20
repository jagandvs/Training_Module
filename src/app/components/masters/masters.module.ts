import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CategoryMasterComponent } from "./category-master/category-master.component";
import { CategoryToSkillLevelMasterComponent } from "./category-to-skill-level-master/category-to-skill-level-master.component";
import { CustomerMasterComponent } from "./customer-master/customer-master.component";
import { DepartmentMasterComponent } from "./department-master/department-master.component";
import { StudyMaterialMasterComponent } from "./study-material-master/study-material-master.component";
import { ProcessMasterComponent } from "./process-master/process-master.component";
import { TrainingProgramMasterComponent } from "./training-program-master/training-program-master.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MastersService } from "./masters.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JwtInterceptor } from "src/app/_helper/JwtInterceptor";
import { InputTextModule } from "primeng/inputtext";
import { EmployeeMasterComponent } from "./employee-master/employee-master.component";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
const routes: Routes = [
  { path: "categoryMaster", component: CategoryMasterComponent },
  {
    path: "CategoryToSkillLevelMaster",
    component: CategoryToSkillLevelMasterComponent,
  },
  { path: "CustomerMaster", component: CustomerMasterComponent },
  { path: "DepartmentMaster", component: DepartmentMasterComponent },
  { path: "employeeMaster", component: EmployeeMasterComponent },

  { path: "StudyMaterialMaster", component: StudyMaterialMasterComponent },
  { path: "ProcessMaster", component: ProcessMasterComponent },
  { path: "TrainingProgramMaster", component: TrainingProgramMasterComponent },
];

@NgModule({
  declarations: [
    CategoryMasterComponent,
    CategoryToSkillLevelMasterComponent,
    CustomerMasterComponent,
    DepartmentMasterComponent,
    ProcessMasterComponent,
    StudyMaterialMasterComponent,
    TrainingProgramMasterComponent,
    EmployeeMasterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    FileUploadModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    MastersService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class MastersModule {}
