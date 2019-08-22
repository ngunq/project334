import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../../services/data.service";
import { TableInterface } from "../../../interfaces";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss']
})
export class TableDetailComponent implements OnInit, OnDestroy {
  order_id: string;
  abc: string;
  availble: boolean;
  meals = [];
  supplies = [];
  table: TableInterface = {
    order_id: "",
    order_time: "",
    name: "",
    note: "",
    meals: "",
    sale_off: 0,
    extra_cost: 0,
    status: 0,
    paid: 0,
  };
  action = "back";
  meals_order = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private data: DataService
  ) {
    this.order_id = this.route.snapshot.params['id'];
    this.abc = this.route.snapshot.params['ngunq'];
  }

  ngOnInit() {
    this.data.getMeals().subscribe(res => {
      this.meals = res;
      this.data.getSupplies().subscribe(res => {
        this.supplies = res;
        if (!this.abc) {
          this.data.getTable(this.order_id).subscribe((res: any) => {
            if (res.availble) {
              this.availble = true;
            } else {
              let ngunq = res.meals.split(",");
              ngunq.forEach(e => {
                let tmp = e.split("-");
                if (tmp[0] !== "") {
                  this.meals_order.push({ id: tmp[0], amount: tmp[1] })
                }
              })
              this.table = res;
            }
          })
        } else {
          this.data.getPaidTable(this.order_id, this.abc).subscribe((res: any) => {
            if (res.availble) {
              this.availble = true;
            } else {
              let ngunq = res.meals.split(",");
              ngunq.forEach(e => {
                let tmp = e.split("-");
                if (tmp[0] !== "") {
                  this.meals_order.push({ id: tmp[0], amount: tmp[1] })
                }
              })
              this.meals_order.forEach(e => {
                this.findQuantityById(e.id).split(",").forEach(q => {
                  let ngunq = q.split("-")
                  let supply = this.findSupplyById(ngunq[0]);
                  if (supply) {
                    let afterBalance = parseFloat(supply.balance) + (e.amount * ngunq[1]);
                    supply.balance = afterBalance;
                    this.data.updateSupply(supply).subscribe(res => {
                      if (res.id) {
                        this.openSnackBar("Cập nhật kho thành công !");
                      } else {
                        this.openSnackBar("Lỗi cmnr !");
                      }
                    });
                  }
                });
              })
              this.table = res;
            }

          })
        }
      })
    })
  }

  ngOnDestroy() {
    if (this.abc) {
      if (this.action === "back" || this.action === "pay") {
        console.log(this.action);

        this.meals_order.forEach(e => {
          this.findQuantityById(e.id).split(",").forEach(q => {
            let ngunq = q.split("-")
            let supply = this.findSupplyById(ngunq[0]);
            if (supply) {
              let afterBalance = supply.balance - (e.amount * ngunq[1]);
              supply.balance = afterBalance;
              this.data.updateSupply(supply).subscribe(res => {
                if (res.id) {
                  this.openSnackBar("Cập nhật kho thành công !");
                } else {
                  this.openSnackBar("Lỗi cmnr !");
                }
              });
            }
          });
        })
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

  findPriceById(id) {
    for (let i = 0; i < this.meals.length; i++) {
      if (this.meals[i].id === id) {
        return this.meals[i].price;
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

  findSupplyById(id) {
    for (let i = 0; i < this.supplies.length; i++) {
      if (this.supplies[i].id === id) {
        return this.supplies[i];
      }
    }
  }

  calcTotalPriceById(id, amount) {
    return this.findPriceById(id) * amount;
  }

  calcTotalBill() {
    let sum = 0;
    this.meals_order.forEach(e => {
      if (e.id !== "") {
        sum += this.calcTotalPriceById(e.id, e.amount);
      }
    })
    return sum;
  }

  calcRating(rate) {
    return this.calcTotalBill() * rate / 100;
  }

  calcRealBill() {
    return this.calcTotalBill() - this.calcRating(this.table.sale_off) + this.calcRating(this.table.extra_cost);
  }

  getLeaveTime() {
    let current_datetime = new Date();
    let month = (current_datetime.getMonth() + 1) < 10 ? "0" + (current_datetime.getMonth() + 1) : (current_datetime.getMonth() + 1);
    let day = current_datetime.getDate() < 10 ? "0" + current_datetime.getDate() : current_datetime.getDate();
    let formatted_date = day + "/" + month + "/" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
    return formatted_date;
  }

  addMeal() {
    this.meals_order.push({
      id: "",
      amount: 1,
    })
  }

  cancelMeal(i) {
    this.meals_order.splice(i, 1);
  }

  confirm() {
    this.action = "confirm";
    let meals = this.meals_order.map(e => {
      if (e.id === "")
        return ``;
      return `${e.id}-${e.amount}`
    }).join(",");
    if (this.availble) {
      this.data.addTable({ order_id: this.order_id, name: `Bàn ${this.order_id}`, note: this.table.note, meals: meals, sale_off: this.table.sale_off, extra_cost: this.table.extra_cost, status: 0 }).subscribe((res: any) => {
        if (res.order_id) {
          this.openSnackBar("Thêm thành công !");
          this.router.navigate(["/table-management"])
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      }, error => {
        this.openSnackBar("Lỗi cmnr !");
      })
    } else {
      this.data.updateTable({ order_id: this.order_id, name: this.table.name, note: this.table.note, order_time: this.table.order_time, meals: meals, sale_off: this.table.sale_off, extra_cost: this.table.extra_cost, status: 0, paid: 0 }).subscribe((res: any) => {
        if (res.order_id) {
          this.openSnackBar("Thêm thành công !");
          this.router.navigate(["/table-management"])
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      }, error => {
        this.openSnackBar("Lỗi cmnr !");
      })
    }
  }

  cancelOrder() {
    this.action = "cancel"
    let meals = this.meals_order.map(e => {
      if (e.id === "")
        return ``;
      return `${e.id}-${e.amount}`
    }).join(",");
    if (!this.availble && confirm("Chắc chưa đkm ?")) {
      // if (this.abc) {
      //   this.meals_order.forEach(e => {
      //     this.findQuantityById(e.id).split(",").forEach(q => {
      //       let ngunq = q.split("-")
      //       let supply = this.findSupplyById(ngunq[0]);
      //       if (supply) {
      //         let afterBalance = parseFloat(supply.balance) + (e.amount * ngunq[1]);
      //         supply.balance = afterBalance;
      //         this.data.updateSupply(supply).subscribe(res => {
      //           if (res.id) {
      //             this.openSnackBar("Cập nhật kho thành công !");
      //           } else {
      //             this.openSnackBar("Lỗi cmnr !");
      //           }
      //         });
      //       }
      //     });
      //   })
      // }
      this.data.updateTable({ order_id: this.order_id, name: this.table.name, order_time: this.table.order_time, note: this.table.note, meals: meals, sale_off: this.table.sale_off, extra_cost: this.table.extra_cost, status: 2, paid: 0 }).subscribe((res: any) => {
        if (res.order_id) {
          this.openSnackBar("Hủy thành công !");
          this.router.navigate(["/table-management"])
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      }, error => {
        this.openSnackBar("Lỗi cmnr !");
      })
    }
  }

  pay(update = true) {
    this.action = "pay";

    // if (confirm("Tính tiền ?")) {

    var mywindow = window.open('', 'new div', 'height=600,width=1000');
    // var printHandler = function (mql) {
    //   if (mql.matches) {
    //     console.log(new Date().getMilliseconds(), 'print');
    //   } else {
    //     console.log(new Date().getMilliseconds(), 'Not print');
    //   }
    // };

    // var mql = mywindow.matchMedia('print');
    // mql.addListener(printHandler);

    mywindow.document.write('<html><head>');
    mywindow.document.write('<style>body{margin-top: 0;}h4{margin-bottom: 0 auto 6px !important;} .print-container{ display: flex; flex-direction: column; align-items: center;}');
    mywindow.document.write('table{width: 100%; } td{text-align: center;} .sum-tr > th{padding-top: 8px; border-top: .5px #000 dashed;}');
    mywindow.document.write('.time{ display: flex; flex-direction: column; width: 100%; align-items: flex-end; padding-bottom: 10px;}');
    mywindow.document.write('</style></head><body>');
    // mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById("bill").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
    // setTimeout(function () { mywindow.close(); }, 1000);
    // console.log(mywindow.print())
    // setTimeout(function(){mywindow.print();},1000);
    // mywindow.print();

    if (update) {
      let meals = this.meals_order.map(e => {
        if (e.id === "")
          return ``;
        return `${e.id}-${e.amount}`
      }).join(",");
      if (!this.abc) {
        this.data.updateTable({ order_id: this.order_id, name: this.table.name, order_time: this.table.order_time, note: this.table.note, meals: meals, sale_off: this.table.sale_off, extra_cost: this.table.extra_cost, status: 1, paid: 1 }).subscribe((res: any) => {
          if (res.order_id) {
            this.openSnackBar("Thanh toán thành công !");
            this.meals_order.forEach(e => {
              this.findQuantityById(e.id).split(",").forEach(q => {
                let ngunq = q.split("-")
                let supply = this.findSupplyById(ngunq[0]);
                if (supply) {
                  let afterBalance = supply.balance - (e.amount * ngunq[1]);
                  supply.balance = afterBalance;
                  this.data.updateSupply(supply).subscribe(res => {
                    if (res.id) {
                      this.openSnackBar("Cập nhật kho thành công !");
                    } else {
                      this.openSnackBar("Lỗi cmnr !");
                    }
                  });
                }
              });
            })
            this.router.navigate(["/table-management"])
          } else {
            this.openSnackBar("Lỗi cmnr !");
          }
        }, error => {
          this.openSnackBar("Lỗi cmnr !");
        })
      } else {
        this.data.updatePaidTable({ order_id: this.order_id, name: this.table.name, note: this.table.note, meals: meals, sale_off: this.table.sale_off, extra_cost: this.table.extra_cost, order_time: this.table.order_time, status: 1, paid: 1 }).subscribe((res: any) => {
          if (res.order_id) {
            this.openSnackBar("Thanh toán thành công !");
            this.meals_order.forEach(e => {
              this.findQuantityById(e.id).split(",").forEach(q => {
                let ngunq = q.split("-")
                let supply = this.findSupplyById(ngunq[0]);
                if (supply) {
                  let afterBalance = supply.balance - (e.amount * ngunq[1]);
                  supply.balance = afterBalance;
                  this.data.updateSupply(supply).subscribe(res => {
                    if (res.id) {
                      this.openSnackBar("Cập nhật kho thành công !");
                    } else {
                      this.openSnackBar("Lỗi cmnr !");
                    }
                  });
                }
              });
            })
            this.router.navigate(["/table-management"])
          } else {
            this.openSnackBar("Lỗi cmnr !");
          }
        }, error => {
          this.openSnackBar("Lỗi cmnr !");
        })
      }
    }




    return true;
    // }

    // var mywindow = window.open('', 'new div', 'height=400,width=600');
    // mywindow.document.write('<html><head><title></title>');
    // mywindow.document.write('<style>h4{margin-bottom: 8px;} .print-container{display: flex; flex-direction: column; align-items: center; padding: 0 20px;}');
    // mywindow.document.write('table{width: 100%;} td{text-align: center;} .sum-tr > th{padding-top: 8px; font-size: 120%; border-top: .5px #000 dashed;}');
    // mywindow.document.write('.time{font-size:90%; display: flex; flex-direction: column; width: 100%; align-items: flex-end; padding-bottom: 10px;}');
    // mywindow.document.write('</style></head><body>');
    // mywindow.document.write(document.getElementById("bill").innerHTML);
    // mywindow.document.write('</body></html>');
    // mywindow.document.close();
    // mywindow.focus();
    // // setTimeout(function(){mywindow.print();},1000);
    // // mywindow.close();

    // return true;
  }

  goBack() {


    this.router.navigate(["/table-management"])
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
