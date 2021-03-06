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
import { EmployeeMasterComponent } from "./employee-master/employee-master.component";
import { TrainingNeedComponent } from "./training-need/training-need.component";

const routes: Routes = [
  { path: "questionBank", component: QuestionBankComponent },
  { path: "employeeMaster", component: EmployeeMasterComponent },
  { path: "trainingNeed", component: TrainingNeedComponent },
];

@NgModule({
  declarations: [
    QuestionBankComponent,
    EmployeeMasterComponent,
    TrainingNeedComponent,
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
