import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Process } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-process-master",
  templateUrl: "./process-master.component.html",
  styleUrls: ["./process-master.component.css"],
})
export class ProcessMasterComponent implements OnInit {
  public processMaster: any[] = [];
  public processMasterForm: FormGroup;

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;
  public duplicateProcessNameError: boolean = false;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public loading: boolean = false;
  public submitted: boolean = false;
  public newItem: boolean = false;
  public displayBasic: Boolean = false;
  public editingPKCode: number;

  public processApplicableToDropdown: SelectItem[] = [];

  public process: string;
  public comp_id: string;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commonService
      .checkRight(UM_CODE, Process, "checkRight")
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
      this.processApplicableToDropdown = [
        {
          label: "Staff",
          value: 1,
        },
        {
          label: "Workers",
          value: 2,
        },
        {
          label: "Management",
          value: 3,
        },
      ];
      this.getProcessMaster();
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.processMasterForm = this.fb.group({
        process_id: [""],
        process_CM_COMP_ID: [this.comp_id],
        process_name: ["", Validators.required],
        process_applicable_to: ["", Validators.required],
      });
    }
  }

  get f() {
    return this.processMasterForm.controls;
  }

  getProcessMaster() {
    this.loading = true;
    this.processMaster = [];
    this.commonService
      .getTableResponse("*", "process_master", "es_delete=0")
      .subscribe((data) => {
        data.map((process) => {
          let process_applicable_to = "";
          if (process.cateogry_applicable_to == 1) {
            process_applicable_to = "Staff";
          } else if (process.process_applicable_to == 2) {
            process_applicable_to = "Workers";
          } else {
            process_applicable_to = "Management";
          }
          this.processMaster.push({
            process_id: process.process_id,
            process_CM_COMP_ID: process.process_CM_COMP_ID,
            process_name: process.process_name,
            process_applicable_to: process_applicable_to,
          });
        });

        this.loading = false;
      });
  }
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.newItem = true;
      this.submitted = false;
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to add",
      });
    }
  }
  delete(code) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "process_master",
          "es_modify",
          "process_id",
          code,
          0,
          "check"
        )
        .subscribe((data) => {
          console.log(data);
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
                    "process_id",
                    "1",
                    "es_delete",
                    "process_master"
                  )
                  .subscribe(
                    (data) => {
                      this.getProcessMaster();
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
  cancel() {
    this.cancelLoading = true;

    this.commonService
      .setResetModify(
        "process_master",
        "es_modify",
        "process_id",
        this.editingPKCode,
        0,
        "setLock"
      )
      .subscribe(
        (data) => {
          this.newItem = false;
          this.displayBasic = false;
          this.submitted = false;
          this.processMasterForm.reset();
          this.cancelLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.cancelLoading = false;
        }
      );
  }
  save() {
    this.submitted = true;
    this.duplicateProcessNameError = false;

    if (this.f["process_name"].value != "") {
      if (this.newItem) {
        var arr = this.processMaster.filter((master) => {
          if (
            master.process_name.toLowerCase() ==
            this.f["process_name"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateProcessNameError = true;
          return;
        } else {
          this.duplicateProcessNameError = false;
        }
      } else {
        var arr = this.processMaster.filter((master) => {
          if (
            master.process_name.toLowerCase() ==
              this.f["process_name"].value.toLowerCase() &&
            master.process_id != this.f["process_id"].value
          ) {
            return master;
          }
        });
        console.log(arr);
        if (arr.length > 0) {
          this.duplicateProcessNameError = true;
          return;
        } else {
          this.duplicateProcessNameError = false;
        }
      }
    }

    if (this.processMasterForm.valid) {
      this.loading = true;
      this.saveLoading = true;

      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_process_master",
              this.processMasterForm.value,
              this.process
            )
            .subscribe(
              (data) => {
                this.displayBasic = false;
                this.saveLoading = false;
                this.processMasterForm.reset();
                this.getProcessMaster();
              },
              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
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
  edit(process) {
    this.editingPKCode = process.process_id;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "process_master",
          "es_modify",
          "process_id",
          this.editingPKCode,
          0,
          "check"
        )
        .subscribe((data) => {
          console.log(data);
          if (data == 0) {
            this.commonService
              .setResetModify(
                "process_master",
                "es_modify",
                "process_id",
                this.editingPKCode,
                1,
                "setLock"
              )
              .subscribe((data) => {
                this.f["process_id"].setValue(process.process_id);
                this.f["process_CM_COMP_ID"].setValue(
                  process.process_CM_COMP_ID
                );
                this.f["process_name"].setValue(process.process_name);

                if (process.process_applicable_to == "Staff") {
                  this.f["process_applicable_to"].setValue(1);
                } else if (process.process_applicable_to == "Workers") {
                  this.f["process_applicable_to"].setValue(2);
                } else {
                  this.f["process_applicable_to"].setValue(3);
                }

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
}
