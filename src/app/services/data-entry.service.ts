import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private REST_API_SERVER = environment.dataEntryApiURL;

  constructor(private httpClient: HttpClient) { }

  public async postData(data: any) : Promise<any> {
    return this.httpClient.post(this.REST_API_SERVER, data);
  }
}
