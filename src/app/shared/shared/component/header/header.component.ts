import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/modules/DataSharingService';
import { CallserviceService } from 'src/app/modules/services/callservice.service';
import { CartService } from 'src/app/modules/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public totalItem: number = 0;
  public userDetail: any;
  imgUser: any;
idImg:any
fileimg:any;

  constructor(
    private router: Router,
    private dataSharingService: DataSharingService,
    private cartservice: CartService,
    private callService: CallserviceService,
  ) { 
    this.dataSharingService.userDetail.subscribe(value => {
      var userDetailSession: any = sessionStorage.getItem("userDetail");
      this.userDetail = JSON.parse(userDetailSession);
    });
  }

  ngOnInit(): void {
    this.cartservice.getProduct()
      .subscribe(res => {
        this.totalItem = res.length;
      });

    var userDetailSession: any = sessionStorage.getItem("userDetail");
    this.userDetail = JSON.parse(userDetailSession);
    console.log('imgUser',this.userDetail.userId);
    this.callService.userImage(this.userDetail.userId).subscribe(res => {
      if (res) {
        this.imgUser = res.data.img;
        this.idImg = res.data.id
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem("userDetail");
    this.dataSharingService.userDetail.next(true);
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileimg = file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUser = e.target.result.split(',')[1];
      Swal.fire({
        icon:'question',
        title:'Are your sure for update?',
        showConfirmButton:true,
        showCancelButton:true
      }).then((result)=>{
        if(result.isConfirmed){
          const data = new FormData();
          data.append('Img',this.fileimg as any);
          data.append('userId',this.userDetail.userId as any);
          this.callService.updateProfileAvatar(data,this.idImg).subscribe(res => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'อัปเดตรูปโปรไฟล์สำเร็จ',
              confirmButtonText: 'ตกลง',
            });
          }
        });
        }
      })
        
      };
      reader.readAsDataURL(file);
    }
  }
}
