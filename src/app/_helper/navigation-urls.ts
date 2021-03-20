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

// Masters

export const MASTERS = ApiURL + "masters/";

// Transactions

export const TRANSACTIONS = ApiURL + "transactions/";
export const INSERT_QUESTION_BANK =
  ApiURL + "transactions/INSERT_UPSERT_QuestionBank";
export const INSERT_EMPLOYEE_MASTER =
  ApiURL + "transactions/INSERT_UPSERT_EmployeeMaster";
export const INSERT_TRAINING_NEEDS =
  ApiURL + "transactions/INSERT_UPSERT_TrainingNeedsMaster";
export const INSERT_UPSERT_TRAININGPROGRAM_MASTER =
  ApiURL + "transactions/INSERT_UPSERT_TRAININGPROGRAM_MASTER";

export const getEmployeeList = ApiURL + "transactions/getEmployeeList";

export const getEmployeeListForApproval =
  ApiURL + "transactions/getEmployeeListForApproval";

export const UpdateApproval = ApiURL + "transactions/UpdateApproval";

export const getEmployeeListForAttendance =
  ApiURL + "transactions/getEmployeeListForAttendance";

export const UpdateAttendance = ApiURL + "transactions/UpdateAttendance";
// common routes
export const setResetModify = ApiURL + "common/setResetModify";
export const deleteRow = ApiURL + "common/deleteRow";
export const SP_CM_FillCombo = ApiURL + "common/SP_CM_FillCombo";
export const TableResponse = ApiURL + "common/TableResponse";
export const uploadFiles = ApiURL + "common/upload";
export const getListFiles = ApiURL + "common/getListFiles";
export const deleteFile = ApiURL + "common/deleteFile";
export const downloadFile = ApiURL + "common/downloadFile";

// Login Routes
export const getCompanyDetails = ApiURL + "auth/getCompanyDetails";
export const login = ApiURL + "auth/signin";
export const getUserEmployeeCode = ApiURL + "auth/getUserEmployeeCode";
