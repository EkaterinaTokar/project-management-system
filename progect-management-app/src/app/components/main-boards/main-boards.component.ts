import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
//import { Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {BoardsService, Board} from "./services/boards.service";


@Component({
  selector: 'app-main-boards',
  templateUrl: './main-boards.component.html',
  styleUrls: ['./main-boards.component.scss']
})
export class MainBoardsComponent implements OnInit {
  //private apiUrl = 'http://localhost:3000';
  boards: Board[] = [];
  userId = '';
  constructor(
    private  http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private boardsService: BoardsService
    ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params && params['login']) {
        console.log('Логин пользователя(params):', params['login']);
        this.getUserId(params['login']);
      }
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  getUserId(login: string): void {
    this.authService.getUsers()
      .subscribe(
        (response) => {
         console.log(response);
         const user = response.find((user: any) => user.login === login);
          if (user && !this.isLoggedIn()) {
           this.userId = user._id;
            this.addBoard();
          }
            this.boardsService.getBoards(user._id).subscribe(
              (data) => {
                console.log(data)
                this.boards = data;
              })
        })
   /* goToBoard(boardId: string): void {
      // переход на одну из досок по boardId
    }*/
  }

  addBoard() {
    const boardData: Board = {
      _id: '',
      title: 'New Board',
      owner: this.userId,
      users: []
    };
    this.boardsService.createBoards(boardData.title, boardData.owner, boardData.users)
      .subscribe(
        (createdBoard) => {
          this.boards.push(createdBoard);
          console.log(createdBoard);
        })
    this.boardsService.getBoards(this.userId).subscribe(
      (boards) => {
        console.log(boards)
        this.boards = boards;
      })
  }
}
