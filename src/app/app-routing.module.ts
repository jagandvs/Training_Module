import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./_guards/auth.guard";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
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
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
