export class USER_MASTER {
    constructor(

        public UM_CODE: number,
        public UM_CM_ID: number,
        public UM_DM_CODE: number,
        public UM_EM_CODE: number,
        public UM_USERNAME: string,
        public UM_PASSWORD: string,
        public UM_LEVEL: string,
        public UM_LASTLOGIN_DATETIME: Date,
        public UM_IP_ADDRESS: string,
        public IS_ACTIVE: boolean,
        public UM_EMAIL_SEND: boolean,
        public UM_LOGIN_FLAG: boolean,
        public ES_DELETE: boolean,
        public MODIFY: boolean,
        public UM_IS_ADMIN: boolean,
        public UM_NAME: string,
        public UM_EMAIL: string
    ) { }
}
