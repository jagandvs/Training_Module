import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { getCompanyDetails, httpLogin } from "../_helper/navigation-urls";
@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}
  getCompanyDetails(
    fieldNames: string,
    tableNames: string,
    condition: string
  ): Observable<any> {
    let body = {
      fieldNames: fieldNames,
      tableNames: tableNames,
      condition: condition,
    };
    return this.http.post(getCompanyDetails, body, httpLogin);
  }

  logger(
    LG_SOURCE: string,
    LG_EVENT: string,
    LG_DOC_NO: string,
    LG_DOC_NAME: string,
    LG_DOC_CODE: any
  ) {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        LG_CM_CODE: currentUser.companyDetails.CM_CODE,
        LG_CM_COMP_ID: currentUser.companyDetails.CM_ID,
        LG_DATE: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        LG_SOURCE: LG_SOURCE,
        LG_EVENT: LG_EVENT,
        LG_COMP_NAME: currentUser.companyDetails.CM_NAME,
        LG_DOC_NO: LG_DOC_NO,
        LG_DOC_NAME: LG_DOC_NAME,
        LG_DOC_CODE: LG_DOC_CODE,
        LG_U_NAME: currentUser.user.UM_NAME,
        LG_U_CODE: currentUser.user.UM_CODE,
      }),
    };
    return httpOptions;
  }
}
