import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orderAllAdmin',
  templateUrl: './orderAllAdmin.component.html',
  styleUrls: ['./orderAllAdmin.component.css']
})
export class OrderAllAdminComponent implements OnInit {
  updateForm: FormGroup;
  userId: any;
  orderList: any[] = [];
  userDetail: any;
  selectedProduct: any;
  provincesData: any[] = [];
  selectedOrder: any;  
  paymentImages: any[] = [];
  selectedImgList: any[] = [];
  allimgs: any[] = [];
  shippingCost: number = 40; // ค่าส่ง

  statuses = [
    { value: '1', label: 'กำลังตรวจสอบ' },
    { value: '2', label: 'ชำระเงินเเล้ว รอรับสินค้า' },
    { value: '3', label: 'ยังไม่ชำระเงิน' },
    { value: '4', label: 'ชำระเงินไม่ครบตามจำนวน' }
  ];

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

  ngOnInit() {
    // ดึงข้อมูล orderList
    this.callService.getAllOrder().subscribe(res => {
      if (res.data) {
        this.orderList = res.data;
        this.orderList.forEach(order => {
          this.getUserDetails(order.userId).then(userData => {
            order.userData = userData;
          });
        });

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
            });
          }
        });
      }
    });
  }

  getPrompay(order: any) {
    this.callService.getPaymentImgByUserId(order.ordersId).subscribe((imgRes: any) => {
      if (imgRes.data) {
        order.allimgs = [];
        this.getImage(imgRes.data, order.allimgs);
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

  getQuantity(order: any, productId: number): number {
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  }

  onDeleteOrder(ordersId: any) {
    if (ordersId) {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณจะไม่สามารถย้อนกลับได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.callService.deleteOrder(ordersId).subscribe((res) => {
            if (res.data) {
              Swal.fire(
                'ลบแล้ว!',
                'ข้อมูลการสั่งซื้อของคุณถูกลบแล้ว.',
                'success'
              ).then(() => {
                window.location.reload();
              });
            }
          });
        }
      });
    }
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
      }
    );
  }

  setSelectedOrder(order: any): void {
    this.selectedOrder = order;
    this.getPrompay(this.selectedOrder);
    console.log('Selected Order:', this.selectedOrder);
  }

  calculateTotalPrice(order: any): number {
    let totalPrice = 0;
    if (order && order.productList) {
      order.productList.forEach((product: any) => {
        const quantity = this.getQuantity(order, product.productId);
        totalPrice += product.price * quantity;
      });
    }
    return totalPrice + this.shippingCost;
  }
}
