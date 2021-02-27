import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { AdministratorService } from "../../administrator/administrator.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-category-master",
  templateUrl: "./category-master.component.html",
  styleUrls: ["./category-master.component.css"],
})
export class CategoryMasterComponent implements OnInit {
  public categoryMaster: any[] = [];
  public categoryMasterForm: FormGroup;

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
  get f() {
    return this.categoryMasterForm.controls;
  }

  getCategoryMaster() {
    this.categoryMaster = [];
    this.commonService
      .getTableResponse("*", "CATEGORY_MASTER", "ES_DELETE=0")
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

        console.log(data);
      });
  }
  save() {
    if (this.categoryMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_category_master",
              this.categoryMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getCategoryMaster();
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
  edit(category) {
    this.commonService
      .setResetModify(
        "CATEGORY_MASTER",
        "ES_MODIFY",
        "category_id",
        category.category_id,
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
              category.category_id,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["category_id"].setValue(category.category_id);
              this.f["category_id_CM_COMP_ID"].setValue(
                category.category_id_CM_COMP_ID
              );
              this.f["category_name"].setValue(category.category_name);
              category.category_type === "Technical"
                ? this.f["category_type"].setValue(true)
                : this.f["category_type"].setValue(false);
              this.f["category_type"].setValue(category.category_type);
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
  }
  cancel() {
    this.commonService
      .setResetModify(
        "CATEGORY_MASTER",
        "ES_MODIFY",
        "category_id",
        this.f["category_id"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.categoryMasterForm.reset();
      });
  }
  addCategory() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
  }

  deleteUser(categoryCode: string) {
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
            "ES_DELETE",
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
  }
}
