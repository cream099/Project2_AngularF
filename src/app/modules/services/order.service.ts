import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API_ENDPOINT = environment.API_ENDPOINT;
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': '*/*' }) };

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any>(API_ENDPOINT.concat('/order/getAll'), httpOptions)
      .pipe(
        map(response => {
          console.log('API response:', response); // ตรวจสอบการตอบกลับจาก API
          return response.data; // ดึงข้อมูลจากฟิลด์ data แทน
        })
      );
  }

  update(orderId: any, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(API_ENDPOINT.concat(`/order/update/${orderId}`), body, httpOptions);
  }

  save(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(API_ENDPOINT.concat('/order/save'), body, httpOptions);
  }

  delete(orderId: any): Observable<any> {
    return this.http.delete<any>(API_ENDPOINT.concat(`/order/delete?orderId=${orderId}`), httpOptions);
  }
}
