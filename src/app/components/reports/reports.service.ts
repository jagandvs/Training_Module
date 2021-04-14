import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/_services/common.service";
import {
  getEmployeeHistoryCard,
  httpOptions,
  getEmployeeHistoryCardofEmployee,
  getpresentskills,
  getTrainingNeedsAndCalender,
} from "src/app/_helper/navigation-urls";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  getEmployeeHistory(fromdate, todate): Observable<any[]> {
    let body = {
      fromdate: fromdate,
      todate: todate,
    };
    return this.http.post<any[]>(getEmployeeHistoryCard, body, httpOptions);
  }

  getEmployeeHistoryCardofEmployee(empid): Observable<any[]> {
    let body = {
      empid: empid,
    };
    return this.http.post<any[]>(
      getEmployeeHistoryCardofEmployee,
      body,
      httpOptions
    );
  }

  getpresentskills(EmpType): Observable<any[]> {
    let body = {
      EmpType: EmpType,
    };
    return this.http.post<any[]>(getpresentskills, body, httpOptions);
  }

  getTrainingNeedsAndCalender(EmpType, Depid, AllDep, url): Observable<any[]> {
    let body = {
      EmpType: EmpType,
      Depid: Depid,
      AllDep: AllDep,
    };
    console.log(body);
    return this.http.post<any[]>(
      getTrainingNeedsAndCalender + url,
      body,
      httpOptions
    );
  }
}
