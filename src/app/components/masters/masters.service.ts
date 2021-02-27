import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/_services/common.service";
import { MASTERS } from "src/app/_helper/navigation-urls";
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
}
