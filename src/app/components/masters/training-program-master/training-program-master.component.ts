import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";
import { formatDate } from "@angular/common";
import {
  trainingProgramUploadFolder,
  UM_CODE,
} from "src/app/_helper/variables";
import { Training_Program } from "src/app/_helper/SM_CODE";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-training-program-master",
  templateUrl: "./training-program-master.component.html",
  styleUrls: ["./training-program-master.component.css"],
})
export class TrainingProgramMasterComponent implements OnInit {
  @ViewChild("fileInput") fileInput: FileUpload;

  public trainingMaster: any[] = [];
  public trainingMasterForm: FormGroup;
  public processMasterDropdown: SelectItem[] = [];
  public categoryMasterDropdown: SelectItem[] = [];
  public skillMasterDropdown: SelectItem[] = [];

  public uploadedFiles: File[] = [];

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public loading: boolean = false;
  public submitted: boolean = false;
  public newItem: boolean = false;
  public displayBasic: Boolean = false;
  public duplicateError: boolean = false;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public process: string;
  public comp_id: string;
  public editingPKCode: number;
  public pkcode: any;

  public totalRecords = 0;

  public CATEGORY_MASTER_QUERY: any = {
    TableNames: "category_master",
    fieldNames: "category_id,category_name",
    condition: "es_delete=0",
  };
  public PROCESS_MASTER_QUERY: any = {
    TableNames: "process_master",
    fieldNames: "process_id,process_name",
    condition: "es_delete=0",
  };
  public SKILL_MASTER_QUERY: any = {
    TableNames: "CategoryToSkillLevel_Master",
    fieldNames:
      "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
    condition: "es_delete=0",
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.getTrainingMaster();
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    this.commonService
      .FillCombo(this.PROCESS_MASTER_QUERY)
      .subscribe((data) => {
        for (let value of data) {
          this.processMasterDropdown.push({
            label: value.process_name,
            value: value.process_id,
          });
        }
      });
    this.commonService
      .FillCombo(this.CATEGORY_MASTER_QUERY)
      .subscribe((data) => {
        for (let value of data) {
          this.categoryMasterDropdown.push({
            label: value.category_name,
            value: value.category_id,
          });
        }
      });
    this.commonService.FillCombo(this.SKILL_MASTER_QUERY).subscribe((data) => {
      for (let value of data) {
        this.skillMasterDropdown.push({
          label: value.CategoryToSkillLevelMaster_title,
          value: value.CategoryToSkillLevelMaster_ID,
        });
      }
    });
    this.trainingMasterForm = this.fb.group({
      TrainingProgramMaster_ID: [""],
      TrainingProgramMaster_CM_COMP_ID: [this.comp_id],
      TrainingProgramMaster_processMasterid: ["", Validators.required],
      TrainingProgramMaster_categoryid: ["", Validators.required],
      TrainingProgramMaster_skilllevelid: ["", Validators.required],
      TrainingProgramMaster_title: ["", Validators.required],
      TrainingProgramMaster_duration: ["", Validators.required],
      TrainingProgramMaster_location: ["", Validators.required],
      TrainingProgramMaster_modeOfTraining: ["", Validators.required],
      TrainingProgramMaster_iscustomerend: [""],
      TrainingProgramMaster_evalfrom: [new Date()],
      TrainingProgramMaster_evalto: [new Date()],
    });
  }
  get f() {
    return this.trainingMasterForm.controls;
  }

