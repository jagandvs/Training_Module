import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
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
  public skillLevelDropdown: any[] = [];

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

  public material: string;
  public comp_id: string;
  public process: string;
  public MATERIAL_MASTER_QUERY;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getMaterialMaster();
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    this.MATERIAL_MASTER_QUERY = {
      TableNames: "CategoryToSkillLevel_Master",
      fieldNames:
        "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
      condition: "es_delete=0",
    };
    this.commonService
      .FillCombo(this.MATERIAL_MASTER_QUERY)
      .subscribe((data) => {
        this.skillLevelDropdown = data;
        console.log(data);
      });
    this.materialMasterForm = this.fb.group({
      StudyMaterialMaster_id: [""],
      StudyMaterialMaster_CM_COMP_ID: [this.comp_id],
      StudyMaterialMaster_filetype: ["", Validators.required],
      StudyMaterialMaster_location: ["", Validators.required],
      StudyMaterialMaster_skilllevelid: ["", Validators.required],
    });
  }
  get f() {
    return this.materialMasterForm.controls;
  }
  getMaterialMaster() {
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

        console.log(data);
      });
  }
  add() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
    this.materialMasterForm.reset();
  }
  cancel() {
    this.commonService
      .setResetModify(
        "StudyMaterialMaster",
        "es_modify",
        "StudyMaterialMaster_id",
        this.f["StudyMaterialMaster_id"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.materialMasterForm.reset();
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
  }
  save() {
    if (this.materialMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_StudyMaterialMaster",
              this.materialMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getMaterialMaster();
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
  edit(material) {
    this.commonService
      .setResetModify(
        "StudyMaterialMaster",
        "es_modify",
        "StudyMaterialMaster_id",
        material.StudyMaterialMaster_id,
        0,
        "check"
      )
      .subscribe((data) => {
        console.log(data);
        if (data == 0) {
          this.commonService
            .setResetModify(
              "StudyMaterialMaster",
              "es_modify",
              "StudyMaterialMaster_id",
              material.StudyMaterialMaster_id,
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
  }
}
