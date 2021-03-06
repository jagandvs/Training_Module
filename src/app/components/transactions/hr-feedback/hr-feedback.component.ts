import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Hr_remark, Offline_Evaluation } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-hr-feedback",
  templateUrl: "./hr-feedback.component.html",
  styleUrls: ["./hr-feedback.component.css"],
})
export class HrFeedbackComponent implements OnInit {
  public empList: any[] = [];
  public saveEmpFeedback: any[] = [];

  public EMP_ID: number;
  public selectedAppovalList: any[] = [];
  public selectedTraining: string;
  public trainingMasterDropdown: SelectItem[] = [];
  public effectivenessDropdown: SelectItem[] = [];
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
      "TrainingProgramMaster_ID=trainingprogram_training_program_id and trainingprogram_master.ES_DELETE=0",
  };
  constructor(
    private commonService: CommonService,

    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.EMP_ID = currentUser?.user.EMP_CODE;
    this.commonService
      .checkRight(UM_CODE, Hr_remark, "checkRight")
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
      this.effectivenessDropdown = [
        {
          label: "Effective",
          value: "effective",
        },
        {
          label: "Non-Effective",
          value: "non-effective",
        },
      ];
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
    }
  }
  onTrainingProgramChange() {
    console.log(this.selectedTraining);
    if (this.selectedTraining != null) {
      this.empList = [];
      console.log(this.selectedTraining, 0);
      this.service
        .GetEmployeeListForHODFeedback(this.selectedTraining, 0)
        .subscribe((data) => {
          console.log(data);
          this.empList = data;
          if (!this.empList.length) {
            this.messageService.add({
              key: "t1",
              severity: "error",
              summary: "Error",
              detail: "No Employee Found",
            });
          } else {
            data.map((value) => {
              this.saveEmpFeedback.push({
                TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID: this.selectedTraining,
                TRAININGPROGRAMDETAIL_EMP_ID: value.EMP_MASTER_ID,
                TRAININGPROGRAMDETAIL_EFFECTIVE_NON_EFFECTIVE_HR:
                  value.TRAININGPROGRAMDETAIL_EFFECTIVE_NON_EFFECTIVE_HR,
                TRAININGPROGRAMDETAIL_HR_REMARKS:
                  value.TRAININGPROGRAMDETAIL_HR_REMARKS,
              });
            });
          }
        });
    }
  }
  onEffChange(value, index) {
    this.saveEmpFeedback[
      index
    ].TRAININGPROGRAMDETAIL_EFFECTIVE_NON_EFFECTIVE_HR = value;
  }
  remarks(value, index) {
    this.saveEmpFeedback[index].TRAININGPROGRAMDETAIL_HR_REMARKS = value;
  }

  submitFeedback() {
    if (!this.empList.length) {
      this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "No Employee Found",
      });
    } else {
      this.service
        .UpdateUpdateHRRemarks(this.saveEmpFeedback)
        .subscribe((data) => {
          this.messageService.add({
            key: "t1",
            severity: "success",
            summary: "Success",
            detail: "Remarks Updated Successfully",
          });
        });
    }
  }
}
