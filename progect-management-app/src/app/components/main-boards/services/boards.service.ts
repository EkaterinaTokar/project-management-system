import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

export interface Board {
  _id: string,
  title: string,
  owner: string,
  users: string[]
}

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  createBoard(title: string, owner: string, users: string[]): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, {title, owner, users});
  }
  getBoards(ownerId: string): Observable< Array<any>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.get< Array<any>>(`${this.apiUrl}/boardsSet/${ownerId}`, { headers });
  }
  deleteBoard(userIdDel: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    console.log(userIdDel)
    return this.http.delete(`${this.apiUrl}/boards/${userIdDel}`, { headers });
  }
  /*updateDashboardItem(itemId: string, item: DashboardItem): Observable<DashboardItem> {
    return this.http.put<DashboardItem>(`${this.apiUrl}/dashboard/${itemId}`, item);
  }

  deleteDashboardItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dashboard/${itemId}`);
  }*/
}
