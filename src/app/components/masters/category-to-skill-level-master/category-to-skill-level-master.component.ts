import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-category-to-skill-level-master",
  templateUrl: "./category-to-skill-level-master.component.html",
  styleUrls: ["./category-to-skill-level-master.component.css"],
})
export class CategoryToSkillLevelMasterComponent implements OnInit {
  public categorySkillMaster: any[] = [];
  public categorySkillMasterForm: FormGroup;
  public categoryMasterDropdown: any[] = [];

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

  public CATEGORY_MASTER_QUERY: any;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCategorySkillMaster();
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    this.CATEGORY_MASTER_QUERY = {
      TableNames: "CATEGORY_MASTER",
      fieldNames: "category_name,category_id",
      condition: "ES_DELETE=0",
    };
    this.commonService
      .FillCombo(this.CATEGORY_MASTER_QUERY)
      .subscribe((data) => {
        this.categoryMasterDropdown = data;
      });

    this.categorySkillMasterForm = this.fb.group({
      CategoryToSkillLevelMaster_ID: [""],
      CategoryToSkillLevelMaster_CM_COMP_ID: [this.comp_id],
      CategoryToSkillLevelMaster_categorymaster_id: ["", Validators.required],
      CategoryToSkillLevelMaster_title: ["", Validators.required],
      CategoryToSkillLevelMaster_passingpercentage: ["", Validators.required],
    });
  }

  get f() {
    return this.categorySkillMasterForm.controls;
  }

  getCategorySkillMaster() {
    this.categorySkillMaster = [];
    this.commonService
      .getTableResponse("*", "CategoryToSkillLevel_Master", "ES_DELETE=0")
      .subscribe((data) => {
        data.map((category) => {
          this.categorySkillMaster.push({
            CategoryToSkillLevelMaster_ID:
              category.CategoryToSkillLevelMaster_ID,
            CategoryToSkillLevelMaster_CM_COMP_ID:
              category.CategoryToSkillLevelMaster_CM_COMP_ID,
            CategoryToSkillLevelMaster_categorymaster_id:
              category.CategoryToSkillLevelMaster_categorymaster_id,
            CategoryToSkillLevelMaster_title:
              category.CategoryToSkillLevelMaster_title,
            CategoryToSkillLevelMaster_passingpercentage:
              category.CategoryToSkillLevelMaster_passingpercentage,
          });
        });

        console.log(data);
      });
  }
  addCategory() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
  }
  save() {
    console.log(this.categorySkillMasterForm.value);
    if (this.categorySkillMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_CategoryToSkillLevel_Master",
              this.categorySkillMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getCategorySkillMaster();
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
        "CategoryToSkillLevel_Master",
        "es_modify",
        "CategoryToSkillLevelMaster_ID",
        category.CategoryToSkillLevelMaster_ID,
        0,
        "check"
      )
      .subscribe((data) => {
        console.log(data);
        if (data == 0) {
          this.commonService
            .setResetModify(
              "CategoryToSkillLevel_Master",
              "es_modify",
              "CategoryToSkillLevelMaster_ID",
              category.CategoryToSkillLevelMaster_ID,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["CategoryToSkillLevelMaster_ID"].setValue(
                category.CategoryToSkillLevelMaster_ID
              ),
                this.f["CategoryToSkillLevelMaster_CM_COMP_ID"].setValue(
                  category.CategoryToSkillLevelMaster_CM_COMP_ID
                ),
                this.f["CategoryToSkillLevelMaster_categorymaster_id"].setValue(
                  category.CategoryToSkillLevelMaster_categorymaster_id
                ),
                this.f["CategoryToSkillLevelMaster_title"].setValue(
                  category.CategoryToSkillLevelMaster_title
                ),
                this.f["CategoryToSkillLevelMaster_passingpercentage"].setValue(
                  category.CategoryToSkillLevelMaster_passingpercentage
                ),
                (this.displayBasic = true);
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
            "CategoryToSkillLevelMaster_ID",
            "1",
            "es_delete",
            "CategoryToSkillLevel_Master"
          )
          .subscribe(
            (data) => {
              this.getCategorySkillMaster();
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
        "CategoryToSkillLevel_Master",
        "es_modify",
        "CategoryToSkillLevelMaster_ID",
        this.f["CategoryToSkillLevelMaster_ID"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.categorySkillMasterForm.reset();
      });
  }
}
