import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: string[];
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public productList: CartItem[] = [];
  public grandTotal: number = 0;
  public shippingCost: number = 40; // ค่าจัดส่ง
  public imageBlobUrl: any;

  constructor(
    private cartservice: CartService,
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cartservice.getProduct()
    .subscribe(res => {
      this.productList = res.map((item: any) => ({ ...item, quantity: 1 }));  
     console.log("productList",this.productList);
     for (let product of this.productList) {
      this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
        if (res.data) {
          product.imgList = [];
          this.getImageList(res.data, product.imgList);
        } else {
          window.location.reload();
        }
      });
     }
    

      this.updateGrandTotal();
    });
  }

  getImageList(imageNames: any[], imgList: any) {
    for (let imageName of imageNames) {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(this.imageBlobUrl);
      });
    }
  }


  removeItem(item: CartItem): void {
     {
      this.cartservice.removeCartItem(item.productId);  // Pass the productId to the service method
      this.productList = this.productList.filter(p => p.productId !== item.productId); // Update local productList
      this.updateGrandTotal();
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
    this.updateGrandTotal();
  }

  incrementQuantity(item: CartItem): void {
    item.quantity++;
    this.updateGrandTotal();
  }

  updateGrandTotal(): void {
    this.grandTotal = this.productList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  setSelectedOrderId(productList: any) {
    const queryParams = {
      responseData: JSON.stringify(productList),
    };
    this.router.navigate(['/checkout'], { queryParams });
    console.log('responseData', productList);
  }

  

  // Uncomment if needed in future
  // emptyCart(): void {
  //   this.cartservice.removeAllCartItems();
  //   this.updateGrandTotal();
  // }

}
