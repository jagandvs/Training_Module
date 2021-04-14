import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/_services/common.service";
import {
  deleteFile,
  downloadFile,
  getListFiles,
  httpOptions,
  INSERT_EMPLOYEE_MASTER,
  MASTERS,
  TRANSACTIONS,
  uploadFiles,
} from "src/app/_helper/navigation-urls";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class MastersService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  CRUDMasters(route: string, values: any, process: string): Observable<any> {
    let body = [values, { process: process }];

    return this.http.post(
      MASTERS + route,
      body,
      this.commonService.logger(route, process, "", "", "")
    );
  }

  // Http API REQUEST FOR EMPLOYEE MASTER
  UPSERT_EmployeeMaster(
    url: string,
    process: string,
    EMP_MASTER_ID: number
  ): Observable<any[]> {
    let body = {
      process: process,
      EMP_MASTER_ID: EMP_MASTER_ID,
    };
    return this.http.post<any[]>(MASTERS + url, body, httpOptions);
  }

  INSERT_UPSERT_EmployeeMaster(masterForm, detailForm, process, userId) {
    let body = [
      masterForm,
      detailForm,
      { process: process },
      { userId: userId },
    ];
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
}
