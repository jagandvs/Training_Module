var currentUser = JSON.parse(localStorage.getItem("currentUser"));
export const UM_NAME = currentUser?.user.UM_NAME;
export const UM_CODE = currentUser?.user.UM_CODE;
export const CM_CODE = currentUser?.companyDetails.CM_CODE;
export const CM_NAME = currentUser?.companyDetails.CM_NAME;
export const CM_ID = currentUser?.companyDetails.CM_ID;
