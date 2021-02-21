import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BnNgIdleService } from "bn-ng-idle";
import { AuthenticationService } from "./_services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "training-module";
  constructor(
    private bnIdle: BnNgIdleService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && this.authenticationService.currentUserValue) {
        this.router.navigate(["logout"]);
      }
    });
  }
}
