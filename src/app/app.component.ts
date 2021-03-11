import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BnNgIdleService } from "bn-ng-idle";
import { AuthenticationService } from "./_services/authentication.service";
import {
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
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
    private router: Router,
    private SpinnerService: NgxSpinnerService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }
  ngOnInit(): void {
    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && this.authenticationService.currentUserValue) {
        this.router.navigate(["logout"]);
      }
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.SpinnerService.show();
    }
    if (event instanceof NavigationEnd) {
      this.SpinnerService.hide();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.SpinnerService.hide();
    }
    if (event instanceof NavigationError) {
      this.SpinnerService.hide();
    }
  }
}
