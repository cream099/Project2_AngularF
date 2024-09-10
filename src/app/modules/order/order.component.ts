import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orders: any[] = [];
  orderForm: any = {};
  editing: boolean = false;
  selectedOrderId: number = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getAll().subscribe(
      (data: any[]) => {
        console.log('Orders data:', data); // ตรวจสอบข้อมูลที่ได้จาก API
        this.orders = data;
      },
      (error: any) => {
        console.error('Error loading orders: ', error);
      }
    );
  }

  saveOrder(): void {
    if (this.editing) {
      this.orderService.update(this.selectedOrderId, this.orderForm).subscribe(
        () => {
          this.getOrders();
          this.clearForm();
        },
        (error: any) => {
          console.error('Error updating order: ', error);
        }
      );
    } else {
      this.orderService.save(this.orderForm).subscribe(
        () => {
          this.getOrders();
          this.clearForm();
        },
        (error: any) => {
          console.error('Error adding order: ', error);
        }
      );
    }
  }

  editOrder(order: any): void {
    this.editing = true;
    this.selectedOrderId = order.orderId;
    // Copy order properties to orderForm for editing
    this.orderForm = { ...order };
  }

  deleteOrder(orderId: number): void {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบคำสั่งซื้อนี้?')) {
      this.orderService.delete(orderId).subscribe(
        () => {
          this.getOrders();
        },
        (error: any) => {
          console.error('Error deleting order: ', error);
        }
      );
    }
  }

  clearForm(): void {
    this.editing = false;
    this.selectedOrderId = 0;
    this.orderForm = {};
  }
}
