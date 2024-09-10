import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // productList:any[] = [];
  public shippingCost: number = 40; // ค่าจัดส่ง
  public totalItem: number = 0;
  public productList: CartItem[] = [];
  public imageBlobUrl: any;
  public grandTotal: number = 0;

  constructor(
    private cartservice: CartService,
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private router: Router,
    private activated: ActivatedRoute
  ) {
    
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras.state as { productList: any[], grandTotal: number };
    // if (state) {
    //   this.productList = state.productList || [];
    //   this.grandTotal = state.grandTotal || 0;
    //   this.productList = this.productList.map(item => ({
    //     ...item,
    //     imageUrl: this.sanitizer.bypassSecurityTrustUrl(item.imageUrl.changingThisBreaksApplicationSecurity)
    //   }));
    // }
   
  }

  userDetail: any;
  userId: any;
  quantity: number[] = [];
  productId: number[] = [];
  responseData: any;
  selectedFiles : any = []
  ImageList : any = []
  isSubmit: boolean = false;
  promprayNumber = '0935646237';
  product: any;
  linkPrompray:string='';
  paymentMethod: string = '';

  orderForm: FormGroup = this.formBuilder.group({
    productId: [],
    quantity: [],
    shippingAddress: '',
    name: ['',Validators.required],
    userId: '',
    phone: '',
    files : [],
  });

  ngOnInit() {
    this.getData();

    this.activated.queryParams.subscribe((params) => {
      this.productList = params['responseData']
        ? JSON.parse(params['responseData'])
        : null;
      console.log('productList', this.productList);
      for (let product of this.productList) {
      
        this.callService
          .getProductImgByProductId(product.productId)
          .subscribe((res) => {
            if (res.data) {
              
              product.imgList = [];
              this.getImageList(res.data, product.imgList);
            } else {
              window.location.reload();
            }
          });
      }
      this.updateGrandTotal();
      this.loadUserDetails();
    });
    this.userId = this.activated.snapshot.paramMap.get('userId');

  }
  getData() {
    this.linkPrompray = `https://promptpay.io/${this.promprayNumber}/${this.grandTotal}.png`;
    console.log(this.linkPrompray);

  }


 
  loadProductImage(product: any) {
    this.callService
      .getProductImgByProductId(product.productId)
      .subscribe((res) => {
        if (res.data) {
          product.imgList = [];
          this.getImageList(res.data, product.imgList);
        } else {
          window.location.reload();
        }
      });
  }

  loadUserDetails() {
    if (this.userId) {
      this.callService.getByUserId(this.userId).subscribe((res) => {
        if (res.data) {
          this.userDetail = res.data;
          this.setDataForm(this.userDetail);
        }
      });
    } else {
      let userDetailSession: any = sessionStorage.getItem('userDetail');
      this.userDetail = JSON.parse(userDetailSession);
      this.setDataForm(this.userDetail);

      console.log('userId', this.userDetail.userId);
    }
  }

  getImageList(imageNames: any[], imgList: any) {
    for (let imageName of imageNames) {
      this.callService
        .getBlobThumbnail(imageName.productImgName)
        .subscribe((res) => {
          let objectURL = URL.createObjectURL(res);
          this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          imgList.push(this.imageBlobUrl);
        });
    }
  }

  updateGrandTotal(): void {
    this.grandTotal = this.productList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) + this.shippingCost;
    console.log('grandTotal', this.grandTotal);
    this.getData(); // เรียก getData() เพื่ออัปเดตลิงก์ PromptPay ทันทีหลังจากอัปเดตราคาสุดท้าย
  }

  setDataForm(data: any) {
    this.orderForm.patchValue({
      userId: data.userId,
      // name: data.name || '',
      // shippingAddress: data.shippingAddress || '',
      // phone: data.phone || '',
    });
  }

  getUserById(userId: any) {
    this.callService.getByUserId(userId).subscribe((res) => {
      if (res.data) {
        this.setDataForm(res.data);
        sessionStorage.removeItem('userDetail');
        sessionStorage.setItem('userDetail', JSON.stringify(res.data));
      }
    });
  }

  onSubmit() {
    this.productId = this.productList.map((item) => item.productId);
    this.orderForm.patchValue({ productId: this.productId });

    this.quantity = this.productList.map((item) => item.quantity);
    this.orderForm.patchValue({ quantity: this.quantity });

    console.log(this.orderForm.value);

    const data = this.orderForm.value;
  
        this.callService.saveOrder(data).subscribe((response) => {
          if (response.data) {
            console.log('ส่งออก',response.data);
            const responseData = response.data
            if(responseData){
              Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง',
              }).then(res=>{
                if(res.isConfirmed){
                  this.router.navigate(['/orderU']);
                }
              })
              
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'บันทึกไม่สำเร็จ!',
                text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
                confirmButtonText: 'ตกลง',
              });
            }
            
            for (const file of this.selectedFiles[0]) {
              const formData = new FormData();
              formData.append('file', file); 
              this.callService.saveQrcode(formData, response.data).subscribe(
                res => {
                  console.log("saveImage=>", response.data);
                }
              );
            }
            if(responseData){
              Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง',
              }).then(res=>{
                if(res.isConfirmed){
                  this.router.navigate(['/orderU']);
                }
              })
              
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'บันทึกไม่สำเร็จ!',
                text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
                confirmButtonText: 'ตกลง',
              });
            }
          }
          }
        );
      }
    

  onFileChanged(event: any) {
    this.selectedFiles.push(event.target.files);
  }

  onPaymentMethodChange(method: string) {
    this.paymentMethod = method;
  }
  
}