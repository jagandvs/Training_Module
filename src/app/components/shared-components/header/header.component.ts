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
  public collapsed = false;
  public submenuMasters = false;
  public submenuTransactions = false;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.user = currentUser.user.UM_USERNAME;
  }

  logout() {
    this.authenticationService.logout();
  }
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
  toggleSubmenuMasters() {
    this.submenuMasters = !this.submenuMasters;
  }
  toggleSubmenuTransactions() {
    this.submenuTransactions = !this.submenuTransactions;
  }
}
