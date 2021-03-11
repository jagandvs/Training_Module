import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/_services/common.service";
import {
  httpOptions,
  INSERT_EMPLOYEE_MASTER,
  MASTERS,
  TRANSACTIONS,
} from "src/app/_helper/navigation-urls";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class MastersService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  CRUDMasters(route: string, values: any, process: string) {
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
}
