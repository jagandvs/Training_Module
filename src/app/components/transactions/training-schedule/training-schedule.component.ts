import { Component, OnInit, ViewChild } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Training_Need } from "src/app/_helper/SM_CODE";
import {
  trainingScheduleUploadFolder,
  UM_CODE,
} from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";
import { FileUpload } from "primeng/fileupload";
import { isNull } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-training-schedule",
  templateUrl: "./training-schedule.component.html",
  styleUrls: ["./training-schedule.component.css"],
})
export class TrainingScheduleComponent implements OnInit {
  @ViewChild("fileInput") fileInput: FileUpload;

  public trainingMasterTable: any[] = [];
  public trainingDetailTable: any[] = [];
  public uploadedFiles: File[] = [];

  public trainingMasterForm: FormGroup;

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
  public datePipe: DatePipe;
  public trainingProgramMasterDropdown: SelectItem[] = [];
  public process: string;
  public comp_id: number;
  public pkcode: any;
  public saveLoading: boolean = false;
  public todayDate: string;
  public percentageError: boolean = false;
  public totalRecords = 0;

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
    let datePipe: DatePipe = new DatePipe("en-US");
    this.todayDate = datePipe.transform(new Date(), "yyyy-MM-dd");
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
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;

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
      this.getTrainingMasterTable();

