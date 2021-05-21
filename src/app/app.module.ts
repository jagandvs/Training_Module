import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthenticationService } from "./_services/authentication.service";
import { CommonService } from "./_services/common.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JwtInterceptor } from "./_helper/JwtInterceptor";
import { LogoutComponent } from "./components/logout/logout.component";
import { AdministratorComponent } from "./components/administrator/administrator.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalenderviewComponent } from "./calenderview/calenderview.component";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins

  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    AdministratorComponent,
    CalenderviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FullCalendarModule,
  ],
  providers: [
    AuthenticationService,
    CommonService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
