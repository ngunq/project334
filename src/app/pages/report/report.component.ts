import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from "../../services/data.service";
import { TableInterface } from "../../interfaces";
import { FormControl } from '@angular/forms';
import  moment from "moment";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class ReportComponent implements OnInit {
  dataSource: MatTableDataSource<TableInterface>;
  date = new FormControl(moment()["_d"]);
  // dataSource = ELEMENT_DATA;
  columnsToDisplay = ['order_time', 'name', 'note', 'sale_off', 'extra_cost', 'originTotal', 'total', 'profit'];
  columnName = {
    order_time: "Thời gian",
    name: "Tên bàn",
    note: "Ghi chú",
    sale_off: "Giảm giá",
    extra_cost: "Phụ thu",
    originTotal: "Tổng giá gốc",
    total: "Tổng thu nhập",
    profit: "Lợi nhuận",
  }
  expandedElement: TableInterface | null;
  meals = [];
  supplies = [];
  revenue = 0;
  profit = 0;
  exportData = []
  ddd = moment().format("YYYY-MM-DD");
  dateRange = {startDate: moment(), endDate: moment()}

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private data: DataService) {
    data.setActiveRoute("report");
    this.data.getSupplies().subscribe(res => {
      this.supplies = res;
      this.data.getMeals().subscribe(res => {
        this.meals = res;
        this.getData(this.dateRange)
      })
    })

  }

  getData(d) {
    this.revenue = 0;
    this.profit = 0;
    const from = d.startDate.format("YYYY-MM-DD");
    const to = d.endDate.format("YYYY-MM-DD");
    this.data.getReport(from, to).subscribe(res => {
      // console.log(res)
      const tmp = res.map((e: any) => {
        e.total = 0;
        e.originTotal = 0;
        e.mealList = e.meals.split(",").map(m => {
          let ngunq = m.split("-");
          let originPrice = 0;
          let nha = this.findQuantityById(ngunq[0]);
          if (nha) {
            nha.split(",").map(q => {
              let dd = q.split("-");
              originPrice += this.findSupplyById(dd[0]) ? this.findSupplyById(dd[0]).price : 0 * dd[1];
              e.originTotal += originPrice * ngunq[1];
            });
          }
          // this.findQuantityById(ngunq[0]).split(",").map(q => {
          //   let dd = q.split("-");
          //   originPrice += this.findSupplyById(dd[0]) ? this.findSupplyById(dd[0]).price : 0 * dd[1];
          //   e.originTotal += originPrice * ngunq[1];
          // });
          let a = ngunq[1] ? ngunq[1] : 0;
          let b = this.findPriceById(ngunq[0]) ? this.findPriceById(ngunq[0]) : 0
          let total = a * b;
          e.total += total;
          // console.log(e.total)
          return {
            name: this.findMealById(ngunq[0]),
            amount: ngunq[1],
            originPrice: originPrice,
            price: this.findPriceById(ngunq[0]),
            total: total
          }
        })
        e.total = this.calcLastTotal(e.total, e.sale_off, e.extra_cost);
        this.revenue += e.total;
        e.profit = e.total - e.originTotal;
        this.profit += e.profit;
        return e;
      })
      // console.log(tmp)
      this.exportData = tmp;
      this.dataSource = new MatTableDataSource(tmp);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    })
  }

  ngOnInit() {
  }

  calcLastTotal(total, sale, extra) {
    return total - (total * sale / 100) + (total * extra / 100);
  }

  findSupplyById(id) {
    for (let i = 0; i < this.supplies.length; i++) {
      if (this.supplies[i].id === id) {
        return this.supplies[i];
      }
    }
  }

  findMealById(id) {
    for (let i = 0; i < this.meals.length; i++) {
      if (this.meals[i].id === id) {
        return this.meals[i].name;
      }
    }
  }

  findQuantityById(id) {
    for (let i = 0; i < this.meals.length; i++) {
      if (this.meals[i].id === id) {
        return this.meals[i].quantity;
      }
    }
  }

  findPriceById(id) {
    for (let i = 0; i < this.meals.length; i++) {
      if (this.meals[i].id === id) {
        return this.meals[i].price;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeDate(d) {
    this.ddd = moment(d).format("YYYY-MM-DD");
    this.getData(moment(d).format("YYYY-MM-DD"))
  }

  change(e) {
    console.log(e)
    this.dateRange = e;
    this.getData(e);
  }

  fnExcelReport(table) {
    var name = `Thống kê ngày ${this.ddd}`
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML, download: name }
      window.location.href = uri + base64(format(template, ctx))
  }
}
