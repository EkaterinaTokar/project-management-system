import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

export interface Column{
  _id: string,
  title: string,
  order: number
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';
  constructor(
    private http: HttpClient
  ) {}

  createColumns() {
    return this.http.post<Column>(`${this.apiUrl}/boards/{boardId}/columns`, {})
  }
}
