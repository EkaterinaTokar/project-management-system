import { Injectable, EventEmitter} from '@angular/core';
import {Observable, tap} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";



export interface Column{
  _id?: string,
  title: string,
  order: number,
  isEditing?: boolean,
  editedTitle?: string
}
export  interface Task{
  _id?: string,
  title: string,
  order?: number,
  description: string,
  userId?: string |number,
  boardId?:string,
  columnId?:string,
  users?: [string]
}
export interface TaskUpdate {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';
  updatedTaskDataEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private http: HttpClient
  ) {}

  createColumn(title: string, order: number, boardId:string) {
    return this.http.post<Column>(`${this.apiUrl}/boards/${boardId}/columns`, {title, order})
  }
 getColumn(boardColumnId: string):Observable<Array<any>> {
   //const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.get<Array<any>>(`${this.apiUrl}/boards/${boardColumnId}/columns`)
  }
  updateColumn(columnId:string, boardId:string,title:string, order:string){
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.put(`${this.apiUrl}/boards/${boardId}/columns/${columnId}`, {title, order})
  }
  deleteColumn(boardId:string, columnId:string){
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    return this.http.delete(`${this.apiUrl}/boards/${boardId}/columns/${columnId}`);
  }
  addTask(boardId: string, columnId: string, title: string, order: number,description:string,userId:number, users:[string]):Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}/tasks`, {title, order,description,userId, users})
  }
  getTasks(boardId: string, columnId: string):Observable<Array<any>>{
    return this.http.get<Array<any>>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}/tasks`)
  }
  deleteTask(boardId:string,columnId: string, taskId:string){
    return this.http.delete(`${this.apiUrl}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  }
  updateTask(boardId:string, columnId: string, taskId:string, title:string,order:number,userId:string, description:string,users:[string]): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      { title,
        order,
        description,
        columnId,
        userId,
        users}
    ).pipe(
      tap((response: any) => {
        console.log('Task updated on the server:', response);
        this.updatedTaskDataEvent.emit(response);
      })
    );
   }

}
