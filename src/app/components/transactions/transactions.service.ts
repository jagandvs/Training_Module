import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  INSERT_QUESTION_BANK,
  httpOptions,
  TRANSACTIONS,
  INSERT_EMPLOYEE_MASTER,
  INSERT_TRAINING_NEEDS,
} from "src/app/_helper/navigation-urls";
import { CommonService } from "src/app/_services/common.service";

@Injectable({
  providedIn: "root",
})
export class TransactionsService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

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
  UPSERT_EmployeeMaster(
    url: string,
    process: string,
    EMP_MASTER_ID: number
  ): Observable<any[]> {
    let body = {
      process: process,
      EMP_MASTER_ID: EMP_MASTER_ID,
    };
    return this.http.post<any[]>(TRANSACTIONS + url, body, httpOptions);
  }

  INSERT_UPSERT_EmployeeMaster(masterForm, detailForm, process) {
    let body = [masterForm, detailForm, { process: process }];
    return this.http.post<any>(
      INSERT_EMPLOYEE_MASTER,
      body,
      this.commonService.logger(
        "Employee Master",
        process,
        "Employee Master",
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
}
