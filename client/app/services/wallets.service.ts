import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WalletsService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  newTransaction(transaction): Observable<any> {
    return this.http.post('/api/transaction', JSON.stringify(transaction), this.options);
  }

  getTransactions(): Observable<any> {
    return this.http.get('/api/transactions').map(res => res.json());
  }
}
