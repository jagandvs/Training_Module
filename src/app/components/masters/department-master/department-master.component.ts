import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-department-master",
  templateUrl: "./department-master.component.html",
  styleUrls: ["./department-master.component.css"],
})
export class DepartmentMasterComponent implements OnInit {
  public departmentMaster: any[] = [];
  public departmentMasterForm: FormGroup;

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
    this.getdepartmentMaster();
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    this.departmentMasterForm = this.fb.group({
      department_id: [""],
      department_CM_COMP_ID: [this.comp_id],
      department_name: ["", Validators.required],
    });
  }
  get f() {
    return this.departmentMasterForm.controls;
  }

  getdepartmentMaster() {
    this.departmentMaster = [];
    this.commonService
      .getTableResponse("*", "department_master", "es_delete=0")
      .subscribe((data) => {
        data.map((department) => {
          this.departmentMaster.push({
            department_id: department.department_id,
            department_CM_COMP_ID: department.department_CM_COMP_ID,
            department_name: department.department_name,
          });
        });

        console.log(data);
      });
  }
  save() {
    if (this.departmentMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_department_master",
              this.departmentMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getdepartmentMaster();
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
          .deleteRow(
            code,
            "department_id",
            "1",
            "es_delete",
            "department_master"
          )
          .subscribe(
            (data) => {
              this.getdepartmentMaster();
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
  edit(department) {
    this.commonService
      .setResetModify(
        "department_master",
        "es_modify",
        "department_id",
        department.department_id,
        0,
        "check"
      )
      .subscribe((data) => {
        console.log(data);
        if (data == 0) {
          this.commonService
            .setResetModify(
              "department_master",
              "es_modify",
              "department_id",
              department.department_id,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["department_id"].setValue(department.department_id);
              this.f["department_CM_COMP_ID"].setValue(
                department.department_CM_COMP_ID
              );
              this.f["department_name"].setValue(department.department_name);

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
  cancel() {
    this.commonService
      .setResetModify(
        "department_master",
        "es_modify",
        "department_id",
        this.f["department_id"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.departmentMasterForm.reset();
      });
  }
}
