import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Employee } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../../transactions/transactions.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-employee-master",
  templateUrl: "./employee-master.component.html",
  styleUrls: ["./employee-master.component.css"],
})
export class EmployeeMasterComponent implements OnInit {
  public employeeMasterTable: any[] = [];
  public employeeDetailTable: any[] = [];
  public employeeDetails: any[] = [];

  public employeeMasterForm: FormGroup;
  public employeeDetailForm: FormGroup;

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

  public departmentDropdown: SelectItem[] = [];
  public processDropdown: SelectItem[] = [];
  public employeeType: SelectItem[] = [];
  public categoryToSkillDropdown: SelectItem[] = [];
  public categoryDropdown: SelectItem[] = [];
  public employeeDropdown: SelectItem[] = [];

  public DEPARTMENT_MASTER_QUERY = {
    TableNames: "department_master",
    fieldNames: "department_id,department_name",
    condition: "es_delete=0",
  };
  public PROCESS_MASTER_QUERY = {
    TableNames: "process_master",
    fieldNames: "process_id,process_name",
    condition: "es_delete=0",
  };

  public CATEGORY_TO_SKILL_QUERY = {
    TableNames: "CategoryToSkillLevel_Master",
    fieldNames:
      "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
    condition: "ES_DELETE=0",
  };

