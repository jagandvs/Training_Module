import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Question_Bank } from "src/app/_helper/SM_CODE";
import { CommonService } from "src/app/_services/common.service";
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
  public marksError: boolean = false;
  public categorySkillDropdown: SelectItem[] = [];
  public trainingProgramDropdown: SelectItem[] = [];
  public trainingScheduleDropdown: SelectItem[] = [];
  public trainingProgramArray: any[] = [];

  public totalRecords = 0;
  public CATEGORY_TO_SKILL_QUERY = {
    TableNames: "CategoryToSkillLevel_Master",
    fieldNames:
      "CategoryToSkillLevelMaster_ID,CategoryToSkillLevelMaster_title",
    condition: "ES_DELETE=0",
  };
  public TRAINING_PROGRAM_QUERY = {
    TableNames: "TrainingProgramMaster",
    fieldNames:
      "TrainingProgramMaster_ID,TrainingProgramMaster_title,TrainingProgramMaster_skilllevelid",
    condition: "ES_DELETE=0",
  };
  // public TRAINING_SCHEDULE_QUERY = {
  //   TableNames: "TRAININGPROGRAM_MASTER,TrainingProgramMaster",
  //   fieldNames:
  //     "TRAININGPROGRAM_TRAINING_PROGRAM_ID, TrainingProgramMaster_title",
  //   condition:
  //     "TRAININGPROGRAM_TRAINING_PROGRAM_ID=TrainingProgramMaster_ID AND TRAININGPROGRAM_MASTER.ES_DELETE=0",
  // };

  public comp_id: number;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    var UM_CODE = currentUser?.user.UM_CODE;
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
      this.commonService
        .FillCombo(this.TRAINING_PROGRAM_QUERY)
        .subscribe((data) => {
          this.trainingProgramArray = data;
          for (let item of data) {
            this.trainingProgramDropdown.push({
              label: item.TrainingProgramMaster_title,
              value: item.TrainingProgramMaster_ID,
            });
          }
        });
      // this.commonService
      //   .FillCombo(this.TRAINING_SCHEDULE_QUERY)
      //   .subscribe((data) => {
      //     console.log(data);
      //     for (let item of data) {
      //       this.trainingScheduleDropdown.push({
      //         label: item.TrainingProgramMaster_title,
      //         value: item.TRAININGPROGRAM_TRAINING_PROGRAM_ID,
      //       });
      //     }
      //   });
      var companyID = JSON.parse(localStorage.getItem("companyDetails"));
      this.comp_id = companyID.CM_ID;

      this.getQuestionBankTable();
      this.questionBankMasterForm = this.fb.group({
        QUESTIONBANKMASTER_ID: [0],
        QUESTIONBANKMASTER_CM_COMP_ID: [this.comp_id],
        QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID: ["", Validators.required],

        QUESTIONBANKMASTER_QUESTIONTITLE: ["", Validators.required],
        QUESTIONBANKMASTER_TRAININGTRANSACTIONID: [""],
        QUESTIONBANKMASTER_TRAININGMASTERID: ["", Validators.required],
        QUESTIONBANKMASTER_MARKS: ["", Validators.required],
      });
      this.questionBankDetailForm = this.fb.group({
        QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID: [""],
        QUESTIONBANKDETAIL_ANSWER: ["", Validators.required],
        QUESTIONBANKDETAIL_WEIGHTAGE: ["", Validators.required],
      });
    }
  }

  selectProcessSkillLevel() {
    console.log(this.f["QUESTIONBANKMASTER_TRAININGMASTERID"].value);
    this.trainingProgramArray.map((data) => {
      if (
        this.f["QUESTIONBANKMASTER_TRAININGMASTERID"].value ==
        data.TrainingProgramMaster_ID
      ) {
        this.f["QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID"].setValue(
          data.TrainingProgramMaster_skilllevelid
        );
      }
    });
  }

  getQuestionBankTable() {
    this.questionBankTable = [];
    this.loading = true;
    this.service
      .UPSERT_QuestionBank("UPSERT_QuestionBank", "selectAll", 0)
      .subscribe((data) => {
        const setArray = new Set();
        const filteredArr = data.filter((el) => {
          const duplicate = setArray.has(el.QuestionBankMaster_ID);
          setArray.add(el.QuestionBankMaster_ID);
          return !duplicate;
        });
        console.log(filteredArr);
        for (let questionBank of filteredArr) {
          let CategoryToSkillLevel = this.getCategorySkillLevel(
            questionBank?.QuestionBankMaster_CategoryToSkillLevelid
          );
          let programTitle;
          this.trainingProgramArray.filter((data) => {
            if (
              data.TrainingProgramMaster_ID ==
              questionBank.QUESTIONBANKMASTER_TRAININGMASTERID
            ) {
              programTitle = data.TrainingProgramMaster_title;
            }
          });
          console.log(programTitle);
          this.questionBankTable.push({
            QuestionBankMaster_ID: questionBank.QuestionBankMaster_ID,
            CategoryToSkillLevel: CategoryToSkillLevel,
            QuestionBankMaster_questiontype:
              questionBank.QuestionBankMaster_questiontype,
            QuestionBankMaster_questionTitle:
              questionBank.QuestionBankMaster_questionTitle,
            QUESTIONBANKMASTER_TRAININGTRANSACTIONID:
              questionBank.QUESTIONBANKMASTER_TRAININGTRANSACTIONID,
            QUESTIONBANKMASTER_TRAININGMASTERID:
              questionBank.QUESTIONBANKMASTER_TRAININGMASTERID,
            QUESTIONBANKMASTER_MARKS: questionBank.QUESTIONBANKMASTER_MARKS,
            QUESTIONBANKMASRER_TRAININGTITLE: programTitle,
          });
        }
        this.loading = false;
        this.totalRecords = this.questionBankTable.length;
      });
  }
  get f() {
    return this.questionBankMasterForm.controls;
  }

  get g() {
    return this.questionBankDetailForm.controls;
  }
  getCategorySkillLevel(code) {
    var label;
    this.categorySkillDropdown.map((data) => {
      if (data.value == code) {
        label = data.label;
      }
    });
    return label;
  }
  add() {
    if (this.addAccess) {
      this.displayBasic = true;
      this.questionDetailTable = [];
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
                  this.service
                    .UPSERT_QuestionBank(
                      "UPSERT_QuestionBank",
                      "SelectMaster",
                      questionBankId
                    )
                    .subscribe(
                      (data) => {
                        this.f["QUESTIONBANKMASTER_ID"].setValue(
                          data[0].QUESTIONBANKMASTER_ID
                        );
                        this.f[
                          "QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID"
                        ].setValue(
                          data[0].QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID
                        );

                        this.f["QUESTIONBANKMASTER_QUESTIONTITLE"].setValue(
                          data[0].QUESTIONBANKMASTER_QUESTIONTITLE
                        );
                        this.f[
                          "QUESTIONBANKMASTER_TRAININGTRANSACTIONID"
                        ].setValue(
                          data[0].QUESTIONBANKMASTER_TRAININGTRANSACTIONID
                        );
                        this.f["QUESTIONBANKMASTER_TRAININGMASTERID"].setValue(
                          data[0].QUESTIONBANKMASTER_TRAININGMASTERID
                        );
                        this.f["QUESTIONBANKMASTER_MARKS"].setValue(
                          data[0].QUESTIONBANKMASTER_MARKS
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
    if (this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].value == 100) {
      var index = this.questionDetailTable.findIndex((detail) => {
        return (
          detail.QUESTIONBANKDETAIL_WEIGHTAGE ==
          this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].value
        );
      });
    }
    if (
      !(
        this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].value == 100 ||
        this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].value == 0
      )
    ) {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Weightage Should be 0 or 100",
      });
      return;
    }
    if (index >= 0) {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Weightage 100 already exist",
      });
      return;
    }
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
    var duplicateAnswer = [];
    duplicateAnswer = this.questionDetailTable.filter((data) => {
      if (
        this.g["QUESTIONBANKDETAIL_ANSWER"].value.toLowerCase() ==
        data.QUESTIONBANKDETAIL_ANSWER.toLowerCase()
      ) {
        return data.QUESTIONBANKDETAIL_ANSWER;
      }
    });
    if (duplicateAnswer.length == 0) {
      if (this.editInsert) {
        this.questionDetailTable.push(this.questionBankDetailForm.value);
        this.editInsert = false;
        this.questionBankDetailForm.reset();
      } else if (duplicateAnswer.length == 0) {
        this.questionDetailTable.push(this.questionBankDetailForm.value);
        this.questionBankDetailForm.reset();
      }
    } else {
      this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Answer already exists",
      });
    }
  }
  editQuestionBankDetail(index: number) {
    this.editInsert = true;
    this.editIndex = index;
    this.g["QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID
    );
    this.g["QUESTIONBANKDETAIL_ANSWER"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_ANSWER
    );

    this.g["QUESTIONBANKDETAIL_WEIGHTAGE"].setValue(
      this.questionDetailTable[index].QUESTIONBANKDETAIL_WEIGHTAGE
    );
    this.questionDetailTable.splice(index, 1);
  }
  checkMarks(value) {
    if (value > 100 || value < 0) {
      this.marksError = true;
    } else {
      this.marksError = false;
    }
  }
  save() {
    this.submitted = true;
    if (this.questionDetailTable.length < 2) {
      return this.messageService.add({
        key: "t2",
        severity: "info",
        summary: "Info",
        detail: "Please add atleast 2 Answers",
      });
    }
    if (this.marksError) {
      return this.messageService.add({
        key: "t2",
        severity: "error",
        summary: "Error",
        detail: "Marks should between 0 and 100",
      });
    }

    if (this.questionBankMasterForm.valid && !this.marksError) {
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
    } else {
      return;
    }
  }

  deleteQuestionBankDetail(index) {
    this.questionDetailTable.splice(index, 1);
  }
  cancel() {
    if (this.newItem) {
      this.submitted = false;
      this.displayBasic = false;
      this.reset();
    } else {
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
          this.reset();
        });
    }
  }
  reset() {
    this.questionBankMasterForm.reset();
    this.newItem
      ? this.f["QUESTIONBANKMASTER_ID"].setValue(0)
      : this.f["QUESTIONBANKMASTER_ID"].setValue(this.editingPKCODE);
    this.f["QUESTIONBANKMASTER_CM_COMP_ID"].setValue(this.comp_id);
    this.questionBankDetailForm.reset();
    this.questionDetailTable = [];
  }
  delete(deleteItem) {
    if (this.deleteAccess) {
      var DEL_CHECK_EVAL_DETAIL_QUERY = {
        TableNames: "EVAL_DETAIL",
        fieldNames: "*",
        condition: `EVAL_QUESTION_ID=${deleteItem}`,
      };
      console.log(DEL_CHECK_EVAL_DETAIL_QUERY.condition);
      this.commonService
        .FillCombo(DEL_CHECK_EVAL_DETAIL_QUERY)
        .subscribe((data) => {
          console.log(data.length);
          if (data.length == 0) {
            this._delete(deleteItem);
          } else {
            this.messageService.add({
              key: "t1",
              severity: "info",
              summary: "info",
              detail: "Question cannot be deleted",
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

  _delete(deleteItem) {
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
