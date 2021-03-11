import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
}
