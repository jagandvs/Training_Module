import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../masters.service";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-training-program-master",
  templateUrl: "./training-program-master.component.html",
  styleUrls: ["./training-program-master.component.css"],
})
export class TrainingProgramMasterComponent implements OnInit {
  public trainingMaster: any[] = [];
  public trainingMasterForm: FormGroup;
  public processMasterDropdown: any[] = [];
  public categoryMasterDropdown: any[] = [];
  public skillMasterDropdown: any[] = [];

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

  public CATEGORY_MASTER_QUERY: any = {
    TableNames: "category_master",
    fieldNames: "category_id,category_name",
    condition: "es_delete=0",
  };
  public PROCESS_MASTER_QUERY: any = {
    TableNames: "process_master",
    fieldNames: "process_id,process_name",
    condition: "es_delete=0",
  };
  public SKILL_MASTER_QUERY: any = {
    TableNames: "CategoryToSkillLevel_Master",
    fieldNames:
      "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
    condition: "es_delete=0",
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: MastersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getTrainingMaster();
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    this.commonService
      .FillCombo(this.PROCESS_MASTER_QUERY)
      .subscribe((data) => {
        this.processMasterDropdown = data;
        console.log(data);
      });
    this.commonService
      .FillCombo(this.CATEGORY_MASTER_QUERY)
      .subscribe((data) => {
        this.categoryMasterDropdown = data;
        console.log(data);
      });
    this.commonService.FillCombo(this.SKILL_MASTER_QUERY).subscribe((data) => {
      this.skillMasterDropdown = data;
      console.log(data);
    });
    this.trainingMasterForm = this.fb.group({
      TrainingProgramMaster_ID: [""],
      TrainingProgramMaster_CM_COMP_ID: [this.comp_id],
      TrainingProgramMaster_processMasterid: ["", Validators.required],
      TrainingProgramMaster_categoryid: ["", Validators.required],
      TrainingProgramMaster_skilllevelid: ["", Validators.required],
      TrainingProgramMaster_title: ["", Validators.required],
      TrainingProgramMaster_duration: ["", Validators.required],
      TrainingProgramMaster_location: ["", Validators.required],
      TrainingProgramMaster_modeOfTraining: ["", Validators.required],
      TrainingProgramMaster_iscustomerend: [""],
      TrainingProgramMaster_evalfrom: ["", Validators.required],
      TrainingProgramMaster_evalto: ["", Validators.required],
    });
  }
  get f() {
    return this.trainingMasterForm.controls;
  }

  getTrainingMaster() {
    this.trainingMaster = [];
    this.commonService
      .getTableResponse("*", "TrainingProgramMaster", "es_delete=0")
      .subscribe((data) => {
        data.map((process) => {
          this.trainingMaster.push({
            TrainingProgramMaster_ID: process.TrainingProgramMaster_ID,
            TrainingProgramMaster_CM_COMP_ID:
              process.TrainingProgramMaster_CM_COMP_ID,
            TrainingProgramMaster_processMasterid:
              process.TrainingProgramMaster_processMasterid,
            TrainingProgramMaster_categoryid:
              process.TrainingProgramMaster_categoryid,
            TrainingProgramMaster_skilllevelid:
              process.TrainingProgramMaster_skilllevelid,
            TrainingProgramMaster_title: process.TrainingProgramMaster_title,
            TrainingProgramMaster_duration:
              process.TrainingProgramMaster_duration,
            TrainingProgramMaster_location:
              process.TrainingProgramMaster_location,
            TrainingProgramMaster_modeOfTraining:
              process.TrainingProgramMaster_modeOfTraining,
            TrainingProgramMaster_iscustomerend:
              process.TrainingProgramMaster_iscustomerend,
            TrainingProgramMaster_evalfrom:
              process.TrainingProgramMaster_evalfrom,
            TrainingProgramMaster_evalto: process.TrainingProgramMaster_evalto,
          });
        });

        console.log(data);
      });
  }

  add() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
  }
  save() {
    if (this.trainingMasterForm.valid) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .CRUDMasters(
              "UPSERT_TrainingProgramMaster",
              this.trainingMasterForm.value,
              this.process
            )
            .subscribe((data) => {
              this.displayBasic = false;
              this.getTrainingMaster();
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
  cancel() {
    this.commonService
      .setResetModify(
        "TrainingProgramMaster",
        "es_modify",
        "TrainingProgramMaster_ID",
        this.f["TrainingProgramMaster_ID"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.trainingMasterForm.reset();
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
            "TrainingProgramMaster_ID",
            "1",
            "es_delete",
            "TrainingProgramMaster"
          )
          .subscribe(
            (data) => {
              this.getTrainingMaster();
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
  edit(training) {
    console.log(training);
    this.commonService
      .setResetModify(
        "TrainingProgramMaster",
        "es_modify",
        "TrainingProgramMaster_ID",
        training.TrainingProgramMaster_ID,
        0,
        "check"
      )
      .subscribe((data) => {
        console.log(data);
        if (data == 0) {
          this.commonService
            .setResetModify(
              "TrainingProgramMaster",
              "es_modify",
              "TrainingProgramMaster_ID",
              training.TrainingProgramMaster_ID,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["TrainingProgramMaster_ID"].setValue(
                training.TrainingProgramMaster_ID
              );
              this.f["TrainingProgramMaster_CM_COMP_ID"].setValue(
                training.TrainingProgramMaster_CM_COMP_ID
              );
              this.f["TrainingProgramMaster_processMasterid"].setValue(
                training.TrainingProgramMaster_processMasterid
              );
              this.f["TrainingProgramMaster_categoryid"].setValue(
                training.TrainingProgramMaster_categoryid
              );
              this.f["TrainingProgramMaster_skilllevelid"].setValue(
                training.TrainingProgramMaster_skilllevelid
              );
              this.f["TrainingProgramMaster_title"].setValue(
                training.TrainingProgramMaster_title
              );
              this.f["TrainingProgramMaster_duration"].setValue(
                training.TrainingProgramMaster_duration
              );
              this.f["TrainingProgramMaster_location"].setValue(
                training.TrainingProgramMaster_location
              );
              this.f["TrainingProgramMaster_modeOfTraining"].setValue(
                training.TrainingProgramMaster_modeOfTraining
              );
              this.f["TrainingProgramMaster_iscustomerend"].setValue(
                training.TrainingProgramMaster_iscustomerend
              );
              this.f["TrainingProgramMaster_evalfrom"].setValue(
                formatDate(
                  training.TrainingProgramMaster_evalfrom,
                  "yyyy-MM-dd",
                  "en"
                )
              );
              this.f["TrainingProgramMaster_evalto"].setValue(
                formatDate(
                  training.TrainingProgramMaster_evalto,
                  "yyyy-MM-dd",
                  "en"
                )
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
