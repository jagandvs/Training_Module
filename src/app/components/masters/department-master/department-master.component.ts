import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Department } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-department-master",
  templateUrl: "./department-master.component.html",
  styleUrls: ["./department-master.component.css"],
})
export class DepartmentMasterComponent implements OnInit {
  public departmentMaster: any[];
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
  public duplicatedepartmentNameError: boolean = false;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public editingPKCode: number;
  public process: string;
  public comp_id: string;
  public totalRecords = 0;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
    this.commonService
      .checkRight(UM_CODE, Department, "checkRight")
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
      this.getdepartmentMaster();
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.departmentMasterForm = this.fb.group({
        department_id: [""],
        department_CM_COMP_ID: [this.comp_id],
        department_name: ["", Validators.required],
      });
    }
  }
  get f() {
    return this.departmentMasterForm.controls;
  }

  getdepartmentMaster() {
    this.loading = true;
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

        this.loading = false;
        this.totalRecords = this.departmentMaster.length;
      });
  }

  checkDuplicate() {
    this.duplicatedepartmentNameError = false;

    if (this.f["department_name"].value != "") {
      if (this.newItem) {
        var arr = this.departmentMaster.filter((master) => {
          if (
            master.department_name.toLowerCase() ==
            this.f["department_name"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicatedepartmentNameError = true;
          return;
        } else {
          this.duplicatedepartmentNameError = false;
        }
      } else {
        var arr = this.departmentMaster.filter((master) => {
          if (
            master.department_name.toLowerCase() ==
              this.f["department_name"].value.toLowerCase() &&
            master.department_id != this.f["department_id"].value
          ) {
            return master;
          }
        });

        if (arr.length > 0) {
          this.duplicatedepartmentNameError = true;
          return;
        } else {
          this.duplicatedepartmentNameError = false;
        }
      }
    }
  }
  save() {
    if (this.duplicatedepartmentNameError) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Duplicate Department Name not allowed",
      });
    }
    this.submitted = true;

    if (this.departmentMasterForm.valid && !this.duplicatedepartmentNameError) {
      this.saveLoading = true;

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
              this.saveLoading = false;

              this.getdepartmentMaster();
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
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.newItem = true;
      this.submitted = false;
      this.reset();
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
      var DEL_CHECK_EMP_MASTER_QUERY = {
        TableNames: "EmployeeMaster",
        fieldNames: "*",
        condition: `EMP_MASTER_DEPARTMENT_ID=${code}`,
      };

      this.commonService
        .FillCombo(DEL_CHECK_EMP_MASTER_QUERY)
        .subscribe((data) => {
          console.log(data.length);
          if (data.length == 0) {
            this._delete(code);
          } else {
            this.messageService.add({
              key: "t1",
              severity: "info",
              summary: "info",
              detail: "Department cannot be deleted",
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
  _delete(code) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "department_master",
          "es_modify",
          "department_id",
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
  edit(department) {
    this.editingPKCode = department.department_id;
    if (this.updateAccess) {
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
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to edit",
      });
    }
  }
  cancel() {
    this.cancelLoading = true;
    if (this.newItem) {
      this.newItem = false;
      this.displayBasic = false;
      this.submitted = false;
      this.reset();
      this.cancelLoading = false;
    } else {
      this.commonService
        .setResetModify(
          "department_master",
          "es_modify",
          "department_id",
          this.editingPKCode,
          0,
          "setLock"
        )
        .subscribe((data) => {
          this.newItem = false;
          this.displayBasic = false;
          this.submitted = false;
          this.reset();
          this.cancelLoading = false;
        });
    }
  }
  reset() {
    this.departmentMasterForm.reset();
    this.duplicatedepartmentNameError = false;
    this.submitted = false;
    this.newItem
      ? this.f["department_id"].setValue("")
      : this.f["department_id"].setValue(this.editingPKCode);
    this.f["department_CM_COMP_ID"].setValue(this.comp_id);
  }
}