  getTrainingMaster() {
    this.loading = true;
    this.commonService
      .checkRight(UM_CODE, Training_Program, "checkRight")
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
      this.trainingMaster = [];
      this.commonService
        .getTableResponse("*", "TrainingProgramMaster", "es_delete=0")
        .subscribe((data) => {
          data.map((process) => {
            this.trainingMaster.push({
              TrainingProgramMaster_ID: process.TrainingProgramMaster_ID,
              TrainingProgramMaster_CM_COMP_ID:
                process.TrainingProgramMaster_CM_COMP_ID,
              TrainingProgramMaster_processMasterid:
                process.TrainingProgramMaster_processMasterid,
              TrainingProgramMaster_categoryid:
                process.TrainingProgramMaster_categoryid,
              TrainingProgramMaster_skilllevelid:
                process.TrainingProgramMaster_skilllevelid,
              TrainingProgramMaster_title: process.TrainingProgramMaster_title,
              TrainingProgramMaster_duration:
                process.TrainingProgramMaster_duration,
              TrainingProgramMaster_location:
                process.TrainingProgramMaster_location,
              TrainingProgramMaster_modeOfTraining:
                process.TrainingProgramMaster_modeOfTraining,
              TrainingProgramMaster_iscustomerend:
                process.TrainingProgramMaster_iscustomerend,
              TrainingProgramMaster_evalfrom:
                process.TrainingProgramMaster_evalfrom,
              TrainingProgramMaster_evalto:
                process.TrainingProgramMaster_evalto,
            });
          });
          this.totalRecords = this.trainingMaster.length;

          this.loading = false;
        });
    }
  }

  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.newItem = true;
      this.submitted = false;
      this.fileInput.files = [];
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to add",
      });
    }
  }
  save() {
    this.uploadedFiles = [];
    this.fileInput.files.forEach((file) => {
      this.uploadedFiles.push(file);
    });

    this.submitted = true;
    if (this.f["TrainingProgramMaster_title"].value != "") {
      if (this.newItem) {
        var arr = this.trainingMaster.filter((master) => {
          if (
            master.TrainingProgramMaster_title.toLowerCase() ==
            this.f["TrainingProgramMaster_title"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateError = true;
          return;
        } else {
          this.duplicateError = false;
        }
      } else {
        var arr = this.trainingMaster.filter((master) => {
          if (
            master.TrainingProgramMaster_title.toLowerCase() ==
              this.f["TrainingProgramMaster_title"].value.toLowerCase() &&
            master.TrainingProgramMaster_ID !=
              this.f["TrainingProgramMaster_ID"].value
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateError = true;
          return;
        } else {
          this.duplicateError = false;
        }
      }
    }
    if (this.trainingMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");

      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.saveLoading = true;

          this.service
            .CRUDMasters(
              "UPSERT_TrainingProgramMaster",
              this.trainingMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.newItem
                ? (this.pkcode = data.PK_CODE)
                : (this.pkcode = this.editingPKCode);
              for (let file of this.uploadedFiles) {
                this.commonService
                  .upload(file, trainingProgramUploadFolder, this.pkcode)
                  .subscribe((data) => {
                    this.displayBasic = false;
                    this.getTrainingMaster();
                    this.saveLoading = false;
                    this.submitted = false;
                    this.reset();
                  });
              }
            });
        },
        reject: () => {
          this.saveLoading = false;
        },
      });
    } else {
      this.saveLoading = false;
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill all required fields",
      });
    }
    return;
  }
  cancel() {
    this.cancelLoading = true;
    if (this.newItem) {
      this.newItem = false;
      this.displayBasic = false;
      this.submitted = false;
      this.cancelLoading = false;
      this.reset();
    } else {
      this.commonService
        .setResetModify(
          "TrainingProgramMaster",
          "es_modify",
          "TrainingProgramMaster_ID",
          this.editingPKCode,
          0,
          "setLock"
        )
        .subscribe((data) => {
          this.newItem = false;
          this.displayBasic = false;
          this.submitted = false;
          this.cancelLoading = false;
          this.reset();
        });
    }
  }
  reset() {
    this.trainingMasterForm.reset();
    this.duplicateError = false;
    this.submitted = false;
    this.newItem
      ? this.f["TrainingProgramMaster_ID"].setValue("")
      : this.f["TrainingProgramMaster_ID"].setValue(this.editingPKCode);
    this.f["TrainingProgramMaster_CM_COMP_ID"].setValue(this.comp_id);
  }
  delete(code) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "TrainingProgramMaster",
          "es_modify",
          "TrainingProgramMaster_ID",
          code,
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
                    code,
                    "TrainingProgramMaster_ID",
                    "1",
                    "es_delete",
                    "TrainingProgramMaster"
                  )
                  .subscribe(
                    (data) => {
                      this.getTrainingMaster();
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
              severity: "warn",
              summary: "Warning",
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
  edit(training) {
    this.uploadedFiles = [];
    this.fileInput.files = [];
    this.editingPKCode = training.TrainingProgramMaster_ID;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "TrainingProgramMaster",
          "es_modify",
          "TrainingProgramMaster_ID",
          this.editingPKCode,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.commonService
              .setResetModify(
                "TrainingProgramMaster",
                "es_modify",
                "TrainingProgramMaster_ID",
                this.editingPKCode,
                1,
                "setLock"
              )
              .subscribe((data) => {
                this.f["TrainingProgramMaster_ID"].setValue(
                  training.TrainingProgramMaster_ID
                );
                this.f["TrainingProgramMaster_CM_COMP_ID"].setValue(
                  training.TrainingProgramMaster_CM_COMP_ID
                );
                this.f["TrainingProgramMaster_processMasterid"].setValue(
                  training.TrainingProgramMaster_processMasterid
                );
                this.f["TrainingProgramMaster_categoryid"].setValue(
                  training.TrainingProgramMaster_categoryid
                );
                this.f["TrainingProgramMaster_skilllevelid"].setValue(
                  training.TrainingProgramMaster_skilllevelid
                );
                this.f["TrainingProgramMaster_title"].setValue(
                  training.TrainingProgramMaster_title
                );
                this.f["TrainingProgramMaster_duration"].setValue(
                  training.TrainingProgramMaster_duration
                );
                this.f["TrainingProgramMaster_location"].setValue(
                  training.TrainingProgramMaster_location
                );
                this.f["TrainingProgramMaster_modeOfTraining"].setValue(
                  training.TrainingProgramMaster_modeOfTraining
                );
                this.f["TrainingProgramMaster_iscustomerend"].setValue(
                  training.TrainingProgramMaster_iscustomerend
                );
                this.f["TrainingProgramMaster_evalfrom"].setValue(
                  formatDate(
                    training.TrainingProgramMaster_evalfrom,
                    "yyyy-MM-dd",
                    "en"
                  )
                );
                this.f["TrainingProgramMaster_evalto"].setValue(
                  formatDate(
                    training.TrainingProgramMaster_evalto,
                    "yyyy-MM-dd",
                    "en"
                  )
                );
                this.getFiles(trainingProgramUploadFolder, this.editingPKCode);

                this.displayBasic = true;
                this.newItem = false;
                this.submitted = false;
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
        detail: "Sorry!! You dont have access to edit",
      });
    }
  }
  getFiles(trainingProgramUploadFolder, pkcode) {
    this.commonService
      .getListFiles(trainingProgramUploadFolder, pkcode)
      .subscribe((data) => {
        this.uploadedFiles = [];
        this.uploadedFiles = data;
      });
  }
  deleteFile(fileName) {
    this.commonService
      .deleteFile(fileName, trainingProgramUploadFolder, this.editingPKCode)
      .subscribe((data) => {
        this.messageService.add({
          key: "t2",
          severity: "success",
          summary: "Success",
          detail: "File Deleted",
        });
        this.getFiles(trainingProgramUploadFolder, this.editingPKCode);
      });
  }
  downloadFile(fileName) {
    this.commonService
      .downloadFile(fileName, trainingProgramUploadFolder, this.editingPKCode)
      .subscribe((data) => {
        this.messageService.add({
          key: "t2",
          severity: "success",
          summary: "Success",
          detail: "File Downloaded",
        });
      });
  }
}
