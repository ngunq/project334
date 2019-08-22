import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";
import * as Rank from "../../../assets/rank-defined.json";

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.scss']
})
export class TableManagementComponent implements OnInit {
  paidTables = [];
  extraTables = [];
  meals = [];
  rankDefined = Rank["default"];
  // {
  //   "silver": {
  //     "min": 0,
  //     "max": 100
  //   },
  //   "nova": {
  //     "min": 101,
  //     "max": 200
  //   },
  //   "mge": {
  //     "min": 201,
  //     "max": 400
  //   },
  //   "dmg": {
  //     "min": 401,
  //     "max": 800
  //   },
  //   "le": {
  //     "min": 801,
  //     "max": 1200
  //   },
  //   "smfc": {
  //     "min": 1201,
  //     "max": 1500
  //   },
  //   "ge": {
  //     "min": 1501,
  //     "max": 99999
  //   }
  // };
  fixedTables = {
    T1: true,
    T2: true,
    T3: true,
    T4: true,
    T5: true,
    T6: true,
    T7: true,
    T8: true,
    T9: true,
    T10: true,
  };
  addTable: boolean = false;
  constructor(
    private data: DataService,
    private rouuter: Router
  ) {
    data.setActiveRoute("table-management");
  }

  ngOnInit() {
    this.data.getMeals().subscribe(meals => {
      this.meals = meals;
      this.data.getTables().subscribe(res => {
        res.forEach((e: any, i) => {
          e.rank = this.getTableRank(e.meals);

          if (e.order_id.length > 2) {
            this.extraTables.push(e);
          } else {
            this.fixedTables[`T${e.order_id}`] = false;
          }
        })
      })
    })

    this.data.getPaidTables().subscribe(res => {
      this.paidTables = res;
    })
  }

  findPriceById(id) {
    for (let i = 0; i < this.meals.length; i++) {
      if (this.meals[i].id === id) {
        return this.meals[i].price;
      }
    }
  }

  getTableRank(mealList) {
    let sum = 0;
    let rank = "";
    mealList.split(",").forEach(e => {
      let ngunq = e.split("-");
      let price = this.findPriceById(ngunq[0]);
      sum += (price * ngunq[1])
    })

    Object.keys(this.rankDefined).forEach(e => {
      if (this.rankDefined[e].min * 1000 <= sum && this.rankDefined[e].max * 1000 >= sum) {
        rank = e;
      }
    })
    return rank;
  }

  toggleAddTable() {
    this.addTable = !this.addTable;
  }

  updateExtraTables(table) {
    this.extraTables.push(table);
    this.toggleAddTable();
  }

  navigator(id, order_time) {
    this.rouuter.navigate([`/table-detail/a/${id}`], { state: { order_time: order_time } })
  }
}
