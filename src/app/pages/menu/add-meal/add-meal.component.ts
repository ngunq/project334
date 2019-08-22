import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})
export class AddMealComponent implements OnInit {
  @Output() refresh = new EventEmitter<any>();
  name: string;
  price: number;
  supply = [];
  quantity = [];
  supplies = [];

  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.data.getSupplies().subscribe(res => {
      this.supplies = res;
    });
  }

  addMeal() {
    if (this.name && this.price) {
      // let quantity = `${this.findSupplyById(this.supply)}: ${this.quantity}(g)`
      let quantity = this.quantity.map((e: any) => {
        if (e.supply === "")
          return ``;
        return `${e.supply}-${e.value}`
      }).join(",");
      // let quantity = `${this.supply}-${this.quantity}`
      this.data.addMeal({ name: this.name, price: this.price, quantity: quantity }).subscribe(res => {
        if (res.id) {
          this.refresh.emit(res);
          this.openSnackBar("Thêm thành công !");
          this.name = null;
          this.price = null;
          this.supply = null;
          this.quantity = null;
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      });
    }
  }

  findPriceById(id) {
    for (let i = 0; i < this.supplies.length; i++) {
      if (this.supplies[i].id === id) {
        return this.supplies[i].price;
      }
    }
    return null;
  }

  addQuantity() {
    this.quantity.push({
      supply: 0,
      value: 1
    });
  }

  cancelQuantity(i) {
    this.quantity.splice(i, 1);
  }

  calcOriginPrice() {
    let sum = 0;
    this.quantity.forEach(e => {
      let ngunq = this.findPriceById(e.supply)
      if (ngunq) {
        sum += e.value * ngunq;
      }
    })
    return sum;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
