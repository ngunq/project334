import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-supply',
  templateUrl: './add-supply.component.html',
  styleUrls: ['./add-supply.component.scss']
})
export class AddSupplyComponent implements OnInit {
  @Output() refresh = new EventEmitter<any>();
  name: string;
  price: number;
  balance: number;
  type: number;
  types = [];
  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.data.getSupplyType().subscribe((res: any) => {
      this.types = res;
    })
  }

  ngOnInit() {
  }

  addSupply() {
    if (this.name && this.price && this.balance && this.type) {
      this.data.addSupply({ name: this.name, price: this.price, balance: this.balance, type: this.type }).subscribe(res => {
        if (res.id) {
          this.refresh.emit(res);
          this.openSnackBar("Thêm thành công !");
          this.name = null;
          this.price = null;
          this.balance = null;
          this.type = null;
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
