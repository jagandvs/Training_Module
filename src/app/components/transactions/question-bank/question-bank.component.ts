import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Question_Bank } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { MastersService } from "../../masters/masters.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-question-bank",
  templateUrl: "./question-bank.component.html",
  styleUrls: ["./question-bank.component.css"],
})
export class QuestionBankComponent implements OnInit {
  public questionBankTable: any[] = [];
  public questionDetailTable: any[] = [];

  public questionBankMasterForm: FormGroup;
  public questionBankDetailForm: FormGroup;

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
  public categorySkillDropdown: SelectItem[] = [];
  public CATEGORY_TO_SKILL_QUERY = {
    TableNames: "CategoryToSkillLevel_Master",
    fieldNames:
      "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
    condition: "ES_DELETE=0",
  };

  public comp_id: number;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commonService
      .checkRight(UM_CODE, Question_Bank, "checkRight")
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
      this.commonService
        .FillCombo(this.CATEGORY_TO_SKILL_QUERY)
        .subscribe((data) => {
          for (let item of data) {
            this.categorySkillDropdown.push({
              label: item.CategoryToSkillLevelMaster_title,
              value: item.CategoryToSkillLevelMaster_ID,
            });
          }
        });
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;

      this.getQuestionBankTable();
      this.questionBankMasterForm = this.fb.group({
        QUESTIONBANKMASTER_ID: [0],
        QUESTIONBANKMASTER_CM_COMP_ID: [this.comp_id],
        QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID: ["", Validators.required],
        QUESTIONBANKMASTER_QUESTIONTYPE: ["", Validators.required],
        QUESTIONBANKMASTER_QUESTIONTITLE: ["", Validators.required],
      });
      this.questionBankDetailForm = this.fb.group({
        QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID: [""],
        QUESTIONBANKDETAIL_ANSWER: ["", Validators.required],
        QUESTIONBANKDETAIL_MARKS: ["", Validators.required],
        QUESTIONBANKDETAIL_WEIGHTAGE: ["", Validators.required],
      });
    }
  }

  getQuestionBankTable() {
    this.questionBankTable = [];
    this.loading = true;
    this.service
      .UPSERT_QuestionBank("UPSERT_QuestionBank", "selectAll", 0)
      .subscribe((data) => {
        console.log(data);
        for (let questionBank of data) {
          let CategoryToSkillLevel = this.getCategorySkillLevel(
            questionBank.QuestionBankMaster_CategoryToSkillLevelid
          );
          this.questionBankTable.push({
            QuestionBankMaster_ID: questionBank.QuestionBankMaster_ID,
            CategoryToSkillLevel: CategoryToSkillLevel,
            QuestionBankMaster_questiontype:
              questionBank.QuestionBankMaster_questiontype,
            QuestionBankMaster_questionTitle:
              questionBank.QuestionBankMaster_questionTitle,
          });
        }
        this.loading = false;
      });
  }
  get f() {
    return this.questionBankMasterForm.controls;
  }

  get g() {
    return this.questionBankDetailForm.controls;
  }
  getCategorySkillLevel(code) {
    console.log(code);
    var label;
    this.categorySkillDropdown.map((data) => {
      console.log(data);
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.questionBankTable = [];
      this.newItem = true;
    } else {
      this.messageService.add({
        key: "t1",
        severity: "warn",
        summary: "Warning",
        detail: "Sorry!! You dont have access to add Question Bank",
      });
    }
  }

  edit(questionBankId) {
    this.newItem = false;
    this.editingPKCODE = questionBankId;
    if (this.updateAccess) {
      this.commonService
        .setResetModify(
          "QuestionBank_Master",
          "ES_MODIFY",
          "QUESTIONBANKMASTER_ID",
          questionBankId,
          0,
          "check"
        )
        .subscribe((data) => {
          console.log(data);
          if (data == 0) {
            this.commonService
              .setResetModify(
                "QuestionBank_Master",
                "ES_MODIFY",
                "QUESTIONBANKMASTER_ID",
                questionBankId,
                1,
                "setLock"
              )
              .subscribe(
                (data) => {
                  console.log(questionBankId);
                  this.service
                    .UPSERT_QuestionBank(
                      "UPSERT_QuestionBank",
                      "SelectMaster",
                      questionBankId
                    )
                    .subscribe(
                      (data) => {
                        console.log(data);
                        let type;
                        data[0].QUESTIONBANKMASTER_QUESTIONTYPE
                          ? (type = "true")
                          : (type = "false");
                        this.f["QUESTIONBANKMASTER_ID"].setValue(
                          data[0].QUESTIONBANKMASTER_ID
                        );
                        this.f[
                          "QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID"
                        ].setValue(
                          data[0].QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID
                        );
                        this.f["QUESTIONBANKMASTER_QUESTIONTYPE"].setValue(
                          type
                        );
                        this.f["QUESTIONBANKMASTER_QUESTIONTITLE"].setValue(
                          data[0].QUESTIONBANKMASTER_QUESTIONTITLE
                        );
                        this.service
                          .UPSERT_QuestionBank(
                            "UPSERT_QuestionBank",
                            "SelectDetail",
                            questionBankId
                          )
                          .subscribe(
                            (data) => {
                              this.displayBasic = true;

                              this.questionDetailTable = [];
                              this.questionDetailTable = data;
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
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                }
              );
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
        detail: "Sorry!! You dont have access to Edit Question Bank",
      });
    }
  }
  insertIntoTable() {
    if (
      !(this.questionBankMasterForm.valid && this.questionBankDetailForm.valid)
    ) {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Please Fill All required fields",
      });
      return;
    }
    if (this.editInsert) {
      this.questionDetailTable.splice(
        this.editIndex,
        1,
        this.questionBankDetailForm.value
      );
      this.editInsert = false;
      this.questionBankDetailForm.reset();
    } else {
      this.questionDetailTable.push(this.questionBankDetailForm.value);
    }
  }
  editQuestionBankDetail(index: number) {
    this.editInsert = true;
    this.editIndex = index;
    console.log(index);
    console.log(this.questionDetailTable[index]);
    this.g["QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID
    );
    this.g["QUESTIONBANKDETAIL_ANSWER"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_ANSWER
    );
    this.g["QUESTIONBANKDETAIL_MARKS"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_MARKS
    );
    this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_WEIGHTAGE
    );
  }
  save() {
    this.submitted = true;
    if (this.questionBankMasterForm.valid) {
      this.submitted = false;
      this.newItem ? (this.process = "Insert") : (this.process = "Update");

      this.confirmationService.confirm({
        message: "Are you sure that you want to save?",
        header: "Save Confirmation",
        icon: "fas fa-save",
        accept: () => {
          this.service
            .INSERT_UPSERT_QuestionBank(
              this.questionBankMasterForm.value,
              this.questionDetailTable,
              this.process
            )
            .subscribe(
              (data) => {
                this.editInsert = false;
                this.getQuestionBankTable();
                this.displayBasic = false;
                this.cancel();
                this.messageService.add({
                  key: "t1",
                  severity: "success",
                  summary: "Success",
                  detail: this.process.toUpperCase() + " Successfully",
                });
              },
              (error: HttpErrorResponse) => {
                console.log(error);
              }
            );
        },
      });
    }
  }

  deleteQuestionBankDetail(index) {
    this.questionDetailTable.splice(index, 1);
  }
  cancel() {
    this.commonService
      .setResetModify(
        "QuestionBank_Master",
        "ES_MODIFY",
        "QUESTIONBANKMASTER_ID",

        this.editingPKCODE,
        0,
        "setLock"
      )
      .subscribe((data) => {
        this.submitted = false;
        this.displayBasic = false;
        this.resetForm();
      });
  }
  resetForm() {
    this.questionBankMasterForm.reset();
    this.questionBankDetailForm.reset();
    this.questionDetailTable = [];
  }
  delete(deleteItem) {
    if (this.deleteAccess) {
      this.commonService
        .setResetModify(
          "QuestionBank_Master",
          "ES_MODIFY",
          "QUESTIONBANKMASTER_ID",
          deleteItem,
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
                    deleteItem,
                    "QUESTIONBANKMASTER_ID",
                    "1",
                    "ES_DELETE",
                    "QUESTIONBANK_MASTER"
                  )
                  .subscribe(
                    (data) => {
                      this.getQuestionBankTable();
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
}
