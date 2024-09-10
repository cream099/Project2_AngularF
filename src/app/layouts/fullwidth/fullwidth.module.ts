import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullwidthComponent } from './fullwidth.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxLoadingModule } from 'ngx-loading';
import { RegisterComponent } from 'src/app/modules/register/register.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { DashbordAdminComponent } from 'src/app/modules/dashbordAdmin/dashbordAdmin.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';
import { ManageUserComponent } from 'src/app/modules/manageUser/manageUser.component';
import { ManageProductComponent } from 'src/app/modules/manageProduct/manageProduct.component';
import { ProductComponent } from 'src/app/modules/product/product.component';
import { UpdateProductComponent } from 'src/app/modules/updateProduct/updateProduct.component';
import { ReportComponent } from 'src/app/modules/report/report.component';
import { CartComponent } from 'src/app/modules/cart/cart.component';
import { CardproductComponent } from 'src/app/modules/cardproduct/cardproduct.component';
import { PreviewComponent } from 'src/app/modules/preview/preview.component';
import { CheckoutComponent } from 'src/app/modules/checkout/checkout.component';
import { PaymentComponent } from 'src/app/modules/payment/payment.component';
import { OrderComponent } from 'src/app/modules/order/order.component';
import { ProductDetailsComponent } from 'src/app/modules/productDetails/productDetails.component';
import { OrderReviewComponent } from 'src/app/modules/orderReview/orderReview.component';
import { OrderAllAdminComponent } from 'src/app/modules/orderAllAdmin/orderAllAdmin.component';
import { OrderAllUserComponent } from 'src/app/modules/orderAllUser/orderAllUser.component';
import { OrderByIdComponent } from 'src/app/modules/orderById/orderById.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    NgxPermissionsModule.forRoot(),
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    FullwidthComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashbordAdminComponent,
    ProfileComponent,
    ManageUserComponent,
    ManageProductComponent,
    ProductComponent,
    UpdateProductComponent,
    ReportComponent,
    CartComponent,
    CardproductComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    PaymentComponent,
    OrderComponent,
    PreviewComponent,
    OrderReviewComponent,
    OrderAllAdminComponent,
    OrderAllUserComponent,
    OrderByIdComponent
  ]
})
export class FullwidthModule { }