      this.trainingMasterForm = this.fb.group({
        TRAININGPROGRAM_ID: [0],
        TRAININGPROGRAM_TRAINING_PROGRAM_ID: ["", Validators.required],
        TRAININGPROGRAM_CM_COMP_ID: [this.comp_id],
        TRAININGPROGRAM_ID_FROM_DATE: ["", Validators.required],
        TRAININGPROGRAM_ID_TO_DATE: ["", Validators.required],
        TRAININGPROGRAM_ID_PASSING_PERCENTAGE: ["", Validators.required],
      });
    }
  }

  get f() {
    return this.trainingMasterForm.controls;
  }
  getTrainingMasterTable() {
    this.trainingMasterTable = [];
    this.loading = true;
    this.service
      .UPSERT_TRAININGPROGRAM_MASTER(
        "UPSERT_TRAININGPROGRAM_MASTER",
        "SelectAll",
        0
      )
      .subscribe((data) => {
        console.log(data);
        this.trainingMasterTable = data;
        this.loading = false;
        this.totalRecords = this.trainingMasterTable.length;
      });
  }
  getEmployeeList(trainingId) {
    this.service.getEmployeeList(trainingId).subscribe((data) => {
      this.trainingDetailTable = [];
      for (let value of data) {
        this.trainingDetailTable.push({
          EMP_MASTER_NUMBER: value.EMP_MASTER_NUMBER,
          EMP_MASTER_NAME: value.EMP_MASTER_NAME,
          EMP_MASTER_ID: value.EMP_MASTER_ID,
          TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID: trainingId,
          TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING: false,
        });
      }
      if (this.trainingDetailTable.length > 0) {
        this.saveLoading = false;
      } else {
        this.saveLoading = true;

        this.messageService.add({
          key: "t2",
          severity: "info",
          summary: "Info",
          detail: "No Employee found under this training",
        });
      }
    });
  }
  checkPassingPercentage(value) {
    if (value > 100 || value < 0) {
      this.percentageError = true;
    } else {
      this.percentageError = false;
    }
  }
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.trainingDetailTable = [];

      this.newItem = true;
      this.uploadedFiles = [];
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to add",
      });
    }
  }
  changeApproval(value) {
    this.trainingDetailTable[
      value
    ].TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING = !this.trainingDetailTable[
      value
    ].TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING;
  }
  save() {
    console.log(this.trainingMasterForm.value);
    this.uploadedFiles = [];
    this.submitted = true;
    var error = false;

    this.fileInput.files.forEach((file) => {
      this.uploadedFiles.push(file);
    });

    var fromDate = new Date(
      this.f["TRAININGPROGRAM_ID_FROM_DATE"].value
    ).getTime();
    // var toDate = new Date(this.f["TRAININGPROGRAM_ID_TO_DATE"].value).getTime();

    if (this.f["TRAININGPROGRAM_TRAINING_PROGRAM_ID"].value != "") {
      console.log(this.f["TRAININGPROGRAM_TRAINING_PROGRAM_ID"].value);
      if (this.newItem) {
        var arr = this.trainingMasterTable.filter((master) => {
          console.log(
            fromDate,
            new Date(master.TRAININGPROGRAM_ID_FROM_DATE).getTime()
          );
          if (
            master.TRAININGPROGRAM_TRAINING_PROGRAM_ID ==
              this.f["TRAININGPROGRAM_TRAINING_PROGRAM_ID"].value &&
            fromDate == new Date(master.TRAININGPROGRAM_ID_FROM_DATE).getTime()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          error = true;
        } else {
          error = false;
        }
      } else {
        var arr = this.trainingMasterTable.filter((master) => {
          if (
            master.TRAININGPROGRAM_TRAINING_PROGRAM_ID ==
              this.f["TRAININGPROGRAM_TRAINING_PROGRAM_ID"].value &&
            fromDate ==
              new Date(master.TRAININGPROGRAM_ID_FROM_DATE).getTime() &&
            master.TRAININGPROGRAM_ID != this.f["TRAININGPROGRAM_ID"].value
          ) {
            return master;
          }
        });

        if (arr.length > 0) {
          error = true;
        } else {
          error = false;
        }
      }
    }
    console.log(error);

    if (error) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Training already scheduled in this date",
      });
    }
    if (this.percentageError) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "percentage should between 0 and 100",
      });
    }
    if (this.trainingMasterForm.valid && !this.percentageError && !error) {
      this.saveLoading = true;
      this.submitted = false;
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .INSERT_UPSERT_TRAININGPROGRAM_MASTER(
              this.trainingMasterForm.value,
              this.trainingDetailTable,
              this.process
            )
            .subscribe(
              (data) => {
                if (this.uploadedFiles.length > 0) {
                  this.newItem
                    ? (this.pkcode = data.PK_CODE)
                    : (this.pkcode = this.editingPKCODE);
                  for (let file of this.uploadedFiles) {
                    this.commonService
                      .upload(file, trainingScheduleUploadFolder, this.pkcode)
                      .subscribe(
                        (data) => {
                          console.log(data);
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                  }
                }
                this.editInsert = false;
                this.getTrainingMasterTable();
                this.displayBasic = false;
                this.cancel();
                this.saveLoading = false;
                this.messageService.add({
                  key: "t1",
                  severity: "success",
                  summary: "Success",
                  detail: "Submitted Successfully",
                });
              },
              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
        },
        reject: () => {
          this.saveLoading = false;
        },
      });
    } else {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Fill all required fields",
      });
    }
  }
  edit(trainingId) {
    this.uploadedFiles = [];
    this.newItem = false;
    this.editingPKCODE = trainingId;

    let editarray = this.trainingMasterTable.filter((data) => {
      return trainingId == data.TRAININGPROGRAM_ID;
    });

    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "TRAININGPROGRAM_MASTER",
          "ES_MODIFY",
          "TRAININGPROGRAM_ID",
          trainingId,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.commonService
              .setResetModify(
                "TRAININGPROGRAM_MASTER",
                "ES_MODIFY",
                "TRAININGPROGRAM_ID",
                trainingId,
                1,
                "setLock"
              )
              .subscribe(
                (data) => {
                  this.getFiles(
                    trainingScheduleUploadFolder,
                    this.editingPKCODE
                  );
                  this.displayBasic = true;
                  let trainingMasterAndDetail = this.trainingMasterTable.filter(
                    (data) => {
                      return trainingId == data.TRAININGPROGRAM_ID;
                    }
                  );
                  this.f["TRAININGPROGRAM_ID"].setValue(
                    trainingMasterAndDetail[0].TRAININGPROGRAM_ID
                  );
                  this.f["TRAININGPROGRAM_TRAINING_PROGRAM_ID"].setValue(
                    trainingMasterAndDetail[0]
                      .TRAININGPROGRAM_TRAINING_PROGRAM_ID
                  );
                  this.f["TRAININGPROGRAM_CM_COMP_ID"].setValue(this.comp_id);
                  this.f["TRAININGPROGRAM_ID_FROM_DATE"].setValue(
                    formatDate(
                      trainingMasterAndDetail[0].TRAININGPROGRAM_ID_FROM_DATE,
                      "yyyy-MM-dd",
                      "en"
                    )
                  );
                  this.f["TRAININGPROGRAM_ID_TO_DATE"].setValue(
                    formatDate(
                      trainingMasterAndDetail[0].TRAININGPROGRAM_ID_TO_DATE,
                      "yyyy-MM-dd",
                      "en"
                    )
                  );
                  this.f["TRAININGPROGRAM_ID_PASSING_PERCENTAGE"].setValue(
                    trainingMasterAndDetail[0]
                      .TRAININGPROGRAM_ID_PASSING_PERCENTAGE
                  );
                  this.trainingDetailTable = [];
                  for (let value of trainingMasterAndDetail) {
                    this.trainingDetailTable.push({
                      EMP_MASTER_NUMBER: value.EMP_MASTER_NUMBER,
                      EMP_MASTER_NAME: value.EMP_MASTER_NAME,
                      EMP_MASTER_ID: value.EMP_MASTER_ID,
                      TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID:
                        trainingMasterAndDetail[0].TRAININGPROGRAM_ID,
                      TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING:
                        value.TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING,
                    });
                  }
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
        detail: "Sorry!! You dont have access to Edit",
      });
    }
  }

  cancel() {
    if (this.newItem) {
      this.submitted = false;
      this.displayBasic = false;
      this.reset();
    } else {
      this.commonService
        .setResetModify(
          "TRAININGPROGRAM_MASTER",
          "ES_MODIFY",
          "TRAININGPROGRAM_ID",
          this.editingPKCODE,
          0,
          "setLock"
        )
        .subscribe((data) => {
          this.submitted = false;
          this.displayBasic = false;
          this.reset();
        });
    }
  }

  delete(trainingId) {
    if (this.deleteAccess) {
      var DEL_CHECK_EVAL_QUERY = {
        TableNames: "EVAL",
        fieldNames: "*",
        condition: `EVAL_TRAINING_SCHEDULE_ID=${trainingId}`,
      };
      console.log(DEL_CHECK_EVAL_QUERY.condition);
      this.commonService.FillCombo(DEL_CHECK_EVAL_QUERY).subscribe((data) => {
        console.log(data.length);
        if (data.length == 0) {
          this._delete(trainingId);
        } else {
          this.messageService.add({
            key: "t1",
            severity: "info",
            summary: "info",
            detail: "Schedule cannot be deleted",
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
  _delete(trainingId) {
    this.commonService
      .setResetModify(
        "TRAININGPROGRAM_MASTER",
        "ES_MODIFY",
        "TRAININGPROGRAM_ID",
        trainingId,
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
                  trainingId,
                  "TRAININGPROGRAM_ID",
                  "1",
                  "ES_DELETE",
                  "TRAININGPROGRAM_MASTER"
                )
                .subscribe(
                  (data) => {
                    this.getTrainingMasterTable();
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
  }
  reset() {
    this.trainingMasterForm.reset();
    this.newItem
      ? this.f["TRAININGPROGRAM_ID"].setValue("")
      : this.f["TRAININGPROGRAM_ID"].setValue(this.editingPKCODE);
    this.f["TRAININGPROGRAM_CM_COMP_ID"].setValue(this.comp_id);
    this.trainingDetailTable = [];
  }
  getFiles(trainingScheduleUploadFolder, pkcode) {
    this.commonService
      .getListFiles(trainingScheduleUploadFolder, pkcode)
      .subscribe((data) => {
        console.log(data);
        this.uploadedFiles = [];
        this.uploadedFiles = data;
      });
  }
  deleteFile(fileName) {
    this.commonService
      .deleteFile(fileName, trainingScheduleUploadFolder, this.editingPKCODE)
      .subscribe((data) => {
        this.messageService.add({
          key: "t2",
          severity: "success",
          summary: "Success",
          detail: "File Deleted",
        });
        this.getFiles(trainingScheduleUploadFolder, this.editingPKCODE);
      });
  }
  downloadFile(fileName) {
    this.commonService.downloadFile(
      fileName,
      trainingScheduleUploadFolder,
      this.editingPKCODE
    );
  }
}
