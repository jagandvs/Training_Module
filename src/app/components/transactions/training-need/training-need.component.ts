import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";
import { Training_Schedule } from "src/app/_helper/SM_CODE";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-training-need",
  templateUrl: "./training-need.component.html",
  styleUrls: ["./training-need.component.css"],
})
export class TrainingNeedComponent implements OnInit {
  public trainingMasterTable: any[] = [];
  public trainingDetailTable: any[] = [];
  public trainingDetails: any[] = [];

  public trainingMasterForm: FormGroup;
  public trainingDetailForm: FormGroup;

  public loading: boolean = false;
  public displayBasic: boolean = false;
  public submitted: boolean = false;
  public newItem: boolean = false;
  public editInsert: boolean = false;
  public editIndex: number;
  public editingPKCODE: number;

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public process: string;
  public comp_id: number;

  public employeeMasterDropdown: SelectItem[] = [];
  public trainingProgramMasterDropdown: SelectItem[] = [];
  public EMPLOYEE_MASTER_QUERY = {
    TableNames: "EmployeeMaster",
    fieldNames: "EMP_MASTER_NAME,EMP_MASTER_ID",
    condition: "ES_DELETE=0",
  };
  public TRAINING_PROGRAM_MASTER_QUERY = {
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
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.commonService
      .checkRight(UM_CODE, Training_Schedule, "checkRight")
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
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.commonService
        .FillCombo(this.EMPLOYEE_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.employeeMasterDropdown.push({
              label: item.EMP_MASTER_NAME,
              value: item.EMP_MASTER_ID,
            });
          }
        });
      this.commonService
        .FillCombo(this.TRAINING_PROGRAM_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.trainingProgramMasterDropdown.push({
              label: item.TrainingProgramMaster_title,
              value: item.TrainingProgramMaster_ID,
            });
          }
        });
      this.getTrainingNeedTable();
      this.trainingMasterForm = this.fb.group({
        TRAINING_NEED_ID: [0],
        TRAINING_NEED_CM_COMP_IND: [this.comp_id],
        TRAINING_NEED_EMP_CODE: ["", Validators.required],
        TRAINING_NEED_FROM_DATE: ["", Validators.required],
        TRAINING_NEED_TO_DATE: ["", Validators.required],
      });
      this.trainingDetailForm = this.fb.group({
        TRAINING_NEED_DETAIL_ID: [""],
        TRAINING_NEED_PROGRAM_CODE: ["", Validators.required],
        TRAINING_NEED_ATTEND: ["", Validators.required],
        TRAINING_NEED_PERCENTAGE: ["", Validators.required],
        TRAINING_NEED_REMARKS: ["", Validators.required],
      });
    }
  }

  get f() {
    return this.trainingMasterForm.controls;
  }

  get g() {
    return this.trainingDetailForm.controls;
  }

  getTrainingNeedTable() {
    this.trainingMasterTable = [];
    this.loading = true;
    this.service
      .UPSERT_TrainingNeedsMaster("UPSERT_TrainingNeedsMaster", "SelectAll", 0)
      .subscribe((data) => {
        for (let employee of data) {
          this.trainingMasterTable.push({
            EMP_NAME: employee.EMP_MASTER_NAME,
            FROM_DATE: employee.TRAINING_NEED_FROM_DATE,
            TRAINING_NEED_ID: employee.TRAINING_NEED_ID,
            TO_DATE: employee.TRAINING_NEED_TO_DATE,
          });
        }
        this.loading = false;
      });
  }

  getEmployeeMaster(code) {
    var label;
    this.employeeMasterDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  getProgramMaster(code) {
    var label;
    this.trainingProgramMasterDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.trainingDetailTable = [];
      this.trainingDetails = [];
      this.newItem = true;
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to add Question Bank",
      });
    }
  }

  insertIntoTable() {
    if (!(this.trainingMasterForm.valid && this.trainingDetailForm.valid)) {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill All required fields",
      });
      return;
    }

    if (this.editInsert) {
      this.trainingDetails.splice(
        this.editIndex,
        1,
        this.trainingDetailForm.value
      );
      this.trainingDetailTable.splice(this.editIndex, 1, {
        title: this.getProgramMaster(
          this.g["TRAINING_NEED_PROGRAM_CODE"].value
        ),
        attend: this.g["TRAINING_NEED_ATTEND"].value,
        percentage: this.g["TRAINING_NEED_PERCENTAGE"].value,
        remarks: this.g["TRAINING_NEED_REMARKS"].value,
      });
    } else {
      this.trainingDetails.push(this.trainingDetailForm.value);
      this.trainingDetailTable.push({
        title: this.getProgramMaster(
          this.g["TRAINING_NEED_PROGRAM_CODE"].value
        ),
        attend: this.g["TRAINING_NEED_ATTEND"].value,
        percentage: this.g["TRAINING_NEED_PERCENTAGE"].value,
        remarks: this.g["TRAINING_NEED_REMARKS"].value,
      });
    }
    this.editInsert = false;
    this.trainingDetailForm.reset();
  }

  save() {
    this.submitted = true;
    if (this.trainingMasterForm.valid) {
      this.submitted = false;
      this.newItem ? (this.process = "Insert") : (this.process = "Update");

      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .INSERT_UPSERT_TrainingNeedsMaster(
              this.trainingMasterForm.value,
              this.trainingDetails,
              this.process
            )
            .subscribe(
              (data) => {
                this.editInsert = false;
                this.getTrainingNeedTable();
                this.displayBasic = false;
                this.cancel();
                this.messageService.add({
                  key: "t1",
                  severity: "success",
                  summary: "Success",
                  detail: this.process.toUpperCase() + " Successfully",
                });
              },
              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
        },
      });
    }
  }
  cancel() {
    this.commonService
      .setResetModify(
        "TrainingNeedsMaster",
        "ES_MODIFY",
        "TRAINING_NEED_ID",
        this.editingPKCODE,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.submitted = false;
        this.displayBasic = false;
        this.resetForm();
      });
  }
  resetForm() {
    this.trainingDetailForm.reset();
    this.trainingMasterForm.reset();
    this.trainingDetailTable = [];
    this.trainingDetails = [];
  }
  edit(trainingId) {
    this.newItem = false;
    this.editingPKCODE = trainingId;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "TrainingNeedsMaster",
          "ES_MODIFY",
          "TRAINING_NEED_ID",
          trainingId,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.commonService
              .setResetModify(
                "TrainingNeedsMaster",
                "ES_MODIFY",
                "TRAINING_NEED_ID",
                trainingId,
                1,
                "setLock"
              )
              .subscribe(
                (data) => {
                  this.service
                    .UPSERT_TrainingNeedsMaster(
                      "UPSERT_TrainingNeedsMaster",
                      "SelectMaster",
                      trainingId
                    )
                    .subscribe(
                      (data) => {
                        this.f["TRAINING_NEED_ID"].setValue(
                          data[0].TRAINING_NEED_ID
                        );
                        this.f["TRAINING_NEED_CM_COMP_IND"].setValue(
                          data[0].TRAINING_NEED_CM_COMP_IND
                        );
                        this.f["TRAINING_NEED_EMP_CODE"].setValue(
                          data[0].TRAINING_NEED_EMP_CODE
                        );
                        this.f["TRAINING_NEED_FROM_DATE"].setValue(
                          data[0].TRAINING_NEED_FROM_DATE
                        );
                        this.f["TRAINING_NEED_TO_DATE"].setValue(
                          data[0].TRAINING_NEED_TO_DATE
                        );

                        this.service
                          .UPSERT_TrainingNeedsMaster(
                            "UPSERT_TrainingNeedsMaster",
                            "SelectDetail",
                            trainingId
                          )
                          .subscribe(
                            (data) => {
                              this.displayBasic = true;
                              this.trainingDetails = data;
                              for (let item of data) {
                                this.trainingDetailTable.push({
                                  title: this.getProgramMaster(
                                    item.TRAINING_NEED_PROGRAM_CODE
                                  ),
                                  attend: item.TRAINING_NEED_ATTEND,
                                  percentage: item.TRAINING_NEED_PERCENTAGE,
                                  remarks: item.TRAINING_NEED_REMARKS,
                                });
                              }
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
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                }
              );
          } else {
            this.messageService.add({
              key: "t1",
              severity: "info",
              summary: "Success",
              detail: "Someone Editing the Item/ Item is locked",
            });
          }
        });
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to Edit Question Bank",
      });
    }
  }

  deleteTrainingDetail(index) {
    this.trainingDetailTable.splice(index, 1);
    this.trainingDetails.splice(index, 1);
  }
  delete(deleteItem) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "TrainingNeedsMaster",
          "ES_MODIFY",
          "TRAINING_NEED_ID",
          deleteItem,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.confirmationService.confirm({
              message: "Are you sure that you want to delete?",
              header: "Delete Confirmation",
              icon: "fas fa-trash",
              key: "c1",
              accept: () => {
                this.commonService
                  .deleteRow(
                    deleteItem,
                    "TRAINING_NEED_ID",
                    "1",
                    "ES_DELETE",
                    "TrainingNeedsMaster"
                  )
                  .subscribe(
                    (data) => {
                      this.getTrainingNeedTable();
                      this.messageService.add({
                        key: "t1",
                        severity: "success",
                        summary: "Success",
                        detail: "Deleted Successfully",
                      });
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
              },
            });
          } else {
            this.messageService.add({
              key: "t1",
              severity: "info",
              summary: "Success",
              detail: "Someone Editing the Item/ Item is locked",
            });
          }
        });
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to Delete Item",
      });
    }
  }
  editTrainingDetail(index) {
    this.editInsert = true;
    this.editIndex = index;
    this.g["TRAINING_NEED_PROGRAM_CODE"].setValue(
      this.trainingDetails[index].TRAINING_NEED_PROGRAM_CODE
    );
    this.g["TRAINING_NEED_ATTEND"].setValue(
      this.trainingDetails[index].TRAINING_NEED_ATTEND
    );
    this.g["TRAINING_NEED_PERCENTAGE"].setValue(
      this.trainingDetails[index].TRAINING_NEED_PERCENTAGE
    );
    this.g["TRAINING_NEED_REMARKS"].setValue(
      this.trainingDetails[index].TRAINING_NEED_REMARKS
    );
  }
}
