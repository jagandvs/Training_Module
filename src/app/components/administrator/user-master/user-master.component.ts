import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommonService } from "src/app/_services/common.service";
import { AdministratorService } from "../administrator.service";

@Component({
  selector: "app-user-master",
  templateUrl: "./user-master.component.html",
  styleUrls: ["./user-master.component.css"],
})
export class UserMasterComponent implements OnInit {
  public userMaster: any[] = [];
  public userMasterForm: FormGroup;

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
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: AdministratorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getUserMaster();

    this.userMasterForm = this.fb.group({
      UM_USERNAME: ["", Validators.required],
      UM_PASSWORD: ["", Validators.required],
      UM_CNFPASSWORD: ["", Validators.required],
      UM_LEVEL: ["", Validators.required],
      UM_IS_ADMIN: [""],
      UM_NAME: ["", Validators.required],
      UM_EMAIL: ["", Validators.required],
      UM_CODE: [""],
      IS_ACTIVE: [""],
    });
  }

  get f() {
    return this.userMasterForm.controls;
  }

  getUserMaster() {
    this.userMaster = [];
    this.commonService
      .getTableResponse("*", "USER_MASTER", "ES_DELETE=0")
      .subscribe((data) => {
        this.userMaster = data;
        console.log(data);
      });
  }

  addUser() {
    this.displayBasic = true;
    this.newItem = true;
    this.submitted = false;
  }

  checkPassword() {
    return this.f["UM_PASSWORD"].value === this.f["UM_CNFPASSWORD"].value;
  }

  editUser(user) {
    this.commonService
      .setResetModify(
        "USER_MASTER",
        "MODIFY",
        "UM_CODE",
        user.UM_CODE,
        0,
        "check"
      )
      .subscribe((data) => {
        if (data == 0) {
          this.commonService
            .setResetModify(
              "USER_MASTER",
              "MODIFY",
              "UM_CODE",
              user.UM_CODE,
              1,
              "setLock"
            )
            .subscribe((data) => {
              this.f["UM_USERNAME"].setValue(user.UM_USERNAME);
              this.f["UM_LEVEL"].setValue(user.UM_LEVEL);
              this.f["UM_IS_ADMIN"].setValue(user.UM_IS_ADMIN);
              this.f["UM_NAME"].setValue(user.UM_NAME);
              this.f["UM_EMAIL"].setValue(user.UM_EMAIL);
              this.f["UM_CODE"].setValue(user.UM_CODE);
              this.f["IS_ACTIVE"].setValue(user.IS_ACTIVE);
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
        "USER_MASTER",
        "MODIFY",
        "UM_CODE",
        this.f["UM_CODE"].value,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.newItem = false;
        this.displayBasic = false;
        this.submitted = false;
        this.userMasterForm.reset();
      });
  }
  saveUser() {
    if (this.userMasterForm.valid && this.checkPassword()) {
      this.newItem ? (this.process = "Insert") : (this.process = "Update");
      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .UPSERT_USER_MASTER(this.userMasterForm.value, this.process)
            .subscribe((data) => {
              this.displayBasic = false;
              this.getUserMaster();
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
  deleteUser(userCode: string) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete?",
      header: "Delete Confirmation",
      icon: "fas fa-trash",
      key: "c1",
      accept: () => {
        this.commonService
          .deleteRow(userCode, "UM_CODE", "1", "ES_DELETE", "USER_MASTER")
          .subscribe(
            (data) => {
              this.getUserMaster();
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
