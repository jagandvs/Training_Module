import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  getModule,
  getScreen,
  httpOptions,
  insertUserRights,
  UPSERT_USER_MASTER,
  userMaster,
  userRight,
} from "src/app/_helper/navigation-urls";
import { CommonService } from "src/app/_services/common.service";

@Injectable({
  providedIn: "root",
})
export class AdministratorService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  UPSERT_USER_MASTER(userForm: any, process: string): Observable<any> {
    let body = [userForm, { process: process }];
    return this.http.post<any>(
      UPSERT_USER_MASTER,
      body,
      this.commonService.logger("USER MASTER", process, "", "", "")
    );
  }

  userMaster(): Observable<any[]> {
    return this.http.get<any[]>(userMaster, httpOptions);
  }
  getModule(): Observable<any[]> {
    return this.http.get<any[]>(getModule, httpOptions);
  }
  getScreen(moduleNo: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${getScreen}?moduleNo=${moduleNo}`,
      httpOptions
    );
  }
  userRightShowAll(
    UR_UM_CODE: number,
    UR_SM_CODE: number,
    UR_RIGHTS: string,
    PROCESS: string,
    MOD_CODE: number
  ) {
    var body = {
      UR_UM_CODE: UR_UM_CODE,
      UR_SM_CODE: UR_SM_CODE,
      UR_RIGHTS: UR_RIGHTS,
      PROCESS: PROCESS,
      MOD_CODE: MOD_CODE,
    };
    var returnUserRightData: any[] = [];
    return this.http
      .post<any[]>(
        userRight,
        body,
        this.commonService.logger(
          "User Right",
          "show all",
          "User rights",
          "User rights",
          UR_UM_CODE
        )
      )
      .pipe(
        map((userRightsData) => {
          for (let userRight of userRightsData) {
            var access = userRight.UR_RIGHTS.split("");

            returnUserRightData.push({
              SM_NAME: userRight.SM_NAME,
              UR_SM_CODE: userRight.UR_SM_CODE,
              MENU: access[0] == 1,
              ADD: access[1] == 1,
              VIEW: access[2] == 1,
              UPDATE: access[3] == 1,
              DELETE: access[4] == 1,
              PRINT: access[5] == 1,
              BACK_DATE: access[6] == 1,
            });
          }
          return returnUserRightData;
        })
      );
  }
  userRightShow(
    UR_UM_CODE: number,
    UR_SM_CODE: number,
    UR_RIGHTS: string,
    PROCESS: string,
    MOD_CODE: number
  ) {
    var body = {
      UR_UM_CODE: UR_UM_CODE,
      UR_SM_CODE: UR_SM_CODE,
      UR_RIGHTS: UR_RIGHTS,
      PROCESS: PROCESS,
      MOD_CODE: MOD_CODE,
    };
    return this.http
      .post<any>(
        userRight,
        body,
        this.commonService.logger(
          "User Right",
          "show",
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
  insertUserRights(insertData: any[]): Observable<string> {
    var insertUserRightsData = insertData;
    return this.http.post<string>(
      insertUserRights,
      insertUserRightsData,
      this.commonService.logger(
        "Administrator",
        "insert",
        "User rights",
        "User rights",
        insertUserRightsData[0].UR_UM_CODE
      )
    );
  }
}
