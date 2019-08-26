import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MealInterface, SupplyInterface, TableInterface, CostInterface } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  activedRoute = "table-management";
  APIUrl = environment.APIUrl;
  username = environment.username;
  password = environment.password;
  showMenu = true;

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  };


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  getRankDefined() {
  }

  setActiveRoute(route) {
    this.activedRoute = route;
    this.showMenu = false;
  }

  checkLogin(user: string, pwd: string) {
    return user === this.username && pwd === this.password;
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  authentication() {
    const username = this.getCookie("@project_334_username");
    const password = this.getCookie("@project_334_password");

    if (username !== this.username || password !== this.password) {
      this.router.navigate(["/login"])
      return false;
    } else {
      return true;
    }
  }

  getMeals(): Observable<MealInterface[]> {

    if (this.authentication())
      return this.http.get<MealInterface[]>(`${this.APIUrl}/meals.php?action=get-list`);
  }

  getSupplies(): Observable<SupplyInterface[]> {
    if (this.authentication())
      return this.http.get<SupplyInterface[]>(`${this.APIUrl}/supplies.php?action=get-list`);
  }

  getSupplyType() {
    if (this.authentication())
      return this.http.get(`${this.APIUrl}/supplies.php?action=get-types`);
  }

  addMeal(data): Observable<MealInterface> {
    if (this.authentication())
      return this.http.post<MealInterface>(`${this.APIUrl}/meals.php?action=add-meal`,
        data);
  }

  updateMeal(data): Observable<MealInterface> {
    if (this.authentication())
      return this.http.post<MealInterface>(`${this.APIUrl}/meals.php?action=update-meal`,
        data);
  }

  addSupply(data): Observable<SupplyInterface> {
    if (this.authentication())
      return this.http.post<SupplyInterface>(`${this.APIUrl}/supplies.php?action=add-supply`,
        data);
  }

  updateSupply(data): Observable<SupplyInterface> {
    if (this.authentication())
      return this.http.post<SupplyInterface>(`${this.APIUrl}/supplies.php?action=update-supply`,
        data);
  }

  getTables(): Observable<TableInterface[]> {
    if (this.authentication())
      return this.http.get<TableInterface[]>(`${this.APIUrl}/tables.php?action=get-list`);
  }

  getPaidTables(): Observable<TableInterface[]> {
    if (this.authentication())
      return this.http.get<TableInterface[]>(`${this.APIUrl}/tables.php?action=get-paid-list`);
  }

  getCancelTables(): Observable<TableInterface[]> {
    if (this.authentication())
      return this.http.get<TableInterface[]>(`${this.APIUrl}/tables.php?action=get-cancel-list`);
  }

  getTable(id): Observable<TableInterface> {
    if (this.authentication())
      return this.http.get<TableInterface>(`${this.APIUrl}/tables.php?action=get-detail&id=${id}`);
  }

  getPaidTable(id, order_time): Observable<TableInterface> {
    if (this.authentication())
      return this.http.get<TableInterface>(`${this.APIUrl}/tables.php?action=get-paid-detail&id=${id}&order_time=${order_time}`);
  }

  addTable(data): Observable<TableInterface> {
    if (this.authentication())
      return this.http.post<TableInterface>(`${this.APIUrl}/tables.php?action=add-table`,
        data);
  }

  updateTable(data): Observable<TableInterface> {
    if (this.authentication())
      return this.http.post<TableInterface>(`${this.APIUrl}/tables.php?action=update-table`,
        data);
  }

  updatePaidTable(data): Observable<TableInterface> {
    if (this.authentication())
      return this.http.post<TableInterface>(`${this.APIUrl}/tables.php?action=update-paid-table`,
        data);
  }

  getReport(from, to): Observable<TableInterface[]> {
    if (this.authentication())
      return this.http.get<TableInterface[]>(`${this.APIUrl}/tables.php?action=get-report&from=${from}&to=${to}`);
  }

  getCosts(d): Observable<CostInterface[]> {
    if (this.authentication())
      return this.http.get<CostInterface[]>(`${this.APIUrl}/cost.php?action=get-list&date=${d}`);
  }

  getUnpaid(d): Observable<CostInterface[]> {
    if (this.authentication())
      return this.http.get<CostInterface[]>(`${this.APIUrl}/cost.php?action=get-unpaid&date=${d}`);
  }

  updateCost(data): Observable<CostInterface> {
    if (this.authentication())
      return this.http.post<CostInterface>(`${this.APIUrl}/cost.php?action=update-cost`,
        data);
  }

  addCost(data): Observable<CostInterface> {
    if (this.authentication())
      return this.http.post<CostInterface>(`${this.APIUrl}/cost.php?action=add-cost`,
        data);
  }
}
