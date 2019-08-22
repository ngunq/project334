import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from "../../services/data.service";
import { TableInterface } from "../../interfaces";
import { FormControl } from '@angular/forms';
import * as moment from "moment";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cancel-list',
  templateUrl: './cancel-list.component.html',
  styleUrls: ['./cancel-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class CancelListComponent implements OnInit {
  dataSource: MatTableDataSource<TableInterface>;
  columnsToDisplay = ['order_time', 'cancel_time', 'name', 'note', 'sale_off', 'extra_cost', 'total', 'profit'];
  columnName = {
    order_time: "T.Gian Order",
    cancel_time: "T.Gian Hủy",
    name: "Tên",
    note: "Ghi chú",
    sale_off: "G.Giá",
    extra_cost: "P.Thu",
    total: "Tổng HĐ",
    profit: "Lợi nhuận",
  }
  expandedElement: TableInterface | null;
  meals = [];
  supplies = [];

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private data: DataService) {
    data.setActiveRoute("cancel-list");
    this.data.getSupplies().subscribe(res => {
      this.supplies = res;
      this.data.getMeals().subscribe(res => {
        this.meals = res;
        this.getData()
      })
    })

  }

  getData() {
    this.data.getCancelTables().subscribe(res => {
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
          return {
            name: this.findMealById(ngunq[0]),
            amount: ngunq[1],
            originPrice: originPrice,
            price: this.findPriceById(ngunq[0]),
            total: total
          }
        })
        e.total = this.calcLastTotal(e.total, e.sale_off, e.extra_cost);
        e.profit = e.total - e.originTotal;
        return e;
      })
      console.log(tmp)
      // console.log(tmp)
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

}
