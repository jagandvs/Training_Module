import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Category, Training_Need } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { AdministratorService } from "../../administrator/administrator.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-category-master",
  templateUrl: "./category-master.component.html",
  styleUrls: ["./category-master.component.css"],
})
export class CategoryMasterComponent implements OnInit {
  public categoryMaster: any[];
  public categoryMasterForm: FormGroup;

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public loading: boolean = false;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public submitted: boolean = false;
  public newItem: boolean = false;
  public displayBasic: Boolean = false;

  public categoryApplicableToDropdown: SelectItem[] = [];
  public categoryTypeDropdown: SelectItem[] = [];

  public process: string;
  public comp_id: string;
  public editPKCode: number;

  public duplicateCategoryNameError: boolean = false;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.commonService
      .checkRight(UM_CODE, Category, "checkRight")
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
      this.categoryTypeDropdown = [
        {
          label: "Technical",
          value: "true",
        },
        {
          label: "Commercial",
          value: "false",
        },
      ];
      this.categoryApplicableToDropdown = [
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
      this.getCategoryMaster();
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.categoryMasterForm = this.fb.group({
        category_id: [""],
        category_id_CM_COMP_ID: [this.comp_id],
        category_name: ["", Validators.required],
        category_type: ["", Validators.required],
        cateogry_applicable_to: ["", Validators.required],
        ES_DELETE: [0],
        ES_MODIFY: [0],
      });
    }
  }
  get f() {
    return this.categoryMasterForm.controls;
  }

  getCategoryMaster() {
    this.loading = true;
    this.categoryMaster = [];
    this.commonService
      .getTableResponse("*", "CATEGORY_MASTER", "es_delete=0")
      .subscribe((data) => {
        data.map((category) => {
          let cateogry_applicable_to = "";
          if (category.cateogry_applicable_to == 1) {
            cateogry_applicable_to = "Staff";
          } else if (category.cateogry_applicable_to == 2) {
            cateogry_applicable_to = "Workers";
          } else {
            cateogry_applicable_to = "Management";
          }
          this.categoryMaster.push({
            category_id: category.category_id,
            category_id_CM_COMP_ID: category.category_id_CM_COMP_ID,
            category_name: category.category_name,
            category_type: category.category_type ? "Technical" : "Commercial",
            cateogry_applicable_to: cateogry_applicable_to,
          });
        });
        this.loading = false;
      });
  }
  save() {
    this.submitted = true;

    this.duplicateCategoryNameError = false;
    if (this.f["category_name"].value != "") {
      if (this.newItem) {
        var arr = this.categoryMaster.filter((master) => {
          if (
            master.category_name.toLowerCase() ==
            this.f["category_name"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateCategoryNameError = true;
          return;
        } else {
          this.duplicateCategoryNameError = false;
        }
      } else {
        console.log(this.f["category_id"].value);
        var arr = this.categoryMaster.filter((master) => {
          if (
            master.category_name.toLowerCase() ==
              this.f["category_name"].value.toLowerCase() &&
            master.category_id != this.f["category_id"].value
          ) {
            return master;
          }
        });
        console.log(arr);
        if (arr.length > 0) {
          this.duplicateCategoryNameError = true;
          return;
        } else {
          this.duplicateCategoryNameError = false;
        }
      }
    }

    if (this.categoryMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.saveLoading = true;
          this.loading = true;

          this.service
            .CRUDMasters(
              "UPSERT_category_master",
              this.categoryMasterForm.value,
              this.process
            )
            .subscribe(
              (data) => {
                this.displayBasic = false;
                this.getCategoryMaster();
                this.saveLoading = false;
                this.reset();
              },
              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
        },
        reject: () => {
          this.saveLoading = false;
          this.loading = false;
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
  reset() {
    this.duplicateCategoryNameError = false;
    this.submitted = false;
    this.categoryMasterForm.reset();
  }
  edit(category) {
    this.editPKCode = category.category_id;
    if (this.updateAccess) {
      console.log(category);
      this.commonService
        .setResetModify(
          "CATEGORY_MASTER",
          "ES_MODIFY",
          "category_id",
          this.editPKCode,
          0,
          "check"
        )
        .subscribe((data) => {
          console.log(data);
          if (data == 0) {
            this.commonService
              .setResetModify(
                "CATEGORY_MASTER",
                "ES_MODIFY",
                "category_id",
                this.editPKCode,
                1,
                "setLock"
              )
              .subscribe((data) => {
                this.f["category_id"].setValue(category.category_id);
                this.f["category_id_CM_COMP_ID"].setValue(
                  category.category_id_CM_COMP_ID
                );
                this.f["category_name"].setValue(category.category_name);
                category.category_type == "Technical"
                  ? this.f["category_type"].setValue("true")
                  : this.f["category_type"].setValue("false");

                if (category.cateogry_applicable_to === "Staff") {
                  this.f["cateogry_applicable_to"].setValue(1);
                } else if (category.cateogry_applicable_to === "Workers") {
                  this.f["cateogry_applicable_to"].setValue(2);
                } else {
                  this.f["cateogry_applicable_to"].setValue(3);
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
  cancel() {
    this.cancelLoading = true;
    this.commonService
      .setResetModify(
        "CATEGORY_MASTER",
        "ES_MODIFY",
        "category_id",
        this.editPKCode,
        0,
        "setLock"
      )
      .subscribe(
        (data) => {
          this.newItem = false;
          this.displayBasic = false;
          this.submitted = false;
          this.categoryMasterForm.reset();
          this.cancelLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.cancelLoading = false;
        }
      );
  }
  addCategory() {
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

  deleteUser(categoryCode) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "CATEGORY_MASTER",
          "ES_MODIFY",
          "category_id",
          categoryCode,
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
                    categoryCode,
                    "category_id",
                    "1",
                    "es_delete",
                    "CATEGORY_MASTER"
                  )
                  .subscribe(
                    (data) => {
                      this.getCategoryMaster();
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
}
