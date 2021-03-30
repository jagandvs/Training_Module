import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Study_Material } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";

@Component({
  selector: "app-study-material-master",
  templateUrl: "./study-material-master.component.html",
  styleUrls: ["./study-material-master.component.css"],
})
export class StudyMaterialMasterComponent implements OnInit {
  public materialMaster: any[] = [];
  public materialMasterForm: FormGroup;
  public skillLevelDropdown: SelectItem[] = [];

  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;
  public saveLoading: boolean = false;
  public cancelLoading: boolean = false;

  public loading: boolean = false;
  public submitted: boolean = false;
  public newItem: boolean = false;
  public displayBasic: Boolean = false;
  public duplicateError: boolean = false;

  public material: string;
  public comp_id: string;
  public process: string;
  public editPKCode: number;

  public MATERIAL_MASTER_QUERY;

  public totalRecords = 0;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commonService
      .checkRight(UM_CODE, Study_Material, "checkRight")
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
      this.getMaterialMaster();
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;
      this.MATERIAL_MASTER_QUERY = {
        TableNames: "CategoryToSkillLevel_Master",
        fieldNames:
          "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
        condition: "es_delete=0",
      };

      this.materialMasterForm = this.fb.group({
        StudyMaterialMaster_id: [""],
        StudyMaterialMaster_CM_COMP_ID: [this.comp_id],
        StudyMaterialMaster_filetype: ["", Validators.required],
        StudyMaterialMaster_location: ["", Validators.required],
        StudyMaterialMaster_skilllevelid: ["", Validators.required],
      });
    }
  }
  get f() {
    return this.materialMasterForm.controls;
  }
  getMaterialMaster() {
    this.loading = true;
    this.materialMaster = [];
    this.commonService
      .getTableResponse("*", "StudyMaterialMaster", "es_delete=0")
      .subscribe((data) => {
        data.map((material) => {
          this.materialMaster.push({
            StudyMaterialMaster_id: material.StudyMaterialMaster_id,
            StudyMaterialMaster_CM_COMP_ID:
              material.StudyMaterialMaster_CM_COMP_ID,
            StudyMaterialMaster_filetype: material.StudyMaterialMaster_filetype,
            StudyMaterialMaster_location: material.StudyMaterialMaster_location,
            StudyMaterialMaster_skilllevelid:
              material.StudyMaterialMaster_skilllevelid,
          });
        });
        this.loading = false;
        this.totalRecords = this.materialMaster.length;
      });
  }
  getFillCombo() {
    this.commonService
      .FillCombo(this.MATERIAL_MASTER_QUERY)
      .subscribe((data) => {
        for (let value of data) {
          this.skillLevelDropdown.push({
            label: value.CategoryToSkillLevelMaster_title,
            value: value.CategoryToSkillLevelMaster_ID,
          });
        }
      });
  }
  add() {
    if (this.addAccess) {
      this.getFillCombo();
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
          "StudyMaterialMaster",
          "es_modify",
          "StudyMaterialMaster_id",
          this.editPKCode,
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
  delete(code) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "StudyMaterialMaster",
          "es_modify",
          "StudyMaterialMaster_id",
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
                    "StudyMaterialMaster_id",
                    "1",
                    "es_delete",
                    "StudyMaterialMaster"
                  )
                  .subscribe(
                    (data) => {
                      this.getMaterialMaster();
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
  reset() {
    this.materialMasterForm.reset();
    this.duplicateError = false;
    this.submitted = false;
    this.newItem
      ? this.f["StudyMaterialMaster_id"].setValue("")
      : this.f["StudyMaterialMaster_id"].setValue(this.editPKCode);
    this.f["StudyMaterialMaster_CM_COMP_ID"].setValue(this.comp_id);
  }

  checkDuplicate() {
    if (this.f["StudyMaterialMaster_filetype"].value != "") {
      if (this.newItem) {
        var arr = this.materialMaster.filter((master) => {
          if (
            master.StudyMaterialMaster_filetype.toLowerCase() ==
            this.f["StudyMaterialMaster_filetype"].value.toLowerCase()
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
      } else {
        var arr = this.materialMaster.filter((master) => {
          if (
            master.StudyMaterialMaster_filetype.toLowerCase() ==
              this.f["StudyMaterialMaster_filetype"].value.toLowerCase() &&
            master.StudyMaterialMaster_id !=
              this.f["StudyMaterialMaster_id"].value
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
  save() {
    this.submitted = true;
    if (this.duplicateError) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Duplicates not allowed",
      });
    }
    if (this.materialMasterForm.valid && !this.duplicateError) {
      this.saveLoading = true;

      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.saveLoading = true;

          this.service
            .CRUDMasters(
              "UPSERT_StudyMaterialMaster",
              this.materialMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.saveLoading = false;
              this.getMaterialMaster();
              this.submitted = false;
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

  edit(material) {
    this.editPKCode = material.StudyMaterialMaster_id;

    if (this.updateAccess) {
      this.getFillCombo();
      this.commonService
        .setResetModify(
          "StudyMaterialMaster",
          "es_modify",
          "StudyMaterialMaster_id",
          this.editPKCode,
          0,
          "check"
        )
        .subscribe((data) => {
          if (data == 0) {
            this.commonService
              .setResetModify(
                "StudyMaterialMaster",
                "es_modify",
                "StudyMaterialMaster_id",
                this.editPKCode,
                1,
                "setLock"
              )
              .subscribe((data) => {
                this.f["StudyMaterialMaster_id"].setValue(
                  material.StudyMaterialMaster_id
                );
                this.f["StudyMaterialMaster_CM_COMP_ID"].setValue(
                  material.StudyMaterialMaster_CM_COMP_ID
                );
                this.f["StudyMaterialMaster_filetype"].setValue(
                  material.StudyMaterialMaster_filetype
                );

                this.f["StudyMaterialMaster_location"].setValue(
                  material.StudyMaterialMaster_location
                );
                this.f["StudyMaterialMaster_skilllevelid"].setValue(
                  material.StudyMaterialMaster_skilllevelid
                );

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
