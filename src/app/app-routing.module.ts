import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { FullwidthComponent } from './layouts/fullwidth/fullwidth.component';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { DashbordAdminComponent } from './modules/dashbordAdmin/dashbordAdmin.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ManageUserComponent } from './modules/manageUser/manageUser.component';
import { ManageProductComponent } from './modules/manageProduct/manageProduct.component';
import { ProductComponent } from './modules/product/product.component';
import { UpdateProductComponent } from './modules/updateProduct/updateProduct.component';
import { ReportComponent } from './modules/report/report.component';
import { CartComponent } from './modules/cart/cart.component';
import { PreviewComponent } from './modules/preview/preview.component';
import { CardproductComponent } from './modules/cardproduct/cardproduct.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { PaymentComponent } from './modules/payment/payment.component';
import { OrderComponent } from './modules/order/order.component';
import { ProductDetailsComponent } from './modules/productDetails/productDetails.component';
import { OrderReviewComponent } from './modules/orderReview/orderReview.component';
import { OrderAllAdminComponent } from './modules/orderAllAdmin/orderAllAdmin.component';
import { OrderAllUserComponent } from './modules/orderAllUser/orderAllUser.component';
import { OrderByIdComponent } from './modules/orderById/orderById.component';


const routes: Routes = [
  {
    path: '',
    component: FullwidthComponent,
    children: [{
      path: '',
      component: HomeComponent
    },{
      path: 'register',
      component: RegisterComponent
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'dashbord-admin',
      component: DashbordAdminComponent
    },{
      path: 'profile',
      component: ProfileComponent
    },{
      path: 'manage-user',
      component: ManageUserComponent
    },{
      path: 'profile/:userId',
      component: ProfileComponent
    },{
      path: 'manage-product',
      component: ManageProductComponent
    },{
      path: 'product',
      component: ProductComponent
    },{
      path: 'product/:productId',
      component: UpdateProductComponent
    },{
      path: 'report',
      component: ReportComponent
    },{
      path: 'cart',
      component: CartComponent
    },{
      path: 'details/:id',
      component: ProductDetailsComponent
    },{
      path: 'productd',
      component: CardproductComponent
    },{
      path: 'checkout',
      component: CheckoutComponent
    },{
      path: 'payment',
      component: PaymentComponent
    },{
      path: 'order',
      component: OrderComponent
    },{
      path: 'preview',
      component: PreviewComponent
    },{
      path: 'orderpre',
      component: OrderReviewComponent
    },{
      path: 'orderA',
      component: OrderAllAdminComponent
    },{
      path: 'orderU',
      component: OrderAllUserComponent
    }
    ,{
      path: 'orderById',
      component: OrderByIdComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
