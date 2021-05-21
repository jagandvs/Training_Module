import { HttpClient } from "@angular/common/http";
import { identifierModuleUrl } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  INSERT_QUESTION_BANK,
  httpOptions,
  TRANSACTIONS,
  INSERT_EMPLOYEE_MASTER,
  INSERT_TRAINING_NEEDS,
  INSERT_UPSERT_TRAININGPROGRAM_MASTER,
  getEmployeeList,
  getEmployeeListForApproval,
  UpdateApproval,
  getEmployeeListForAttendance,
  UpdateAttendance,
  getQuestionBank,
  UPSERT_Eval,
  getEmployeeListForOfflineEvaluation,
  UPSERT_EvalOffline,
  UpdateTraningConductedBy,
  getEmployeeListForHODFeedback,
  updateUpdateHODRemarks,
  UpdateUpdateHRRemarks,
} from "src/app/_helper/navigation-urls";
import { CommonService } from "src/app/_services/common.service";

@Injectable({
  providedIn: "root",
})
export class TransactionsService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  // HTTP API REQUEST FOR QUESTION BANK

  UPSERT_QuestionBank(
    url: string,
    process: string,
    QUESTIONBANKMASTER_ID: number
  ): Observable<any[]> {
    let body = {
      process: process,
      QUESTIONBANKMASTER_ID: QUESTIONBANKMASTER_ID,
    };
    return this.http.post<any[]>(TRANSACTIONS + url, body, httpOptions);
  }

  INSERT_UPSERT_QuestionBank(masterForm, detailForm, process) {
    let body = [masterForm, detailForm, { process: process }];
    return this.http.post<any>(
      INSERT_QUESTION_BANK,
      body,
      this.commonService.logger(
        "Question Bank",
        process,
        "Question Bank",
        "",
        ""
      )
    );
  }

  UPSERT_TrainingNeedsMaster(
    url: string,
    process: string,
    TRAINING_NEED_ID: number
  ): Observable<any[]> {
    let body = {
      process: process,
      TRAINING_NEED_ID: TRAINING_NEED_ID,
    };
    return this.http.post<any[]>(TRANSACTIONS + url, body, httpOptions);
  }

  INSERT_UPSERT_TrainingNeedsMaster(masterForm, detailForm, process) {
    let body = [masterForm, detailForm, { process: process }];
    return this.http.post<any>(
      INSERT_TRAINING_NEEDS,
      body,
      this.commonService.logger(
        "Training Need Master",
        process,
        "Training Need Master",
        "",
        ""
      )
    );
  }

  UPSERT_TRAININGPROGRAM_MASTER(
    url: string,
    process: string,
    TRAININGPROGRAM_ID: number
  ): Observable<any[]> {
    let body = {
      process: process,
      TRAININGPROGRAM_ID: TRAININGPROGRAM_ID,
    };
    return this.http.post<any[]>(TRANSACTIONS + url, body, httpOptions);
  }

  INSERT_UPSERT_TRAININGPROGRAM_MASTER(masterForm, detailForm, process) {
    let body = [masterForm, detailForm, { process: process }];
    return this.http.post<any>(
      INSERT_UPSERT_TRAININGPROGRAM_MASTER,
      body,
      this.commonService.logger(
        "Training Master",
        process,
        "Training Master",
        "",
        ""
      )
    );
  }

  getEmployeeList(Trainingmaster_id): Observable<any[]> {
    return this.http.get<any[]>(
      getEmployeeList + "?Trainingmaster_id=" + Trainingmaster_id
    );
  }

  getEmployeeListForApproval(EMP_ID: number, COMPANY_ID: number) {
    return this.http.get<any[]>(
      getEmployeeListForApproval +
        "?EMP_ID=" +
        EMP_ID +
        "&COMPANY_ID=" +
        COMPANY_ID
    );
  }

  updateApproval(approvalList) {
    return this.http.post<any>(
      UpdateApproval,
      approvalList,
      this.commonService.logger(
        "Training Program Approval",
        "approval",
        "Training Program Approval",
        "",
        ""
      )
    );
  }

  getEmployeeListForAttendance(Training_ID): Observable<any[]> {
    return this.http.get<any[]>(
      getEmployeeListForAttendance + "?Training_ID=" + Training_ID
    );
  }

  UpdateTraningConductedBy(TRAININGPROGRAMID, CONDUCTEDBY) {
    return this.http.post(
      UpdateTraningConductedBy,
      { TRAININGPROGRAMID: TRAININGPROGRAMID, CONDUCTEDBY: CONDUCTEDBY },
      httpOptions
    );
  }
  getEmployeeListForOfflineEvaluation(
    Training_ID,
    COMPANY_ID
  ): Observable<any[]> {
    let body = { Trainingmaster_id: Training_ID, COMPANY_ID: COMPANY_ID };
    return this.http.post<any[]>(
      getEmployeeListForOfflineEvaluation,
      body,
      httpOptions
    );
  }
  updateAttendance(approvalList) {
    return this.http.post<any>(
      UpdateAttendance,
      approvalList,
      this.commonService.logger(
        "Training attendance Approval",
        "approval",
        "Training Program Approval",
        "",
        ""
      )
    );
  }

  getQuestionBank(TrainingTransaction_id, emp_id): Observable<any[]> {
    return this.http
      .post<any[]>(
        getQuestionBank,
        { TrainingTransaction_id: TrainingTransaction_id, emp_id: emp_id },
        this.commonService.logger(
          "Training program Questions",
          "get questions",
          "Training program Questions",
          "",
          ""
        )
      )
      .pipe(
        map((data) => {
          console.log(data.length);
          let allQuestions = [];
          if (data.length == 0) {
            return data;
          } else {
            if (data[0].hasOwnProperty("EVAL_TOTAL_MARKS")) {
              return data;
            }
            for (let questions of data) {
              allQuestions.push({
                id: questions.id,
                Question: questions.Question,
                options: [],
              });
            }
            data.map((options) => {
              for (let arr of allQuestions) {
                if (options.id == arr.id) {
                  arr.options.push({
                    QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID:
                      options.QUESTIONBANKDETAIL_QUESTIONBANKDETAIL_ID,
                    QuestionBankDetail_Answer:
                      options.QuestionBankDetail_Answer,
                    QuestionBankDetail_weightage:
                      options.QuestionBankDetail_weightage,
                    Marks: options.Marks,
                  });
                }
              }
            });
            const setArray = new Set();
            const filteredArr = allQuestions.filter((el) => {
              const duplicate = setArray.has(el.id);
              setArray.add(el.id);
              return !duplicate;
            });
            return filteredArr;
            // return allQuestions;
          }
        })
      );
  }
  saveEvaluation(QuestionsAnswered) {
    return this.http.post(
      UPSERT_Eval,
      QuestionsAnswered,
      this.commonService.logger(
        "Answers",
        "get questions",
        "Training program Questions",
        "",
        ""
      )
    );
  }
  saveOfflineEvaluation(QuestionsAnswered) {
    return this.http.post(
      UPSERT_EvalOffline,
      QuestionsAnswered,
      this.commonService.logger(
        "Answers",
        "get questions",
        "Training program Questions",
        "",
        ""
      )
    );
  }
  GetEmployeeListForHODFeedback(Training_ID, hodemployeeid): Observable<any[]> {
    let body = {
      Training_ID: Training_ID,
      hodemployeeid: hodemployeeid,
    };
    return this.http.post<any[]>(
      getEmployeeListForHODFeedback,
      body,
      this.commonService.logger(
        "Remarks",
        "get Employee list for remarks",
        "Hod Feedback",
        "",
        ""
      )
    );
  }

  UpdateUpdateHODRemarks(employeeRemarks) {
    return this.http.post(
      updateUpdateHODRemarks,
      employeeRemarks,
      this.commonService.logger(
        "Remarks",
        "get Employee list for remarks",
        "Hod Feedback",
        "",
        ""
      )
    );
  }

  UpdateUpdateHRRemarks(employeeRemarks) {
    return this.http.post(
      UpdateUpdateHRRemarks,
      employeeRemarks,
      this.commonService.logger(
        "Remarks",
        "get Employee list for remarks",
        "Hod Feedback",
        "",
        ""
      )
    );
  }
}
