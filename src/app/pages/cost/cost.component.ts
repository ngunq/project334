import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from "../../services/data.service";
import { CostInterface } from "../../interfaces";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from "moment";
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// var moment = require("moment")

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  styleUrls: ['./cost.component.css']
})
export class CostComponent implements OnInit {
  displayedColumns: string[] = ['log_date', 'name', 'value', 'status', 'action'];
  statusList = {
    0: "Chưa thanh toán",
    1: "Đã thanh toán"
  }
  dataSource: MatTableDataSource<CostInterface>;
  date = new FormControl(moment()["_d"]);
  addCost: boolean = false;
  editCost: boolean = false;
  id: string;
  log_date: string;
  name: string;
  value: number;
  status: number;
  checked = false;
  cost = [];
  unPaidCost = [];
  ddd = moment().format("YYYY-MM-DD");

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private data: DataService) {
    data.setActiveRoute("cost");
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource([]);

    this.getData(this.ddd)

  }

  getData(d) {
    this.data.getCosts(d).subscribe(res => {
      this.cost = res;
      this.showUnPay(d);
      // this.dataSource = new MatTableDataSource(this.cost);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
  }

  changeDate(d) {
    this.ddd = moment(d).format("YYYY-MM-DD")
    this.getData(this.ddd)
  }

  ngOnInit() {
  }

  getTotalCost() {
    let sum = 0;
    if (this.checked) {
      this.unPaidCost.forEach(e => {
        sum += parseInt(e.value);
      })
    } else {
      this.cost.forEach(e => {
        sum += parseInt(e.value);
      })
    }

    return sum;
  }

  showUnPay(d) {
    if (this.checked) {
      if(d === "") d = "Invalid date"
      this.data.getUnpaid(d).subscribe(res => {
        this.unPaidCost = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.dataSource = new MatTableDataSource(this.cost);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleAddMeal() {
    this.editCost = false;
    this.addCost = !this.addCost;
  }

  toggleEditCost(id, log_date, name, value, status) {
    this.id = id;
    this.log_date = log_date;
    this.name = name;
    this.value = value;
    this.status = status;
    this.addCost = false;
    this.editCost = true;
  }

  addNewData(data) {
    this.cost.push(data);
    this.showUnPay(this.ddd);
    // this.dataSource = new MatTableDataSource(this.cost);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  updateData(data) {
    this.cost = this.cost.map(e => {
      if (e.id === data.id) e = data;
      return e;
    })
    this.showUnPay(this.ddd);
    // this.dataSource = new MatTableDataSource(this.cost);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

}
