import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.css']
})
export class EditMealComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() name: string;
  @Input() price: number;
  @Input() quantity: string;
  @Output() refresh = new EventEmitter<any>();
  supply: string;
  quantityValue = [];

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

  ngOnChanges() {
    this.quantityValue = [];
    this.quantity.split(",").forEach(e => {
      if(e !== "") {
      let ngunq = e.split("-");
      this.quantityValue.push({supply: ngunq[0], value: ngunq[1]})
      }
    })
    // this.supply = (ngunq[0]);
    // this.quantityValue = parseInt(ngunq[1]);
  }

  updateMeal() {
    if (this.name && this.price) {
      // let quantity = `${this.findSupplyById(this.supply)}: ${this.quantity}(g)`
      let quantity = this.quantityValue.map((e:any) => {
        if (e.supply === "")
          return ``;
        return `${e.supply}-${e.value}`
      }).join(",");
      // let quantity = `${this.supply}-${this.quantityValue}`
      this.data.updateMeal({ id: this.id, name: this.name, price: this.price, quantity: quantity }).subscribe(res => {
        if (res.id) {
          this.refresh.emit(res);
          this.openSnackBar("Sửa thành công !");
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      });
    }
  }

  addQuantity() {
    this.quantityValue.push({
      supply: "",
      value: 1
    });
  }

  cancelQuantity(i) {
    this.quantityValue.splice(i, 1);
  }

  findPriceById(id) {
    for (let i = 0; i < this.supplies.length; i++) {
      if (this.supplies[i].id === id) {
        return this.supplies[i].price;
      }
    }
    return null;
  }

  calcOriginPrice() {
    let sum = 0;
    this.quantityValue.forEach(e => {
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
