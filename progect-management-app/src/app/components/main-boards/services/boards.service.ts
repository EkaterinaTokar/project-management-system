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
  getBoards(ownerId: string): Observable<Array<any>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.get< Array<any>>(`${this.apiUrl}/boardsSet/${ownerId}`, { headers });
  }
  deleteBoard(userIdDel: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.delete(`${this.apiUrl}/boards/${userIdDel}`, { headers });
  }
  updateBoardName(boardId:string, title: string, owner: string, users: string[]){
    return this.http.put(`${this.apiUrl}/boards/${boardId}`, { title, owner, users});
  }

}
