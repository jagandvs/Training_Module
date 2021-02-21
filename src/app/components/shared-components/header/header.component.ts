import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/_services/authentication.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  public user: string;
  constructor(
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.user = currentUser.user.UM_USERNAME;

    console.log(this.user);
  }

  logout() {
    this.authenticationService.logout();
  }
}
