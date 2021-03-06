import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { QuestionBankComponent } from "./question-bank/question-bank.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { TransactionsService } from "./transactions.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JwtInterceptor } from "src/app/_helper/JwtInterceptor";
import { InputTextModule } from "primeng/inputtext";

import { TrainingNeedComponent } from "./training-need/training-need.component";
import { TrainingScheduleComponent } from "./training-schedule/training-schedule.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { TrainingApprovalComponent } from "./training-approval/training-approval.component";
import { AttendanceApprovalComponent } from "./attendance-approval/attendance-approval.component";
import { FileUploadModule } from "primeng/fileupload";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { CalendarModule } from "primeng/calendar";
import { OfflineEvaluationComponent } from "./offline-evaluation/offline-evaluation.component";
import { HodFeedbackComponent } from "./hod-feedback/hod-feedback.component";
import { HrFeedbackComponent } from "./hr-feedback/hr-feedback.component";

const routes: Routes = [
  { path: "questionBank", component: QuestionBankComponent },
  { path: "trainingNeed", component: TrainingNeedComponent },
  { path: "trainingSchedule", component: TrainingScheduleComponent },
  { path: "trainingApproval", component: TrainingApprovalComponent },
  {
    path: "trainingAttendanceApproval",
    component: AttendanceApprovalComponent,
  },
  {
    path: "evaluation",
    component: EvaluationComponent,
  },
  {
    path: "offlineEvaluation",
    component: OfflineEvaluationComponent,
  },
  {
    path: "hodFeedback",
    component: HodFeedbackComponent,
  },
  {
    path: "hrFeedback",
    component: HrFeedbackComponent,
  },
  { path: "**", redirectTo: "DashboardComponent" },
];

@NgModule({
  declarations: [
    QuestionBankComponent,
    TrainingNeedComponent,
    TrainingScheduleComponent,
    TrainingApprovalComponent,
    AttendanceApprovalComponent,
    EvaluationComponent,
    OfflineEvaluationComponent,
    HodFeedbackComponent,
    HrFeedbackComponent,
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
    FileUploadModule,
    NgxSpinnerModule,
    CalendarModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    TransactionsService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class TransactionsModule {}
