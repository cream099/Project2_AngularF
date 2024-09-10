import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DataSharingService } from '../DataSharingService';
import { CartService } from '../services/cart.service';

interface Product {
  productId: number;
  productName: string;
  productDesc: string;
  price: number;
  quantity: number;
  imgList: string[];
  productTypeId: number;
}
@Component({
  selector: 'app-orderById',
  templateUrl: './orderById.component.html',
  styleUrls: ['./orderById.component.css']
})
export class OrderByIdComponent implements OnInit {
  userData: any;
  orderData: any;
  productList: Product[] = [];
  productTypeList: any[] = [];
  userDetail: any;
  ordersId: number | undefined;

  constructor(
    private callService: CallserviceService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dataSharingService: DataSharingService,
    private cartservice: CartService,

  ) {  }

  ngOnInit(): void {
  
    
    this.activatedRoute.queryParams.subscribe(params => { 
      if (params['responseData']) {
        // const ordersId = +params['responseData'];
        this.ordersId = Number(params['responseData'])
        this.getOrderId(this.ordersId);
      } else {
        console.error('No responseData in queryParams');
      }
    });


    this.cartservice.getProduct();


    this.dataSharingService.userDetail.subscribe((userDetail: any) => {
      this.userDetail = userDetail;
    });
  }

  getOrderId(orderId: number): void {

    this.callService.getByOrderId(orderId).subscribe(
      response => {
        if (response.status === 'SUCCESS') {
          this.orderData = response.data;
          this.getUserDetails(this.orderData.userId);
          this.getAllProducts();

         
       
        }
      },
    );
  }

  getAllProducts(): void {
    this.callService.getAllProduct().subscribe(
      (res: any) => {
        if (res.data) {
          this.productList = res.data.filter((product: any) => this.orderData.productId.includes(product.productId));
          this.productList.forEach(product => {
            product.imgList = [];
            this.callService.getProductImgByProductId(product.productId).subscribe(
              (imgRes) => {
                if (imgRes.data) {
                  this.getImageList(imgRes.data, product.imgList);
                }
              },
            );
          });
         
        }
      },
    );
  }

  getUserDetails(userId: number): void {
    this.callService.getByUserId(userId).subscribe(
      response => {
        if (response.status === 'SUCCESS') {
          this.userData = response.data;
        }
      },
    );
  }

 

  getImageList(imageNames: any[], imgList: any[]): void {
    imageNames.forEach(imageName => {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe(
        (res) => {
          if (res) {
            const objectURL = URL.createObjectURL(res);
            const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            imgList.push(safeUrl);
          }
        },
      );
    });
  }

  getQuantity(order: any, productId: number): number {
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  }


}
