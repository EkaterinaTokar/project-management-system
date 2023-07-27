import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
//import { Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BoardsService, Board} from "./services/boards.service";
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";


@Component({
  selector: 'app-main-boards',
  templateUrl: './main-boards.component.html',
  styleUrls: ['./main-boards.component.scss']
})
export class MainBoardsComponent implements OnInit {
  //private apiUrl = 'http://localhost:3000';
  boards: Array<any> = [];
  userId = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params && params['login']) {
        console.log('Логин пользователя(params):', params['login']);
        this.getUser(params['login']);
      }
    });
  }

  getUser(login: string): void {
    this.authService.getUsers()
      .subscribe(
        (response) => {
          console.log(response);
          const user = response.find((user: any) => user.login === login);
          this.userId = user._id;
          if (user && !this.authService.isAuthenticated()) {
            this.addBoard();
          }
          this.getBoards(this.userId);
          console.log(this.userId);
    })
  }

  addBoard() {
    const boardData: Board = {
      _id: '',
      title: 'New Board',
      owner: this.userId,
      users: []
    };
     this.boardsService.createBoard(boardData.title, boardData.owner, boardData.users)
       .subscribe(
          (res) => {
          console.log(res);
         this.getBoards(this.userId);
      })
  }
  getBoards(ownerId:string){
    this.boardsService.getBoards(ownerId)
      .subscribe(
      (boards) => {
        console.log(boards)
        this.boards = boards;
      })
  }
  deleteBoard(userIdDel: any){
  const dialogRef = this.dialog.open(DialogComponent,{
    data: {
      message: 'Are you sure you want to delete this board?'
    }
  });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.boardsService.deleteBoard(userIdDel._id)
          .subscribe(
            (res) =>{
              console.log(res)
              console.log("board delete")
              this.getBoards(this.userId);
            }
          )
        }
      })
    }
   goToBoard(board: any): void {
     if (board && board._id) {
       const boardId = board._id;
       console.log(boardId);
       this.router.navigate([`/dashboard/:${boardId}`],
         {queryParams : {boardId: boardId, userId: this.userId}});
     } else {
       console.log('Invalid board object or boardId');
     }
  }
}
