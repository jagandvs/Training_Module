import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { USER_MASTER } from "../model/USER_MASTER";
import {
  getCompanyDetails,
  httpLogin,
  login,
} from "../_helper/navigation-urls";
import { CommonService } from "./common.service";
import { map } from "rxjs/operators";
import { COMPANY_MASTER } from "../model/COMPANY_MASTER";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<USER_MASTER>;
  public currentUser: Observable<USER_MASTER>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private commonService: CommonService
  ) {
    this.currentUserSubject = new BehaviorSubject<USER_MASTER>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): USER_MASTER {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, cm_code: string) {
    var httpsOptions = {
      headers: new HttpHeaders({
        LG_CM_CODE: cm_code,
        LG_CM_COMP_ID: "null",
        LG_DATE: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        LG_SOURCE: "login",
        LG_EVENT: "post",
        LG_COMP_NAME: "null",
        LG_DOC_NO: "null",
        LG_DOC_NAME: "User Login",
        LG_DOC_CODE: "null",
        LG_U_NAME: username,
        LG_U_CODE: "null",
      }),
    };
    return this.http
      .post<any>(
        login,
        {
          username: username,
          password: password,
          cm_code: cm_code,
        },
        httpsOptions
      )
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          sessionStorage.setItem("token", user.token);
          localStorage.setItem(
            "companyDetails",
            JSON.stringify(user.companyDetails)
          );
          this.currentUserSubject.next(user.user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }
  getCompanyDetails(): Observable<COMPANY_MASTER[]> {
    let body = { fieldNames: "*", tableNames: "COMPANY_MASTER", condition: "" };
    return this.http.post<COMPANY_MASTER[]>(getCompanyDetails, body, httpLogin);
  }

  isLoggedIn() {
    if (sessionStorage.getItem("token") === null) {
      return false;
    } else {
      return (
        sessionStorage.getItem("token") ===
        JSON.parse(localStorage.getItem("currentUser")).token
      );
    }
  }
}
