import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthenticationService } from "./_services/authentication.service";
import { CommonService } from "./_services/common.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JwtInterceptor } from "./_helper/JwtInterceptor";
import { LogoutComponent } from "./components/logout/logout.component";
import { AdministratorComponent } from "./components/administrator/administrator.component";
import { CategoryMasterComponent } from "./components/masters/category-master/category-master.component";
import { CategoryToSkillLevelMasterComponent } from "./components/masters/category-to-skill-level-master/category-to-skill-level-master.component";
import { CustomerMasterComponent } from "./components/masters/customer-master/customer-master.component";
import { DepartmentMasterComponent } from "./components/masters/department-master/department-master.component";
import { ProcessMasterComponent } from "./components/masters/process-master/process-master.component";
import { StudyMaterialMasterComponent } from "./components/masters/study-material-master/study-material-master.component";
import { TrainingProgramMasterComponent } from "./components/masters/training-program-master/training-program-master.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    AdministratorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthenticationService,
    CommonService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
