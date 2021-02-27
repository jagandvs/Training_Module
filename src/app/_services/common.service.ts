import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  deleteRow,
  getCompanyDetails,
  httpLogin,
  httpOptions,
  setResetModify,
  SP_CM_FillCombo,
  TableResponse,
  userRight,
} from "../_helper/navigation-urls";
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

  getTableResponse(
    fieldNames: string,
    tableNames: string,
    condition: string
  ): Observable<any[]> {
    let body = {
      fieldNames: fieldNames,
      tableNames: tableNames,
      condition: condition,
    };
    return this.http.post<any[]>(TableResponse, body, httpLogin);
  }
  setResetModify(
    TableName: string,
    ModField: string,
    codeField: string,
    codeVal: number,
    MODIFY: number,
    process: string
  ) {
    let body = {
      TableName: TableName,
      ModField: ModField,
      codeField: codeField,
      codeVal: codeVal,
      MODIFY: MODIFY,
      process: process,
    };
    return this.http.post(setResetModify, body, httpOptions);
  }

  deleteRow(
    PK_CODE: string,
    PK_FIELD: string,
    ES_DELETE: string,
    DELETE: string,
    TABLE_NAME: string
  ) {
    let body = {
      PK_CODE: PK_CODE.toString(),
      PK_FIELD: PK_FIELD,
      ES_DELETE: ES_DELETE,
      DELETE: DELETE,
      TABLE_NAME: TABLE_NAME,
    };
    return this.http.post(
      deleteRow,
      body,
      this.logger(TABLE_NAME, "delete", TABLE_NAME, "", PK_CODE)
    );
  }

  checkRight(UR_UM_CODE: number, UR_SM_CODE: number, PROCESS: string) {
    var body = {
      UR_UM_CODE: UR_UM_CODE,
      UR_SM_CODE: UR_SM_CODE,
      PROCESS: PROCESS,
    };
    return this.http
      .post<any>(
        userRight,
        body,
        this.logger(
          "User Right",
          "Check Rights",
          "User rights",
          "User rights",
          UR_UM_CODE
        )
      )
      .pipe(
        map((userRightsData) => {
          var access = userRightsData[0].UR_RIGHTS.split("");
          return [
            {
              SM_NAME: userRightsData[0].SM_NAME,
              UR_SM_CODE: userRightsData[0].UR_SM_CODE,
              MENU: access[0] == 1,
              VIEW: access[1] == 1,
              UPDATE: access[2] == 1,
              ADD: access[3] == 1,
              DELETE: access[4] == 1,
              PRINT: access[5] == 1,
              BACK_DATE: access[6] == 1,
            },
          ];
        })
      );
  }

  FillCombo(DropDownQuery: any): Observable<any[]> {
    return this.http.post<any[]>(SP_CM_FillCombo, DropDownQuery, httpOptions);
  }
}
