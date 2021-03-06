import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { AdministratorService } from "../administrator.service";

@Component({
  selector: "app-user-rights",
  templateUrl: "./user-rights.component.html",
  styleUrls: ["./user-rights.component.css"],
})
export class UserRightsComponent implements OnInit {
  public userRightForm: FormGroup;
  // Arrays of Form fields for drop down
  public users: any[];
  public moduleNames: any[];
  public screens: any[];
  // Variable for error check
  public userNameError: boolean = false;
  public forUserNameError: boolean = false;
  public moduleNameError: boolean = false;
  public formNameError: boolean = false;

  public submitted: boolean = false;
  public UR_UM_CODE: number = 0;
  public UR_SM_CODE: number = 0;
  public UR_RIGHTS: string = "";
  public PROCESS: string = "";
  public MOD_CODE: number = 0;

  public p: number = 1;

  public showUserRightTable: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private service: AdministratorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.service.userMaster().subscribe((users) => {
      this.users = users;
    });
    this.service.getModule().subscribe((modules) => {
      this.moduleNames = modules;
    });

    this.userRightForm = this.formBuilder.group({
      username: ["", Validators.required],
      copyRights: [false],
      fromUserName: [{ value: "", disabled: true }],
      moduleName: ["", Validators.required],
      formName: ["", Validators.required],
      forms: [false],
      menu: [false],
      add: [false],
      view: [false],
      update: [false],
      delete: [false],
      print: [false],
      back_date: [false],
      all: [false],
      userRightsTable: this.formBuilder.array([]),
    });
  }

  get f() {
    return this.userRightForm.controls;
  }

  get userRightsTable(): FormArray {
    return this.userRightForm.get("userRightsTable") as FormArray;
  }

  checkUsername(user: string, fieldName: string) {
    var index = this.users.findIndex(
      (userItem) => userItem.UM_USERNAME === user
    );

    if (index === -1) {
      fieldName == "username"
        ? (this.userNameError = true)
        : (this.forUserNameError = true);
    } else {
      this.userNameError = false;
      this.forUserNameError = false;
      this.UR_UM_CODE = this.users[index].UM_CODE;
    }
  }
  toggleForUsername() {
    if (this.f["copyRights"].value) {
      this.f["fromUserName"].enable();
      this.f["fromUserName"].setValidators([Validators.required]);
    } else {
      this.f["fromUserName"].setValue("");
      this.f["fromUserName"].disable();
      this.f["fromUserName"].clearValidators();
      this.forUserNameError = false;
    }
  }
  toggleForFormName() {
    if (!this.f["forms"].value) {
      this.f["formName"].enable();
      this.f["formName"].setValidators([Validators.required]);
    } else {
      this.f["formName"].setValue("");
      this.f["formName"].disable();
      this.f["formName"].clearValidators();
    }
  }
  getScreen(moduleName: string) {
    if (moduleName != "") {
      var index = this.moduleNames.findIndex(
        (moduleItem) => moduleItem.MODULE_NAME === moduleName
      );
      if (index == -1) {
        this.moduleNameError = true;
      } else {
        this.moduleNameError = false;
        this.service
          .getScreen(this.moduleNames[index].MODULE_NO)
          .subscribe((data) => {
            this.screens = data;
          });
        this.MOD_CODE = this.moduleNames[index].MODULE_NO;
      }
    } else {
      this.f["formName"].setValue("");
      this.screens = [];
    }
  }
  checkFormName(formName: string) {
    if (formName != "" && this.screens.length > 0) {
      var index = this.screens.findIndex(
        (formItem) => formItem.SM_NAME === formName
      );
      if (index == -1) {
        this.formNameError = true;
      } else {
        this.formNameError = false;
        this.UR_SM_CODE = this.screens[index].SM_CODE;
      }
    }
  }

  checkRights() {
    if (
      this.f["menu"].value &&
      this.f["view"].value &&
      this.f["add"].value &&
      this.f["update"].value &&
      this.f["delete"].value &&
      this.f["print"].value &&
      this.f["back_date"].value
    ) {
      this.f["all"].setValue(true);
    } else {
      this.f["all"].setValue(false);
    }
  }

  selectAllRights() {
    if (this.f["all"].value) {
      this.f["menu"].setValue(true);
      this.f["view"].setValue(true);
      this.f["add"].setValue(true);
      this.f["update"].setValue(true);
      this.f["delete"].setValue(true);
      this.f["print"].setValue(true);
      this.f["back_date"].setValue(true);
    } else {
      this.f["menu"].setValue(false);
      this.f["view"].setValue(false);
      this.f["add"].setValue(false);
      this.f["update"].setValue(false);
      this.f["delete"].setValue(false);
      this.f["print"].setValue(false);
      this.f["back_date"].setValue(false);
    }
  }
  show() {
    this.submitted = true;

    this.f["forms"].value
      ? (this.PROCESS = "showAll")
      : (this.PROCESS = "show");

    if (this.userRightForm.valid) {
      if (this.PROCESS == "showAll") {
        this.service
          .userRightShowAll(
            this.UR_UM_CODE,
            this.UR_SM_CODE,
            this.UR_RIGHTS,
            this.PROCESS,
            this.MOD_CODE
          )
          .subscribe((data) => {
            this.userRightsTable.clear();
            for (let userRightsTableData of data) {
              this.userRightsTable.push(
                this.formBuilder.group({
                  SM_NAME: [userRightsTableData.SM_NAME],
                  UR_SM_CODE: [userRightsTableData.UR_SM_CODE],
                  MENU: [userRightsTableData.MENU],
                  VIEW: [userRightsTableData.VIEW],
                  UPDATE: [userRightsTableData.UPDATE],
                  ADD: [userRightsTableData.ADD],
                  DELETE: [userRightsTableData.DELETE],
                  PRINT: [userRightsTableData.PRINT],
                  BACK_DATE: [userRightsTableData.BACK_DATE],
                })
              );
            }

            if (data.length > 0) {
              this.showUserRightTable = true;
            } else {
              this.showUserRightTable = false;

              this.messageService.add({
                severity: "error",
                summary: "Error Message",
                detail: "No Data found",
              });
            }
          });
      } else if (this.PROCESS == "show") {
        this.service
          .userRightShow(
            this.UR_UM_CODE,
            this.UR_SM_CODE,
            this.UR_RIGHTS,
            this.PROCESS,
            this.MOD_CODE
          )
          .subscribe((data) => {
            this.userRightsTable.clear();
            this.userRightsTable.push(
              this.formBuilder.group({
                SM_NAME: [data[0].SM_NAME],
                UR_SM_CODE: [data[0].UR_SM_CODE],
                MENU: [data[0].MENU],
                VIEW: [data[0].VIEW],
                UPDATE: [data[0].UPDATE],
                ADD: [data[0].ADD],
                DELETE: [data[0].DELETE],
                PRINT: [data[0].PRINT],
                BACK_DATE: [data[0].BACK_DATE],
              })
            );
            if (data.length > 0) {
              this.showUserRightTable = true;
            } else {
              this.showUserRightTable = false;

              this.messageService.add({
                severity: "success",
                summary: "Error Message",
                detail: "No Data found",
              });
            }
          });
      }
      this.submitted = false;
    } else {
      return;
    }
  }
  changeMenuAccess(i: number) {
    const getMenu = (<FormArray>this.userRightForm.get("userRightsTable")).at(
      i
    );

    let updateMenu = !getMenu.value.MENU;
    getMenu.patchValue({ MENU: updateMenu });
  }
  changeAddAccess(i: number) {
    const getAdd = (<FormArray>this.userRightForm.get("userRightsTable")).at(i);

    let updateMenu = !getAdd.value.ADD;
    getAdd.patchValue({ ADD: updateMenu });
  }
  changeViewAccess(i: number) {
    const getView = (<FormArray>this.userRightForm.get("userRightsTable")).at(
      i
    );

    let updateView = !getView.value.VIEW;
    getView.patchValue({ VIEW: updateView });
  }
  changeUpdateAccess(i: number) {
    const getUpdate = (<FormArray>this.userRightForm.get("userRightsTable")).at(
      i
    );

    let update = !getUpdate.value.UPDATE;
    getUpdate.patchValue({ UPDATE: update });
  }
  changeDeleteAccess(i: number) {
    const getDelete = (<FormArray>this.userRightForm.get("userRightsTable")).at(
      i
    );

    let updateDelete = !getDelete.value.DELETE;
    getDelete.patchValue({ DELETE: updateDelete });
  }
  changePrintAccess(i: number) {
    const getPrint = (<FormArray>this.userRightForm.get("userRightsTable")).at(
      i
    );
    let updatePrint = !getPrint.value.PRINT;
    getPrint.patchValue({ PRINT: updatePrint });
  }
  changeBackDateAccess(i: number) {
    const getBackDate = (<FormArray>(
      this.userRightForm.get("userRightsTable")
    )).at(i);

    let updateBackDate = !getBackDate.value.BACK_DATE;
    getBackDate.patchValue({ BACK_DATE: updateBackDate });
  }

  cancel() {
    this.userRightsTable.clear();
    this.showUserRightTable = false;
    this.userRightForm.reset();
  }
  save() {
    if (this.userRightForm.valid) {
      var insertData = [];
      var _menu, _add, _view, _update, _delete, _print, _back_date;
      for (let data of this.userRightsTable.value) {
        data.MENU ? (_menu = "1") : (_menu = "0");
        data.ADD ? (_add = "1") : (_add = "0");
        data.VIEW ? (_view = "1") : (_view = "0");
        data.UPDATE ? (_update = "1") : (_update = "0");
        data.DELETE ? (_delete = "1") : (_delete = "0");
        data.PRINT ? (_print = "1") : (_print = "0");
        data.BACK_DATE ? (_back_date = "1") : (_back_date = "0");

        insertData.push({
          UR_UM_CODE: this.UR_UM_CODE,
          UR_SM_CODE: data.UR_SM_CODE,
          UR_RIGHTS:
            _menu + _add + _view + _update + _delete + _print + _back_date,
          PROCESS: "insert",
          MOD_CODE: this.MOD_CODE,
        });
      }
      this.service.insertUserRights(insertData).subscribe((data) => {
        this.messageService.add({
          severity: "success",
          summary: "Success Message",
          detail: "User Rights Saved Successfully",
          key: "t1",
        });
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error Message",
        detail: "Please select required field to show and save user rights",
      });
    }
  }
}
