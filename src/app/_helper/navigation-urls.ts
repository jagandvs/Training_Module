import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

export const ApiURL = environment.baseUrl;
export const httpLogin = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

export const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

// Administrator --- User Rights routes

export const userMaster = ApiURL + "administrator/userMaster";
export const getModule = ApiURL + "administrator/getModule";
export const getScreen = ApiURL + "administrator/getScreen";
export const userRight = ApiURL + "administrator/userRight";
export const insertUserRights = ApiURL + "administrator/insertUserRights";

//  --- USER MASTER ROUTES

export const UPSERT_USER_MASTER = ApiURL + "administrator/UPSERT_USER_MASTER";

export const MASTERS = ApiURL + "masters/";

// common routes
export const setResetModify = ApiURL + "common/setResetModify";
export const deleteRow = ApiURL + "common/deleteRow";
export const SP_CM_FillCombo = ApiURL + "common/SP_CM_FillCombo";
export const TableResponse = ApiURL + "common/TableResponse";

// Login Routes
export const getCompanyDetails = ApiURL + "auth/getCompanyDetails";
export const login = ApiURL + "auth/signin";
