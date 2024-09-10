import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_ENDPOINT = environment.API_ENDPOINT;
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': '*/*' }) };

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(API_ENDPOINT.concat('/payment/getAll'), httpOptions);
  }

  update(paymentId: any, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(API_ENDPOINT.concat(`/payment/update/${paymentId}`), body, httpOptions);
  }

  save(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(API_ENDPOINT.concat('/payment/save'), body, httpOptions);
  }

  delete(paymentId: any): Observable<any> {
    return this.http.delete<any>(API_ENDPOINT.concat(`/payment/delete?paymentId=${paymentId}`), httpOptions);
  }
}
