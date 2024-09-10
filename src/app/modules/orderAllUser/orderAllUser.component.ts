import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orderAllUser',
  templateUrl: './orderAllUser.component.html',
  styleUrls: ['./orderAllUser.component.css']
})
export class OrderAllUserComponent implements OnInit {
  constructor(
    private callService: CallserviceService,
    private activated: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.updateForm = this.formBuilder.group({
      userId: '',
      name: '',
      shippingAddress: '',
      status: '',
      phone: '',
      productId: this.formBuilder.array([]),
      quantity: this.formBuilder.array([]),
    });
  }

  updateForm: FormGroup;
  userId: any;
  orderList: any[] = [];
  userDetail: any;
  selectedProduct: any;
  provincesData: any[] = [];
  selectedpayments: any;
  totalOrderPrice: number = 0; // ตัวแปรเพื่อเก็บยอดรวมทั้งหมด
  shippingCost: number = 40; // ค่าส่ง

  ngOnInit() {
    let userDetailSession: any = sessionStorage.getItem('userDetail');
    this.userDetail = JSON.parse(userDetailSession);
  
    this.callService
      .getOrderIdByUserId(this.userDetail.userId)
      .subscribe((res) => {
        if (res.data) {
          this.orderList = res.data;
          this.orderList.forEach((order) => {
            this.getUserDetails(order.userId).then((userData) => {
              order.userData = userData;
            });
          });
  
          this.callService.getAllPaymentImage().subscribe(
            (data: any) => {
              const paymentImages = data.data;
              this.orderList.forEach((order: any) => {
                order.paymentImage = paymentImages.filter((payment: any) => order.ordersId === payment.ordersId);
                order.paymentImage.forEach((payment: any) => {
                  payment.imgList = [];
                  this.callService.getPaymentImgByUserId(payment.ordersId).subscribe((imgRes: any) => {
                    if (imgRes.data) {
                      this.getImage(imgRes.data, payment.imgList);
                    }
                  });
                });
              });
              console.log('orderList with payment images', this.orderList);
            },
            (error: any) => {
              console.error('Error fetching payment images', error);
            }
          );
  
          this.callService.getAllProduct().subscribe((res: any) => {
            if (res.data) {
              const allProducts = res.data;
              this.orderList.forEach((order: any) => {
                order.productList = allProducts.filter((product: any) => order.productId.includes(product.productId));
                order.productList.forEach((product: any) => {
                  product.imgList = [];
                  this.callService.getProductImgByProductId(product.productId).subscribe((imgRes) => {
                    if (imgRes.data) {
                      this.getImageList(imgRes.data, product.imgList);
                    }
                  });
                });
  
                // คำนวณยอดรวมทั้งหมด
                this.totalOrderPrice = this.calculateOrderTotalPrice();
              });
            }
          });
        }
      });
  }
  
  getImage(imageNames: any[], imgList: any[]) {
    for (let imageName of imageNames) {
      this.callService.getPaymentImgBlobThumbnail(imageName.paymentImgName).subscribe((res) => {
        if (res) {
          let objectURL = URL.createObjectURL(res);
          let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          imgList.push(safeUrl);
        }
      });
    }
  }

  getImageList(imageNames: any[], imgList: any[]) {
    for (let imageName of imageNames) {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
        if (res) {
          let objectURL = URL.createObjectURL(res);
          let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          imgList.push(safeUrl);
        }
      });
    }
  }

  getUserDetails(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.callService.getByUserId(userId).subscribe((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response.data);
        } else {
          reject('Error fetching user details');
        }
      });
    });
  }

  setDataForms(selectedProduct: any): void {
    this.updateForm.patchValue({
      shippingAddress: selectedProduct.shippingAddress,
      name: selectedProduct.name,
      phone: selectedProduct.phone,
    });
  }

  setDataForm(selectedProduct: any): void {
    this.updateForm.patchValue({
      userId: selectedProduct.userId,
      status: selectedProduct.status,
    });

    this.updateForm.setControl(
      'productId',
      this.formBuilder.array(selectedProduct.productId || [])
    );
    this.updateForm.setControl(
      'quantity',
      this.formBuilder.array(selectedProduct.quantity || [])
    );
  }

  setSelectedProduct(order: any): void {
    this.selectedProduct = order;
    this.setDataForms(order);
    this.setDataForm(order);
  }

  getQuantity(order: any, productId: number): number {
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  }

 calculateOrderTotalPrice(): number {
  let totalPrice = 0;
  this.orderList.forEach(order => {
    totalPrice += this.calculateOrderTotalPriceForOrder(order);
  });
  return totalPrice;
}

calculateOrderTotalPriceForOrder(order: any): number {
  let totalPrice = 0;
  if (order && order.productList) {
    order.productList.forEach((product: any) => {
      const quantity = this.getQuantity(order, product.productId);
      totalPrice += product.price * quantity;
    });
  }
  return totalPrice + this.shippingCost; // เพิ่มค่าจัดส่ง
}


  onDeleteOrder(ordersId: any) {
    if (ordersId) {
      this.callService.deleteOrder(ordersId).subscribe((res) => {
        if (res.data) {
          window.location.reload();
        }
      });
    }
  }

  onSubmit(): void {
    const order = this.updateForm.value;
    this.callService.updateOrder(order, this.selectedProduct.ordersId).subscribe(
      (res) => {
        if (res.data) {
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'แก้ไขข้อมูลสำเร็จ',
            confirmButtonText: 'ตกลง',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'บันทึกไม่สำเร็จ!',
            text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
            confirmButtonText: 'ตกลง',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'ข้อผิดพลาด!',
          text: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
          confirmButtonText: 'ตกลง',
        });
        console.error('Error:', error);
      }
    );
  }

  payments(payment: any) {
    this.selectedpayments = payment;
    console.log('Selected Product:', this.selectedpayments);
  }
}
