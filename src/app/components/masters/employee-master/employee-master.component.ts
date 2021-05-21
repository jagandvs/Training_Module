import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Employee } from "src/app/_helper/SM_CODE";
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

  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public departmentDropdown: SelectItem[] = [];
  public processDropdown: SelectItem[] = [];
  public employeeTypeDropdown: SelectItem[] = [];
  public categoryToSkillDropdown: SelectItem[] = [];
  public categoryDropdown: SelectItem[] = [];
  public employeeReportingToDropdown: SelectItem[] = [];
  public employeeDropdown: SelectItem[] = [];
  public employees: any[] = [];

  public duplicateError: boolean = false;
  public duplicateNameError: boolean = false;
  public totalRecords = 0;
  public userId: string = "";
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

  public CATEGORY_MASTER_QUERY = {
    TableNames: "category_master",
    fieldNames: "category_id,category_name",
    condition: "ES_DELETE=0",
  };
  public EMPLOYEE_MASTER_QUERY = {
    TableNames: "EmployeeMaster",
    fieldNames: "EMP_MASTER_ID,EMP_MASTER_NAME,EMP_MASTER_NUMBER",
    condition: "ES_DELETE=0",
  };
  public OUTSOURCE_EMP_QUERY = {
    TableNames: "OUTSOURCE_EMP",
    fieldNames: "EMPNO,EMPFNAME",
    condition: "EMPNO IS NOT NULL",
  };
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
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

      // this.commonService
      //   .FillCombo(this.OUTSOURCE_EMP_QUERY)
      //   .subscribe((data) => {
      //     console.log(data);
      //     for (let item of data) {
      //       this.employeeDropdown.push({
      //         label: item.EMPFNAME,
      //         value: item.EMPNO,
      //       });
      //     }
      //   });

      this.getEmployeeMasterTable();
      this.employeeMasterForm = this.fb.group({
        EMP_MASTER_ID: [0],
        EMP_MASTER_CM_COMP_ID: [this.comp_id],
        EMP_MASTER_TYPE: [""],
        EMP_MASTER_OUTSOURCE: [""],
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
        EMP_MASTER_SKILLS_CATEGORY_ID: [0],
        EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL: ["", Validators.required],
        EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL: ["", Validators.required],
      });
      this.employeeTypeDropdown = [
        {
          label: "Staff",
          value: 1,
        },
        {
          label: "Workers",
          value: 2,
        },
      ];
    }
  }
  getFillCombo() {
    this.commonService
      .FillCombo(this.DEPARTMENT_MASTER_QUERY)
      .subscribe((data) => {
        this.departmentDropdown = [];
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
        this.processDropdown = [];
        for (let item of data) {
          this.processDropdown.push({
            label: item.process_name,
            value: item.process_id,
          });
        }
      });
    // this.commonService
    //   .FillCombo(this.EMPLOYEE_MASTER_QUERY)
    //   .subscribe((data) => {
    //     this.employeeReportingToDropdown = [];
    //     for (let item of data) {
    //       this.employeeDropdown;
    //       this.employeeReportingToDropdown.push({
    //         label: `${item.EMP_MASTER_NAME} - ${item.EMP_MASTER_NUMBER}`,
    //         value: item.EMP_MASTER_ID,
    //       });
    //     }
    //     console.log(this.employeeReportingToDropdown);
    //   });

    this.commonService.employeenames().subscribe((data) => {
      console.log(data);
      this.employeeReportingToDropdown = [];
      for (let item of data) {
        this.employeeReportingToDropdown.push({
          label: item.empname,
          value: item.empcode,
        });
      }
    });
    // this.commonService
    //   .FillCombo(this.CATEGORY_MASTER_QUERY)
    //   .subscribe((data) => {

    //     for (let item of data) {
    //       this.categoryDropdown.push({
    //         label: item.category_name,
    //         value: item.category_id,
    //       });
    //     }
    //   });
  }
  onSelecteEmployeeType() {
    var EMPLOYEE_QUERY = {
      TableNames: "OUTSOURCE_EMP",
      fieldNames: "*",
      condition: `emptype=${this.f["EMP_MASTER_TYPE"].value}`,
    };

    var CATEGORY_TO_SKILL_QUERY = {
      TableNames: "CategoryToSkillLevel_Master",
      fieldNames:
        "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
      condition: `ES_DELETE=0 AND CategoryToSkillLevelMaster_categorymaster_id=${this.f["EMP_MASTER_TYPE"].value}`,
    };

    this.commonService.FillCombo(CATEGORY_TO_SKILL_QUERY).subscribe((data) => {
      this.categoryToSkillDropdown = [];
      for (let item of data) {
        this.categoryToSkillDropdown.push({
          label: item.CategoryToSkillLevelMaster_title,
          value: item.CategoryToSkillLevelMaster_ID,
        });
      }
    });

    this.f["EMP_MASTER_TYPE"].value == 1
      ? this.f["EMP_MASTER_EMP_TYPE"].setValue(true)
      : this.f["EMP_MASTER_EMP_TYPE"].setValue(false);
    this.commonService.FillCombo(EMPLOYEE_QUERY).subscribe((data) => {
      console.log(data);
      this.employeeDropdown = [];
      this.employees = [];
      this.f["EMP_MASTER_NUMBER"].setValue("");
      this.f["EMP_MASTER_NAME"].setValue("");
      this.f["EMP_MASTER_OUTSOURCE"].setValue("");
      this.f["EMP_MASTER_DEPARTMENT_ID"].setValue("");

      this.employees = data;
      console.log(data);

      for (let item of data) {
        this.employeeDropdown.push({
          label: `${item.EMPFNAME} ${item.EMPLNAME} - ${item.EMPNO}`,
          value: item.EMPNO,
        });
      }
    });
  }
  selectedEmployee() {
    var empNumber = "";
    var empName = "";
    var empDept = "";
    var duplicate = false;
    this.userId = "";
    this.f["EMP_MASTER_NUMBER"].setValue("");
    this.f["EMP_MASTER_NAME"].setValue("");

    this.employees.map((data) => {
      if (data.EMPNO == this.f["EMP_MASTER_OUTSOURCE"].value) {
        empNumber = data.EMPNO;
        // empName = data.label + data.label.replace(/\s/g, "");
        this.userId = data.EMPNO + data.EMPFNAME.replace(/\s/g, "");
        empDept = data.EMPDEPARTMENTID;
        empName = data.EMPFNAME;
      }
    });
    this.employeeMasterTable.map((data) => {
      if (data.EMP_MASTER_NUMBER == empNumber) {
        duplicate = true;
        this.messageService.add({
          key: "t2",
          severity: "error",
          summary: "Error",
          detail: "Employee Already exists",
        });
      }
    });
    if (!duplicate) {
      this.f["EMP_MASTER_NUMBER"].setValue(empNumber);
      this.f["EMP_MASTER_NAME"].setValue(empName);
      this.f["EMP_MASTER_DEPARTMENT_ID"].setValue(empDept);
    }
  }
  getEmployeeMasterTable() {
    this.totalRecords = 0;
    this.loading = true;
    this.service
      .UPSERT_EmployeeMaster("UPSERT_EmployeeMaster", "selectAll", 0)
      .subscribe((data) => {
        this.employeeMasterTable = [];

        for (let employee of data) {
          this.employeeMasterTable.push({
            EMP_MASTER_NUMBER: employee.EMP_MASTER_NUMBER,
            EMP_MASTER_NAME: employee.EMP_MASTER_NAME,
            EMP_MASTER_ID: employee.EMP_MASTER_ID,
            EMP_MASTER_IS_HOD: employee.EMP_MASTER_IS_HOD,
          });
        }
        this.loading = false;

        this.totalRecords = this.employeeMasterTable.length;
        console.log(this.totalRecords);
      });
  }
  get f() {
    return this.employeeMasterForm.controls;
  }

  get g() {
    return this.employeeDetailForm.controls;
  }

  getDepartmentMaster(code) {
    var label;
    this.departmentDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  getCategory(code) {
    var label;
    this.categoryDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  getSkill(code) {
    var label;
    this.categoryToSkillDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }

  add() {
    if (this.addAccess) {
      this.getFillCombo();
      this.displayBasic = true;
      this.employeeDetailTable = [];
      this.employeeDetails = [];
      this.newItem = true;
      this.reset();
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
    this.submitted = false;
    if (!(this.employeeMasterForm.valid && this.employeeDetailForm.valid)) {
      this.submitted = true;

      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill All required fields",
      });
      return;
    }
    if (this.editInsert) {
      console.log(this.employeeDetailForm.value);

      this.employeeDetails.splice(
        this.editIndex,
        1,
        this.employeeDetailForm.value
      );
      console.log(this.employeeDetails);
      this.employeeDetailTable.splice(this.editIndex, 1, {
        CATEGORY: "0",
        PRESENT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL"].value
        ),
        NEXT_SKILL: this.getSkill(
          this.g["EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL"].value
        ),
      });
      console.log("edit insert");
      console.log();
    } else {
      this.employeeDetails.push(this.employeeDetailForm.value);
      this.employeeDetailTable.push({
        CATEGORY: "0",
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
  checkDuplicateEmployeeNumber() {
    this.duplicateError = false;

    if (this.f["EMP_MASTER_NUMBER"].value != "") {
      if (this.newItem) {
        var arr = this.employeeMasterTable.filter((master) => {
          if (master.EMP_MASTER_NUMBER == this.f["EMP_MASTER_NUMBER"].value) {
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
        var arr = this.employeeMasterTable.filter((master) => {
          if (
            master.EMP_MASTER_NUMBER == this.f["EMP_MASTER_NUMBER"].value &&
            master.EMP_MASTER_ID != this.f["EMP_MASTER_ID"].value
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
  }
  checkDuplicateEmployeeName() {
    this.duplicateNameError = false;

    if (this.f["EMP_MASTER_NAME"].value != "") {
      if (this.newItem) {
        var arr = this.employeeMasterTable.filter((master) => {
          if (
            master.EMP_MASTER_NAME.toLowerCase() ==
            this.f["EMP_MASTER_NAME"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateNameError = true;
          return;
        } else {
          this.duplicateNameError = false;
        }
      } else {
        var arr = this.employeeMasterTable.filter((master) => {
          if (
            master.EMP_MASTER_NAME.toLowerCase() ==
              this.f["EMP_MASTER_NAME"].value.toLowerCase() &&
            master.EMP_MASTER_ID != this.f["EMP_MASTER_ID"].value
          ) {
            return master;
          }
        });

        if (arr.length > 0) {
          this.duplicateNameError = true;
          return;
        } else {
          this.duplicateNameError = false;
        }
      }
    }
  }
  save() {
    this.submitted = true;
    if (this.duplicateError || this.duplicateNameError) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Duplicates not allowed",
      });
    }

    if (
      this.employeeMasterForm.valid &&
      !this.duplicateNameError &&
      !this.duplicateError
    ) {
      this.submitted = false;
      this.newItem ? (this.process = "Insert") : (this.process = "Update");

      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.saveLoading = true;
          console.log(this.employeeDetailTable);
          console.log(this.employeeDetails);
          this.service
            .INSERT_UPSERT_EmployeeMaster(
              this.employeeMasterForm.value,

              this.employeeDetails,

              this.process,
              this.userId
            )
            .subscribe(
              (data) => {
                this.editInsert = false;
                this.getEmployeeMasterTable();
                this.displayBasic = false;

                this.messageService.add({
                  key: "t1",
                  severity: "success",
                  summary: "Success",
                  detail: this.process.toUpperCase() + " Successfully",
                });
                this.cancel();
                this.saveLoading = false;
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
      this.saveLoading = false;

      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill all required fields",
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
          this.reset();
        });
    }
  }
  reset() {
    this.employeeDetailForm.reset();
    this.employeeMasterForm.reset();
    this.newItem
      ? this.f["EMP_MASTER_ID"].setValue(0)
      : this.f["EMP_MASTER_ID"].setValue(this.editingPKCODE);

    this.f["EMP_MASTER_CM_COMP_ID"].setValue(this.comp_id);
    this.employeeDetailTable = [];
    this.employeeDetails = [];
  }
  edit(employeeId) {
    this.newItem = false;
    this.editingPKCODE = employeeId;
    this.getFillCombo();
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
                  this.service
                    .UPSERT_EmployeeMaster(
                      "UPSERT_EmployeeMaster",
                      "SelectMaster",
                      employeeId
                    )
                    .subscribe(
                      (data) => {
                        this.f["EMP_MASTER_ID"].setValue(data[0].EMP_MASTER_ID);
                        this.f["EMP_MASTER_OUTSOURCE"].setValue("");
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
                        var type;
                        data[0].EMP_MASTER_EMP_TYPE ? (type = 1) : (type = 2);
                        var CATEGORY_TO_SKILL_QUERY = {
                          TableNames: "CategoryToSkillLevel_Master",
                          fieldNames:
                            "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
                          condition: `ES_DELETE=0 AND CategoryToSkillLevelMaster_categorymaster_id=${type}`,
                        };

                        this.commonService
                          .FillCombo(CATEGORY_TO_SKILL_QUERY)
                          .subscribe((data) => {
                            this.categoryToSkillDropdown = [];
                            for (let item of data) {
                              this.categoryToSkillDropdown.push({
                                label: item.CategoryToSkillLevelMaster_title,
                                value: item.CategoryToSkillLevelMaster_ID,
                              });
                            }

                            this.service
                              .UPSERT_EmployeeMaster(
                                "UPSERT_EmployeeMaster",
                                "SelectDetail",
                                employeeId
                              )
                              .subscribe(
                                (data) => {
                                  console.log(data);
                                  this.displayBasic = true;
                                  this.employeeDetails = data;
                                  for (let item of data) {
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
                          });
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
      var DEL_CHECK_EVAL_QUERY = {
        TableNames: "EVAL",
        fieldNames: "*",
        condition: `EVAL_EMP_ID=${deleteItem}`,
      };
      var DEL_CHECK_TRAININGPROGRAM_MASTER_QUERY = {
        TableNames: "TRAININGPROGRAM_MASTER, TRAININGPROGRAM_DETAIL",
        fieldNames: "*",
        condition: `TRAININGPROGRAM_ID=TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID and TRAININGPROGRAMDETAIL_EMP_ID=${deleteItem} and ES_DELETE=0`,
      };

      this.commonService.FillCombo(DEL_CHECK_EVAL_QUERY).subscribe((data) => {
        if (data.length == 0) {
          this.commonService
            .FillCombo(DEL_CHECK_TRAININGPROGRAM_MASTER_QUERY)
            .subscribe((data) => {
              if (data.length == 0) {
                this._delete(deleteItem);
              } else {
                this.messageService.add({
                  key: "t1",
                  severity: "info",
                  summary: "info",
                  detail: "Employee cannot be deleted",
                });
              }
            });
        } else {
          this.messageService.add({
            key: "t1",
            severity: "info",
            summary: "info",
            detail: "employee cannot be deleted",
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
  _delete(deleteItem) {
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
    this.g["EMP_MASTER_SKILLS_ID"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_ID
    );

    this.g["EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL
    );
    this.g["EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL"].setValue(
      this.employeeDetails[index].EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL
    );
  }
}
