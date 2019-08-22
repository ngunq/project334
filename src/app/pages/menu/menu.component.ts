import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from "../../services/data.service";
import { MealInterface } from "../../interfaces";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'action'];
  dataSource: MatTableDataSource<MealInterface>;
  addMeal: boolean = false;
  editMeal: boolean = false;
  id: number;
  name: string;
  price: number;
  quantity: string;
  supplies = [];
  meals = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private data: DataService) {
    data.setActiveRoute("menu");
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource([]);
    this.data.getSupplies().subscribe(response => {
      this.supplies = response;

      this.data.getMeals().subscribe(res => {
        this.meals = res;
        const tmp = res.map(e => {
          if (e.quantity) {
            e.quantityText = e.quantity.split(",").map(q => {
              let ngunq = q.split("-");
              return `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
            }).join(", ");
            //  `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
          }
          return e;
        })
        this.dataSource = new MatTableDataSource(tmp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    });

  }

  ngOnInit() {

  }

  findSupplyById(id) {
    for (let i = 0; i < this.supplies.length; i++) {
      if (this.supplies[i].id === id) {
        return this.supplies[i].name;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  toggleAddMeal() {
    this.editMeal = false;
    this.addMeal = !this.addMeal;
  }

  toggleEditMeal(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.addMeal = false;
    this.editMeal = true;
  }

  addNewData(data) {
    this.meals.push(data);
    const tmp = this.meals.map(e => {
      if (e.quantity) {
        let ngunq = e.quantity.split("-");
        e.quantityText = `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
      }
      return e;
    })
    this.dataSource = new MatTableDataSource(tmp);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateData(data) {
    // const tmp = this.meals.map(e => {
    //   if (e.id === data.id) e = data;
    //   if (e.quantity) {
    //     let ngunq = e.quantity.split("-");
    //     e.quantityText = `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
    //   }
    //   return e;
    // })
    const tmp = this.meals.map(e => {
      if (e.id === data.id) e = data;
      if (e.quantity) {
        e.quantityText = e.quantity.split(",").map(q => {
          let ngunq = q.split("-");
          return `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
        }).join(", ");
        //  `${this.findSupplyById(ngunq[0])}: ${ngunq[1]}`
      }
      return e;
    })
    this.meals = tmp;
    this.dataSource = new MatTableDataSource(tmp);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
