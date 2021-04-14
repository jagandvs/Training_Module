import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeHistoryCardComponent } from "./employee-history-card/employee-history-card.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "src/app/_helper/JwtInterceptor";
import { ReportsService } from "./reports.service";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from "primeng/inputtext";
import { NgxSpinnerModule } from "ngx-spinner";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { HistoryCardComponent } from "./history-card/history-card.component";
import { TrainingNeedsComponent } from "./training-needs/training-needs.component";
import { PresentSkillsComponent } from "./present-skills/present-skills.component";
import { TrainingCalenderComponent } from "./training-calender/training-calender.component";

const routes: Routes = [
  { path: "employeeHistoryCard", component: EmployeeHistoryCardComponent },
  { path: "historyCard", component: HistoryCardComponent },
  { path: "presentSkills", component: PresentSkillsComponent },
  { path: "trainingNeeds", component: TrainingNeedsComponent },
  { path: "trainingCalender", component: TrainingCalenderComponent },
];

@NgModule({
  declarations: [
    EmployeeHistoryCardComponent,
    HistoryCardComponent,
    TrainingNeedsComponent,
    PresentSkillsComponent,
    TrainingCalenderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    TableModule,
    ConfirmDialogModule,
    InputTextModule,
    NgxSpinnerModule,
    CalendarModule,
    ButtonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ReportsService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class ReportsModule {}
