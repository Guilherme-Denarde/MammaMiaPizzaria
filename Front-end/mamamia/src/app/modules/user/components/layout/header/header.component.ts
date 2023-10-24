import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from 'src/app/modules/models/orders/orders';
import { Product } from 'src/app/modules/models/product/product';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  order!: Order;
  products: Product[] = [];
  totalPrice: number = 0;
  itemCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>('http://localhost:8080/api/product').subscribe(data => {
        this.products = data;
        this.itemCount = this.products.length;
        this.totalPrice = this.products.reduce((acc, curr) => acc + curr.price, 0);
    });
  }
}