  public CATEGORY_MASTER_QUERY = {
    TableNames: "category_master",
    fieldNames: "category_id,category_name",
    condition: "ES_DELETE=0",
  };
  public EMPLOYEE_MASTER_QUERY = {
    TableNames: "EmployeeMaster",
    fieldNames: "EMP_MASTER_ID,EMP_MASTER_NAME",
    condition: "ES_DELETE=0",
  };
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commonService
      .checkRight(UM_CODE, Employee, "checkRight")
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
        .FillCombo(this.DEPARTMENT_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.departmentDropdown.push({
              label: item.department_name,
              value: item.department_id,
            });
          }
        });
      this.commonService
        .FillCombo(this.PROCESS_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.processDropdown.push({
              label: item.process_name,
              value: item.process_id,
            });
          }
        });
      this.commonService
        .FillCombo(this.EMPLOYEE_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.employeeDropdown.push({
              label: item.EMP_MASTER_NAME,
              value: item.EMP_MASTER_ID,
            });
          }
        });
      this.employeeType = [
        {
          label: "Staff",
          value: "1",
        },
        {
          label: "Workers",
          value: "0",
        },
      ];
      this.commonService
        .FillCombo(this.CATEGORY_TO_SKILL_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.categoryToSkillDropdown.push({
              label: item.CategoryToSkillLevelMaster_title,
              value: item.CategoryToSkillLevelMaster_ID,
            });
          }
        });
      this.commonService
        .FillCombo(this.CATEGORY_MASTER_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.categoryDropdown.push({
              label: item.category_name,
              value: item.category_id,
            });
          }
        });

      this.getEmployeeMasterTable();
      this.employeeMasterForm = this.fb.group({
        EMP_MASTER_ID: [0],
        EMP_MASTER_CM_COMP_ID: [this.comp_id],
        EMP_MASTER_NUMBER: ["", Validators.required],
        EMP_MASTER_NAME: ["", Validators.required],
        EMP_MASTER_DEPARTMENT_ID: ["", Validators.required],
        EMP_MASTER_REPORTING_TO: ["", Validators.required],
        EMP_MASTER_PROCESS_ID: ["", Validators.required],
        EMP_MASTER_EMP_TYPE: ["", Validators.required],
        EMP_MASTER_IS_HOD: [""],
      });
      this.employeeDetailForm = this.fb.group({
        EMP_MASTER_SKILLS_ID: [""],
        EMP_MASTER_SKILLS_CATEGORY_ID: ["", Validators.required],
        EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL: ["", Validators.required],
        EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL: ["", Validators.required],
      });
      console.log(this.employeeMasterForm.value);
    }
  }
  getEmployeeMasterTable() {
    this.employeeMasterTable = [];
    this.loading = true;
    this.service
      .UPSERT_EmployeeMaster("UPSERT_EmployeeMaster", "selectAll", 0)
      .subscribe((data) => {
        console.log(data);
        for (let employee of data) {
          this.employeeMasterTable.push({
            EMP_MASTER_NUMBER: employee.EMP_MASTER_NUMBER,
            EMP_MASTER_NAME: employee.EMP_MASTER_NAME,
            EMP_MASTER_ID: employee.EMP_MASTER_ID,
            EMP_MASTER_IS_HOD: employee.EMP_MASTER_IS_HOD,
          });
        }
        this.loading = false;
      });
  }
  get f() {
    return this.employeeMasterForm.controls;
  }

  get g() {
    return this.employeeDetailForm.controls;
  }

  getDepartmentMaster(code) {
    console.log(code);
    var label;
    this.departmentDropdown.map((data) => {
      console.log(data);
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  getCategory(code) {
    console.log(code);
    var label;
    this.categoryDropdown.map((data) => {
      console.log(data);
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  getSkill(code) {
    console.log(code);
    var label;
    this.categoryToSkillDropdown.map((data) => {
      console.log(data);
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.employeeDetailTable = [];
      this.employeeDetails = [];
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
    if (!(this.employeeMasterForm.valid && this.employeeDetailForm.valid)) {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill All required fields",
      });
      return;
    }
    if (this.editInsert) {
      this.employeeDetails.splice(
        this.editIndex,
        1,
        this.employeeDetailForm.value
      );
      this.employeeDetailTable.splice(this.editIndex, 1, {
        CATEGORY: this.getCategory(
          this.g["EMP_MASTER_SKILLS_CATEGORY_ID"].value
        ),
        PRESENT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL"].value
        ),
        NEXT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL"].value
        ),
      });
    } else {
      this.employeeDetails.push(this.employeeDetailForm.value);
      this.employeeDetailTable.push({
        CATEGORY: this.getCategory(
          this.g["EMP_MASTER_SKILLS_CATEGORY_ID"].value
        ),
        PRESENT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL"].value
        ),
        NEXT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL"].value
        ),
      });
    }
    this.editInsert = false;
    this.employeeDetailForm.reset();
  }

  save() {
    this.submitted = true;
    if (this.employeeMasterForm.valid) {
      this.submitted = false;
      this.newItem ? (this.process = "Insert") : (this.process = "Update");

      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .INSERT_UPSERT_EmployeeMaster(
              this.employeeMasterForm.value,
              this.employeeDetails,
              this.process
            )
            .subscribe(
              (data) => {
                this.editInsert = false;
                this.getEmployeeMasterTable();
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
        "EmployeeMaster",
        "ES_MODIFY",
        "EMP_MASTER_ID",

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
    this.employeeDetailForm.reset();
    this.employeeMasterForm.reset();
    this.employeeDetailTable = [];
    this.employeeDetails = [];
  }
  edit(employeeId) {
    console.log(employeeId);
    this.newItem = false;
    this.editingPKCODE = employeeId;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "EmployeeMaster",
          "ES_MODIFY",
          "EMP_MASTER_ID",
          employeeId,
          0,
          "check"
        )
        .subscribe((data) => {
          console.log(data);
          if (data == 0) {
            this.commonService
              .setResetModify(
                "EmployeeMaster",
                "ES_MODIFY",
                "EMP_MASTER_ID",
                employeeId,
                1,
                "setLock"
              )
              .subscribe(
                (data) => {
                  console.log(employeeId);
                  this.service
                    .UPSERT_EmployeeMaster(
                      "UPSERT_EmployeeMaster",
                      "SelectMaster",
                      employeeId
                    )
                    .subscribe(
                      (data) => {
                        this.f["EMP_MASTER_ID"].setValue(data[0].EMP_MASTER_ID);
                        this.f["EMP_MASTER_CM_COMP_ID"].setValue(
                          data[0].EMP_MASTER_CM_COMP_ID
                        );
                        this.f["EMP_MASTER_NUMBER"].setValue(
                          data[0].EMP_MASTER_NUMBER
                        );
                        this.f["EMP_MASTER_NAME"].setValue(
                          data[0].EMP_MASTER_NAME
                        );
                        this.f["EMP_MASTER_DEPARTMENT_ID"].setValue(
                          data[0].EMP_MASTER_DEPARTMENT_ID
                        );
                        this.f["EMP_MASTER_REPORTING_TO"].setValue(
                          data[0].EMP_MASTER_REPORTING_TO
                        );
                        this.f["EMP_MASTER_PROCESS_ID"].setValue(
                          data[0].EMP_MASTER_PROCESS_ID
                        );
                        this.f["EMP_MASTER_EMP_TYPE"].setValue(
                          data[0].EMP_MASTER_EMP_TYPE
                        );
                        this.f["EMP_MASTER_IS_HOD"].setValue(
                          data[0].EMP_MASTER_IS_HOD
                        );
                        this.service
                          .UPSERT_EmployeeMaster(
                            "UPSERT_EmployeeMaster",
                            "SelectDetail",
                            employeeId
                          )
                          .subscribe(
                            (data) => {
                              this.displayBasic = true;
                              this.employeeDetails = data;
                              for (let item of data) {
                                console.log(data);
                                this.employeeDetailTable.push({
                                  CATEGORY: this.getCategory(
                                    item.EMP_MASTER_SKILLS_CATEGORY_ID
                                  ),
                                  PRESENT_SKILL: this.getSkill(
                                    item.EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL
                                  ),
                                  NEXT_SKILL: this.getSkill(
                                    item.EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL
                                  ),
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
              summary: "Warming",
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
  deleteEmployeeDetail(index) {
    this.employeeDetailTable.splice(index, 1);
    this.employeeDetails.splice(index, 1);
  }

  delete(deleteItem) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "EmployeeMaster",
          "ES_MODIFY",
          "EMP_MASTER_ID",
          deleteItem,
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
                    deleteItem,
                    "EMP_MASTER_ID",
                    "1",
                    "ES_DELETE",
                    "EmployeeMaster"
                  )
                  .subscribe(
                    (data) => {
                      this.getEmployeeMasterTable();
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
  editEmployeeDetail(index) {
    this.editInsert = true;
    this.editIndex = index;
    this.g["EMP_MASTER_SKILLS_CATEGORY_ID"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_CATEGORY_ID
    );
    this.g["EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL
    );
    this.g["EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL
    );
  }
}
