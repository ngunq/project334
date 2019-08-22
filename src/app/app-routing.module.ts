import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { LoginComponent } from "./pages/login/login.component";
import { MenuComponent } from "./pages/menu/menu.component";
import { ReportComponent } from "./pages/report/report.component";
import { SuppliesComponent } from "./pages/supplies/supplies.component";
import { CostComponent } from "./pages/cost/cost.component";
import { CancelListComponent } from "./pages/cancel-list/cancel-list.component";
import { TableDetailComponent } from "./pages/table-management/table-detail/table-detail.component";
import { TableManagementComponent } from "./pages/table-management/table-management.component";

const routes: Routes = [
  {
    path: "",
    // redirectTo: "login",
    redirectTo: "table-management",
    pathMatch: "full"
  },
  {
    path: "menu",
    component: MenuComponent,
  },
  {
    path: "supplies",
    component: SuppliesComponent,
  },
  {
    path: "table-management",
    component: TableManagementComponent,
  },
  {
    path: "table-detail/:id",
    component: TableDetailComponent,
  },
  {
    path: "table-detail/:ngunq/:id",
    component: TableDetailComponent,
  },
  {
    path: "report",
    component: ReportComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "cost",
    component: CostComponent,
  },
  {
    path: "cancel-list",
    component: CancelListComponent,
  },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
