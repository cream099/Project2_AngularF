import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { DataSharingService } from '../DataSharingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productDetails',
  templateUrl: './productDetails.component.html',
  styleUrls: ['./productDetails.component.css']
})
export class ProductDetailsComponent implements OnInit {

  selectedProduct: any = { imgList: [] };
  imageBlobUrls: SafeUrl[] = [];
  userDetail : any

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private dataSharingService: DataSharingService,

  ) { }

  ngOnInit(): void {
    this.dataSharingService.userDetail.subscribe( value => {
      var userDetailSession : any = sessionStorage.getItem("userDetail")
      this.userDetail = JSON.parse(userDetailSession)
  });
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.fetchProductDetails(productId);
        this.fetchProductImages(productId);
      } else {
        console.error('Product ID is null');
      }
    });
  }

  fetchProductDetails(productId: string) {
    this.callService.getProductByProductId(productId).subscribe(
      res => {
        if (res.data) {
          this.selectedProduct = res.data;
        } else {
          console.error('No product data found');
        }
      },
      error => {
        console.error('Error fetching product data', error);
      }
    );
  }

  fetchProductImages(productId: string) {
    this.callService.getProductImgByProductId(productId).subscribe(
      res => {
        if (res.data) {
          const imgList = res.data;
          imgList.forEach((img: any) => {
            this.loadImage(img.productImgName);
          });
        } else {
          console.error('No image data found');
        }
      },
      error => {
        console.error('Error fetching product images', error);
      }
    );
  }

  loadImage(fileName: string) {
    this.callService.getBlobThumbnail(fileName).subscribe(
      res => {
        const objectURL = URL.createObjectURL(res);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.imageBlobUrls.push(safeUrl);
      },
      error => {
        console.error('Error loading image', error);
      }
    );
  }
  async onCart(productId: any) {
    if (productId) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'คุณต้องเข้าสู่ระบบก่อน ค่อยซื้อสินค้าได้?',
        text: 'คุณต้องการเข้าสู่ระบบใช่หรือไม่!',
        showCancelButton: true,
        confirmButtonColor: '#56C596',
        cancelButtonColor: '#d33',
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก',
      });
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    }
  } 

  // async addtoCart(productId: any): Promise<void> {
  //   try {
  //     this.setSelectedProduct(productId);
  //     const existingProduct = this.cartService.getCartItemById(productId);
      
  //     if (existingProduct) {
  //       // ถ้าสินค้ามีอยู่แล้วในรถเข็น ให้เพิ่มจำนวนสินค้า
  //       existingProduct.quantity += 1;
  //       await this.cartService.updateCartItem(existingProduct);
  //     } else {
  //       // ถ้าสินค้าไม่มีในรถเข็น ให้เพิ่มเป็นรายการใหม่
  //       await this.cartService.addtoCart(productId);
  //     }
  
  //     await Swal.fire({
  //       icon: 'success',
  //       title: 'เพิ่มสำเร็จ!',
  //       text: 'สินค้าได้ถูกเพิ่มในรถเข็น',
  //       confirmButtonText: 'ตกลง'
  //     });
  //   } catch (error) {
  //     await Swal.fire({
  //       icon: 'error',
  //       title: 'เกิดข้อผิดพลาด!',
  //       text: 'ไม่สามารถเพิ่มสินค้าในรถเข็น กรุณาลองใหม่อีกครั้ง',
  //       confirmButtonText: 'ตกลง'
  //     });
  //   }
  // }
  
  
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    localStorage.setItem('selectedProduct', JSON.stringify(this.selectedProduct));
    console.log('Selected Product saved to localStorage:', this.selectedProduct); // Debugging line
  }

  async addtoCart(productId: any): Promise<void> {
    try {
      await this.cartService.addToCart(productId);
      console.log('เพิ่มสินค้าในรถเข็นสำเร็จ');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้าในรถเข็น:', error);
    }
  }
}
