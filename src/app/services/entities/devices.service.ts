import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrudMethods } from 'src/app/utils/crud/crud-methods';

@Injectable({
  providedIn: 'root'
})
export class DevicesService extends CrudMethods {

  constructor(public http: HttpClient) {
    super();
    this.entity = 'devices';
  }

}
