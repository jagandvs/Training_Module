import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Question_Bank } from "src/app/_helper/SM_CODE";
import { UM_CODE } from "src/app/_helper/variables";
import { CommonService } from "src/app/_services/common.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-evaluation",
  templateUrl: "./evaluation.component.html",
  styleUrls: ["./evaluation.component.css"],
})
export class EvaluationComponent implements OnInit {
  public QuestionList: any[] = [];
  public QuestionDetail: any[] = [];
  public QuestionMaster: any[] = [];

  public selectedTraining: string;
  public trainingProgramDropdown: SelectItem[] = [];
  public menuAccess: boolean = true;
  public addAccess: boolean = true;
  public viewAccess: boolean = true;
  public updateAccess: boolean = true;
  public deleteAccess: boolean = true;
  public printAccess: boolean = true;
  public backDateAccess: boolean = true;

  public trainingSelected: boolean = false;
  public scoredMarks: number = 0;

  public comp_id: number;
  public emp_id: number;
  public total_marks: number = 0;
  public displayResponsive: boolean = false;
  public TRAINING_PROGRAM_QUERY = {
    TableNames: "TRAININGPROGRAM_MASTER,TrainingProgramMaster",
    fieldNames:
      "TRAININGPROGRAM_TRAINING_PROGRAM_ID, TrainingProgramMaster_title",
    condition:
      "TRAININGPROGRAM_TRAINING_PROGRAM_ID=TrainingProgramMaster_ID AND TRAININGPROGRAM_MASTER.ES_DELETE=0",
  };
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private service: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    var companyID = JSON.parse(localStorage.getItem("companyDetails"));
    this.comp_id = companyID.CM_ID;
    var empID = JSON.parse(localStorage.getItem("currentUser"));
    console.log(empID);
    this.emp_id = empID.user.EMP_CODE;
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
        .FillCombo(this.TRAINING_PROGRAM_QUERY)
        .subscribe((data) => {
          console.log(data);
          for (let item of data) {
            this.trainingProgramDropdown.push({
              label: item.TrainingProgramMaster_title,
              value: item.TRAININGPROGRAM_TRAINING_PROGRAM_ID,
            });
          }
        });
    }
  }

  onTrainingProgramChange() {
    this.trainingSelected = true;
    console.log(this.selectedTraining);
    this.service.getQuestionBank(this.selectedTraining).subscribe((data) => {
      this.QuestionList = data;
      let marks = 0;
      this.QuestionList.map((data) => {
        marks = marks + data.options[0].Marks;
      });
      console.log(marks);
    });
  }
  answered(question, option, i) {
    console.log(question, option, i);
    this.QuestionDetail = [];

    let index = this.QuestionMaster.findIndex((data) => data.index == i);
    for (let crctOpt of question.options) {
      this.QuestionDetail.push({
        EVAL_MASTER_ID: 0,
        EVAL_QUESTION_ID: question.id,
        EVAL_ANSWER_ID: crctOpt.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID,
        EVAL_SELECTED_ANS:
          crctOpt.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID ==
          option.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID,
      });
    }

    if (index == -1) {
      for (let crctOpt of question.options) {
        if (
          crctOpt.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID ==
          option.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID
        ) {
          this.total_marks = this.total_marks + crctOpt.Marks;
        }
      }
      this.QuestionMaster.push({
        index: i,
        PROCESS: "Insert",
        EVAL_ID: 0,
        EVAL_CM_COMP_ID: this.comp_id,
        EVAL_DATE: new Date(),
        EVAL_TRAINING_SCHEDULE_ID: this.selectedTraining,
        EVAL_EMP_ID: this.emp_id,
        EVAL_TOTAL_MARKS: this.total_marks,
        DETAIL: this.QuestionDetail,
        ES_DELETE: 0,
        MODIFY: 0,
      });
    } else {
      for (let crctOpt of question.options) {
        if (
          crctOpt.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID ==
          option.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID
        ) {
          if (crctOpt.QuestionBankDetail_weightage > 0) {
            this.total_marks = this.total_marks + crctOpt.Marks;
          } else {
            this.total_marks = this.total_marks - crctOpt.Marks;
          }
        }
      }
      this.QuestionMaster.splice(index, 1, {
        index: i,
        PROCESS: "Insert",
        EVAL_ID: 0,
        EVAL_CM_COMP_ID: this.comp_id,
        EVAL_DATE: new Date(),
        EVAL_TRAINING_SCHEDULE_ID: this.selectedTraining,
        EVAL_EMP_ID: this.emp_id,
        EVAL_TOTAL_MARKS: this.total_marks,
        DETAIL: this.QuestionDetail,
        ES_DELETE: 0,
        MODIFY: 0,
      });
    }
    console.log(this.QuestionMaster);
  }
  save() {
    if (this.QuestionMaster.length == this.QuestionList.length) {
      this.QuestionMaster.map((data) => {
        data.EVAL_TOTAL_MARKS = this.total_marks;
      });
      this.SpinnerService.show();
      this.service.saveEvaluation(this.QuestionMaster).subscribe(
        (data) => {
          this.scoredMarks = this.total_marks;
          this.SpinnerService.hide();
          this.displayResponsive = true;
          this.QuestionList = [];
          this.trainingSelected = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      return this.messageService.add({
        key: "t1",
        severity: "error",
        summary: "Error",
        detail: "Please Fill All required fields",
      });
    }
  }
}
