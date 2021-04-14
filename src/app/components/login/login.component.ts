import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { CommonService } from "src/app/_services/common.service";
import { USER_MASTER } from "../../model/USER_MASTER";
import { COMPANY_MASTER } from "../../model/COMPANY_MASTER";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public submitted: boolean = false;
  public isLoading: boolean = false;

  public button: string = "LOGIN";

  public returnUrl: string = "";
  public errorMessage: string = "";
  public currentUser: USER_MASTER;
  public companyMasterDetails: COMPANY_MASTER[];
  public companyNames: COMPANY_MASTER[];
  public currentFinacialYear: number;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) {
    this.commonService
      .getCompanyDetails("*", "COMPANY_MASTER", "CM_ACTIVE_IND=1")
      .subscribe((data) => {
        console.log(data);
        this.companyMasterDetails = data;
        this.companyNames = [
          ...new Map(
            this.companyMasterDetails.map((item, key) => [item[key], item])
          ).values(),
        ];
        let todayDate = new Date();
        this.f.financialYear.setValue(this.companyMasterDetails[0].CM_CODE);
        // this.companyMasterDetails.filter((detail) => {
        //   if (
        //     new Date(detail.CM_OPENING_DATE).getTime() < todayDate.getTime()
        //   ) {
        //     this.f.financialYear.setValue(detail.CM_CODE);
        //   }
        // });
      });
  }

  ngOnInit(): void {
    // Login form initialization
    this.loginForm = this.formBuilder.group({
      companyName: [1, Validators.required],
      financialYear: [0, Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
  }

  // Get Control Over the form
  get f() {
    return this.loginForm.controls;
  }

  //  Handle form submission
  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    this.button = "Please Wait..";
    this.errorMessage = "";
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill all details";
      this.button = "Login";
      this.isLoading = false;
      return;
    }
    this.authenticationService
      .login(
        this.f.username.value,
        this.f.password.value,
        this.f.financialYear.value
      )
      .subscribe(
        (data) => {
          if (data) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = "Invalid username/password";
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error.error;
          this.isLoading = false;
          this.button = "Login";
        }
      );
  }
}
