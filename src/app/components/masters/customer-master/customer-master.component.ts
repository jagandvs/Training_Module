import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Customer } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-customer-master",
  templateUrl: "./customer-master.component.html",
  styleUrls: ["./customer-master.component.css"],
})
export class CustomerMasterComponent implements OnInit {
  public customerMaster: any[] = [];
  public customerMasterForm: FormGroup;

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
  public duplicateCustomerNameError: boolean = false;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public categoryTypeDropdown: SelectItem[] = [];
  public process: string;
  public comp_id: string;
  public editPKCode: number;

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
    this.commonService
      .checkRight(UM_CODE, Customer, "checkRight")
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
          value: true,
        },
        {
          label: "Commercial",
          value: false,
        },
      ];
      this.getCustomerMaster();
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.customerMasterForm = this.fb.group({
        customer_id: [""],
        customer_id_CM_COMP_ID: [this.comp_id],
        customer_name: ["", Validators.required],
        customer_category: ["", Validators.required],
        customer_titleofprogram: ["", Validators.required],
        customer_expectedskills: ["", Validators.required],
      });
    }
  }
  get f() {
    return this.customerMasterForm.controls;
  }

  getCustomerMaster() {
    this.loading = true;
    this.customerMaster = [];
    this.commonService
      .getTableResponse("*", "customer_master", "es_delete=0")
      .subscribe((data) => {
        data.map((customer) => {
          this.customerMaster.push({
            customer_id: customer.customer_id,
            customer_id_CM_COMP_ID: customer.customer_id_CM_COMP_ID,
            customer_name: customer.customer_name,
            customer_category: customer.customer_category
              ? "Technical"
              : "Commercial",
            customer_titleofprogram: customer.customer_titleofprogram,
            customer_expectedskills: customer.customer_expectedskills,
          });
        });

        this.loading = false;
        this.totalRecords = this.customerMaster.length;
      });
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
      this.commonService
        .setResetModify(
          "customer_master",
          "es_modify",
          "customer_id",
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
                    "customer_id",
                    "1",
                    "es_delete",
                    "customer_master"
                  )
                  .subscribe(
                    (data) => {
                      this.getCustomerMaster();
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
              detail: "Sorry!! You dont have access to edit",
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
  edit(customer) {
    this.editPKCode = customer.customer_id;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "customer_master",
          "es_modify",
          "customer_id",
          this.editPKCode,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.commonService
              .setResetModify(
                "customer_master",
                "es_modify",
                "customer_id",
                this.editPKCode,
                1,
                "setLock"
              )
              .subscribe((data) => {
                this.f["customer_id"].setValue(customer.customer_id);
                this.f["customer_id_CM_COMP_ID"].setValue(
                  customer.customer_id_CM_COMP_ID
                );
                this.f["customer_name"].setValue(customer.customer_name);
                this.f["customer_titleofprogram"].setValue(
                  customer.customer_titleofprogram
                );
                this.f["customer_expectedskills"].setValue(
                  customer.customer_expectedskills
                );
                customer.customer_category === "Technical"
                  ? this.f["customer_category"].setValue(true)
                  : this.f["customer_category"].setValue(false);

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
          "customer_master",
          "es_modify",
          "customer_id",
          this.f["customer_id"].value,
          0,
          "setLock"
        )
        .subscribe(
          (data) => {
            this.newItem = false;
            this.displayBasic = false;
            this.submitted = false;
            this.reset();
            this.cancelLoading = false;
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.cancelLoading = false;
          }
        );
    }
  }
  reset() {
    this.duplicateCustomerNameError = false;
    this.submitted = false;
    this.customerMasterForm.reset();
    this.newItem
      ? this.f["customer_id"].setValue("")
      : this.f["customer_id"].setValue(this.editPKCode);
    this.f["customer_id_CM_COMP_ID"].setValue(this.comp_id);
  }
  save() {
    this.submitted = true;
    this.duplicateCustomerNameError = false;

    if (this.f["customer_name"].value != "") {
      if (this.newItem) {
        var arr = this.customerMaster.filter((master) => {
          if (
            master.customer_name.toLowerCase() ==
            this.f["customer_name"].value.toLowerCase()
          ) {
            return master;
          }
        });
        if (arr.length > 0) {
          this.duplicateCustomerNameError = true;
          return;
        } else {
          this.duplicateCustomerNameError = false;
        }
      } else {
        var arr = this.customerMaster.filter((master) => {
          if (
            master.customer_name.toLowerCase() ==
              this.f["customer_name"].value.toLowerCase() &&
            master.customer_id != this.f["customer_id"].value
          ) {
            return master;
          }
        });

        if (arr.length > 0) {
          this.duplicateCustomerNameError = true;
          return;
        } else {
          this.duplicateCustomerNameError = false;
        }
      }
    }
    if (this.customerMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.saveLoading = true;

          this.service
            .CRUDMasters(
              "UPSERT_customer_master",
              this.customerMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getCustomerMaster();
              this.saveLoading = false;
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
  }
}
