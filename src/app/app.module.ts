import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from '@angular/common/http';

import { FrenchDecimalPipe } from "./pipes/FrenchDecimalPipe";

import {
  MatTableModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatInputModule,
  MatSnackBarModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatCheckboxModule
} from "@angular/material";

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TableManagementComponent } from './pages/table-management/table-management.component';
import { TableElementComponent } from './pages/table-management/table-element/table-element.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AddMealComponent } from './pages/menu/add-meal/add-meal.component';
import { SuppliesComponent } from './pages/supplies/supplies.component';
import { AddSupplyComponent } from './pages/supplies/add-supply/add-supply.component';
import { EditSupplyComponent } from './pages/supplies/edit-supply/edit-supply.component';
import { EditMealComponent } from './pages/menu/edit-meal/edit-meal.component';
import { AddTableComponent } from './pages/table-management/add-table/add-table.component';
import { TableDetailComponent } from './pages/table-management/table-detail/table-detail.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ReportComponent } from './pages/report/report.component';
import { LoginComponent } from './pages/login/login.component';
import { CostComponent } from './pages/cost/cost.component';
import { AddCostComponent } from './pages/cost/add-cost/add-cost.component';
import { EditCostComponent } from './pages/cost/edit-cost/edit-cost.component';
import { CancelListComponent } from './pages/cancel-list/cancel-list.component';

const MAT_MODULE = [
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatInputModule,
  MatSnackBarModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSlideToggleModule
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableManagementComponent,
    TableElementComponent,
    MenuComponent,
    FrenchDecimalPipe,
    AddMealComponent,
    SuppliesComponent,
    AddSupplyComponent,
    EditSupplyComponent,
    EditMealComponent,
    AddTableComponent,
    TableDetailComponent,
    ReportComponent,
    LoginComponent,
    CostComponent,
    AddCostComponent,
    EditCostComponent,
    CancelListComponent,
  ],
  imports: [
    ...MAT_MODULE,
    BrowserModule,
    NgSelectModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),

    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
