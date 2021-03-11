import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Need } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
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

  public TRAINING_MASTER_QUERY = {
    TableNames: "TrainingProgramMaster",
    fieldNames: "TrainingProgramMaster_ID,TrainingProgramMaster_title",
    condition: "es_delete=0",
  };
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commonService
      .checkRight(UM_CODE, Training_Need, "checkRight")
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
              value: item.TrainingProgramMaster_ID,
            });
          }
        });
    }
  }

  onTrainingProgramChange() {
    console.log(this.selectedTraining);
    if (this.selectedTraining != null) {
      this.appovalList = [];
      this.service
        .getEmployeeListForAttendance(this.selectedTraining)
        .subscribe((data) => {
          console.log(data);
          this.appovalList = data;
        });
    } else {
      this.appovalList = [];
    }
  }
  approve() {
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
