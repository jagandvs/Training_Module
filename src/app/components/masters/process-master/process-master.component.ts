import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
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

  public loading: boolean = false;
  public submitted: boolean = false;
  public newItem: boolean = false;
  public displayBasic: Boolean = false;

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

  get f() {
    return this.processMasterForm.controls;
  }

  getProcessMaster() {
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

        console.log(data);
      });
  }
  add() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
  }
  delete(code) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete?",
      header: "Delete Confirmation",
      icon: "fas fa-trash",
      key: "c1",
      accept: () => {
        this.commonService
          .deleteRow(code, "process_id", "1", "es_delete", "process_master")
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
  }
  cancel() {
    this.commonService
      .setResetModify(
        "process_master",
        "es_modify",
        "process_id",
        this.f["process_id"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.processMasterForm.reset();
      });
  }
  save() {
    if (this.processMasterForm.valid) {
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
            .subscribe((data) => {
              this.displayBasic = false;
              this.getProcessMaster();
            });
        },
      });
    } else {
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
    this.commonService
      .setResetModify(
        "process_master",
        "es_modify",
        "process_id",
        process.process_id,
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
              process.process_id,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["process_id"].setValue(process.process_id);
              this.f["process_CM_COMP_ID"].setValue(process.process_CM_COMP_ID);
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
  }
}
