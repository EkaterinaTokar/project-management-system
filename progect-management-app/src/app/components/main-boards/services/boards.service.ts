import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

export interface Board {
  _id: string,
  title: string,
  owner: string,
  users:[]
}

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }
  createBoards(title: string, owner: string, users:[]): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, {title, owner, users});
  }
  getBoards(userId: string): Observable<Board[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.get<Board[]>(`${this.apiUrl}/boards/${userId}`, { headers });
  }
  /*updateDashboardItem(itemId: string, item: DashboardItem): Observable<DashboardItem> {
    return this.http.put<DashboardItem>(`${this.apiUrl}/board/${itemId}`, item);
  }

  deleteDashboardItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/board/${itemId}`);
  }*/
}
