import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Attendance_Approval } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-attendance-approval",
  templateUrl: "./attendance-approval.component.html",
  styleUrls: ["./attendance-approval.component.css"],
})
export class AttendanceApprovalComponent implements OnInit {
  public appovalList: any[] = [];
  public list: any[] = [];

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

  public traineeName: string = "";
  public TRAINING_MASTER_QUERY = {
    TableNames: "trainingprogrammaster,trainingprogram_master",
    fieldNames:
      "TrainingProgram_ID,TrainingProgramMaster_title +' -> '+ CONVERT(varchar,TRAININGPROGRAM_ID_FROM_DATE,107) +' - '+ CONVERT(varchar,TRAININGPROGRAM_ID_TO_DATE,107) as TrainingProgramMaster_title",
    condition:
      "TrainingProgramMaster_ID=trainingprogram_training_program_id and trainingprogram_master.ES_DELETE=0",
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
      .checkRight(UM_CODE, Training_Attendance_Approval, "checkRight")
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
            this.trainingMasterDropdown.push({
              label: item.TrainingProgramMaster_title,
              value: item.TrainingProgram_ID,
            });
          }
        });
    }
  }

  onTrainingProgramChange() {
    console.log(this.selectedTraining);
    this.traineeName = "";
    if (this.selectedTraining != null) {
      var TRAINEE_QUERY = {
        TableNames: "TRAININGPROGRAM_MASTER",
        fieldNames: "TRAININGPROGRAM_TRAINING_CONDUCTEDBY",
        condition: `TRAININGPROGRAM_ID=${this.selectedTraining}`,
      };
      this.commonService.FillCombo(TRAINEE_QUERY).subscribe((data) => {
        this.traineeName = data[0].TRAININGPROGRAM_TRAINING_CONDUCTEDBY;
      });
      this.appovalList = [];
      this.service
        .getEmployeeListForAttendance(this.selectedTraining)
        .subscribe((data) => {
          console.log(data);
          this.appovalList = data;

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
  approve() {
    if (this.traineeName == "" || this.traineeName == null) {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "Please Enter Trainee Name",
      });
    }
    if (this.selectedAppovalList.length > 0) {
      for (let value of this.selectedAppovalList) {
        this.list.push({
          EMP_MASTER_ID: value.EMP_MASTER_ID,
          TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID: value.TRAININGPROGRAM_ID,
          TRAININGPROGRAMDETAIL_ATTENDANCE: true,
        });
      }
      this.service.updateAttendance(this.list).subscribe(
        (data) => {
          this.service
            .UpdateTraningConductedBy(this.selectedTraining, this.traineeName)
            .subscribe(
              (data) => {
                this.list = [];
                this.selectedAppovalList = [];
                this.selectedTraining = "";
                this.appovalList = [];
                this.messageService.add({
                  key: "t1",
                  severity: "success",
                  summary: "Success",
                  detail: "Appoved",
                });
              },

              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    } else {
      this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Record Selected",
      });
    }
  }
}
