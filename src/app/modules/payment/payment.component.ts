import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  payments: any[] = [];
  paymentForm: any = {};
  editing: boolean = false;
  selectedPaymentId: number = 0;

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments(): void {
    this.paymentService.getAll().subscribe(
      (response: any) => {
        console.log('Data received from getAll:', response); // Debug log
        if (response && Array.isArray(response.data)) {
          this.payments = response.data;
        } else {
          console.error('Data received is not an array:', response);
          this.payments = [];
        }
      },
      (error: any) => {
        console.error('Error loading payments: ', error);
      }
    );
  }

  savePayment(): void {
    if (this.editing) {
      this.paymentService.update(this.selectedPaymentId, this.paymentForm).subscribe(
        (data: any) => {
          this.getPayments();
          this.clearForm();
        },
        (error: any) => {
          console.error('Error updating payment: ', error);
        }
      );
    } else {
      this.paymentService.save(this.paymentForm).subscribe(
        (data: any) => {
          this.getPayments();
          this.clearForm();
        },
        (error: any) => {
          console.error('Error adding payment: ', error);
        }
      );
    }
  }

  editPayment(payment: any): void {
    this.editing = true;
    this.selectedPaymentId = payment.paymentId;
    this.paymentForm = { ...payment };
  }

  deletePayment(paymentId: number): void {
    if (confirm('Are you sure to delete this payment?')) {
      this.paymentService.delete(paymentId).subscribe(
        () => {
          this.getPayments();
        },
        (error: any) => {
          console.error('Error deleting payment: ', error);
        }
      );
    }
  }

  clearForm(): void {
    this.editing = false;
    this.selectedPaymentId = 0;
    this.paymentForm = {};
  }
}
