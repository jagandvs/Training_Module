import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CalenderviewComponent } from "./calenderview/calenderview.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./_guards/auth.guard";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "calender", component: CalenderviewComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "administrator",
    loadChildren: () =>
      import("./components/administrator/administrator.module").then(
        (mod) => mod.AdministratorModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "masters",
    loadChildren: () =>
      import("./components/masters/masters.module").then(
        (mod) => mod.MastersModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "transactions",
    loadChildren: () =>
      import("./components/transactions/transactions.module").then(
        (mod) => mod.TransactionsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./components/reports/reports.module").then(
        (mod) => mod.ReportsModule
      ),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
