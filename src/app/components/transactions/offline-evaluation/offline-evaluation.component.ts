import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Offline_Evaluation } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-offline-evaluation",
  templateUrl: "./offline-evaluation.component.html",
  styleUrls: ["./offline-evaluation.component.css"],
})
export class OfflineEvaluationComponent implements OnInit {
  public appovalList: any[] = [];
  public QuestionMaster: any[] = [];

  public COMPANY_ID: number;
  public selectedAppovalList: any[] = [];
  public selectedTraining: string;
  public trainingMasterDropdown: SelectItem[] = [];
  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public TRAINING_MASTER_QUERY = {
    TableNames: "trainingprogrammaster,trainingprogram_master",
    fieldNames:
      "TrainingProgram_ID,TrainingProgramMaster_title +' -> '+ CONVERT(varchar,TRAININGPROGRAM_ID_FROM_DATE,107) +' - '+ CONVERT(varchar,TRAININGPROGRAM_ID_TO_DATE,107) as TrainingProgramMaster_title",
    condition:
      "TrainingProgramMaster_ID=trainingprogram_training_program_id and trainingprogram_master.ES_DELETE=0 AND TrainingProgramMaster_emptype=2",
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.commonService
      .checkRight(UM_CODE, Offline_Evaluation, "checkRight")
      .subscribe((data) => {
        for (let access of data) {
          this.menuAccess = access.MENU;
          this.addAccess = access.ADD;
          this.deleteAccess = access.DELETE;
          this.viewAccess = access.VIEW;
          this.printAccess = access.PRINT;
          this.backDateAccess = access.BACK_DATE;
          this.updateAccess = access.UPDATE;
        }
      });

    if (this.menuAccess) {
      this.commonService
        .FillCombo(this.TRAINING_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            console.log(data);
            this.trainingMasterDropdown.push({
              label: item.TrainingProgramMaster_title,
              value: item.TrainingProgram_ID,
            });
          }
        });
      var currentUser = JSON.parse(localStorage.getItem("currentUser"));

      this.COMPANY_ID = currentUser.companyDetails.CM_ID;
    }
  }
  onTrainingProgramChange() {
    console.log(this.selectedTraining);
    if (this.selectedTraining != null) {
      this.appovalList = [];
      this.service
        .getEmployeeListForOfflineEvaluation(
          this.selectedTraining,
          this.COMPANY_ID
        )
        .subscribe((data) => {
          console.log(data);
          this.appovalList = data;
          this.QuestionMaster = [];
          for (let value of data) {
            this.QuestionMaster.push({
              PROCESS: "Insert",
              EVAL_ID: 0,
              EVAL_CM_COMP_ID: this.COMPANY_ID,
              EVAL_DATE: new Date(),
              EVAL_TRAINING_SCHEDULE_ID: this.selectedTraining,
              EVAL_EMP_ID: value.EMP_MASTER_ID,
              EVAL_TOTAL_MARKS: "",
              ES_DELETE: 0,
              MODIFY: 0,
            });
          }
          if (!this.appovalList.length) {
            this.messageService.add({
              key: "t1",
              severity: "error",
              summary: "Error",
              detail: "No Employee Found",
            });
          }
        });
    } else {
      this.appovalList = [];
    }
  }
  addMarks(value, index) {
    console.log(value, index);
    this.QuestionMaster[index].EVAL_TOTAL_MARKS = value;
  }
  approve() {
    var error = false;
    if (this.QuestionMaster.length > 0) {
      this.QuestionMaster.map((data) => {
        if (data.EVAL_TOTAL_MARKS == "") {
          error = true;
          return this.messageService.add({
            key: "t1",
            severity: "error",
            summary: "Error",
            detail: "Fill all marks of employees",
          });
        }
        if (data.EVAL_TOTAL_MARKS < 0 || data.EVAL_TOTAL_MARKS > 100) {
          error = true;
          return this.messageService.add({
            key: "t1",
            severity: "error",
            summary: "Error",
            detail: "Marks should be between 0 and 100",
          });
        }
      });
      if (!error) {
        this.service
          .saveOfflineEvaluation(this.QuestionMaster)
          .subscribe((data) => {
            this.messageService.add({
              key: "t1",
              severity: "success",
              summary: "Success",
              detail: "Marks Updated",
            });
            this.QuestionMaster.length = 0;
            this.appovalList.length = 0;
          });
      }
    } else {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Employee Found",
      });
    }
  }
}
