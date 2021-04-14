import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Training_Need } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-training-approval",
  templateUrl: "./training-approval.component.html",
  styleUrls: ["./training-approval.component.css"],
})
export class TrainingApprovalComponent implements OnInit {
  public appovalList: any[] = [];
  public list: any[] = [];

  public selectedAppovalList: any[] = [];
  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public EMP_ID: number;
  public COMPANY_ID: number;

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
      var currentUser = JSON.parse(localStorage.getItem("currentUser"));
      this.EMP_ID = currentUser.user.EMP_CODE;
      this.COMPANY_ID = currentUser.companyDetails.CM_ID;
      this.getEmployeeListForApproval();
    }
  }

  getEmployeeListForApproval() {
    this.service
      .getEmployeeListForApproval(this.EMP_ID, this.COMPANY_ID)
      .subscribe((data) => {
        this.appovalList = data;
      });
  }
  approve() {
    if (this.selectedAppovalList.length > 0) {
      for (let value of this.selectedAppovalList) {
        this.list.push({
          EMP_MASTER_ID: value.EMP_MASTER_ID,
          TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID: value.TRAININGPROGRAM_ID,
          TRAININGPROGRAMDETAIL_Approved_FOR_TRAINING: true,
        });
      }
      this.service.updateApproval(this.list).subscribe(
        (data) => {
          this.getEmployeeListForApproval();
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
