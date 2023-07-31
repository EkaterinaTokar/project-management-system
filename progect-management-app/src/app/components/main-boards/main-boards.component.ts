import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BoardsService, Board} from "./services/boards.service";
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";

export interface UserProf {
  _id: string;
  name: string;
  login:string;
  password:string;
}
@Component({
  selector: 'app-main-boards',
  templateUrl: './main-boards.component.html',
  styleUrls: ['./main-boards.component.scss']
})
export class MainBoardsComponent implements OnInit {
  boards: Array<any> = [];
  userId = '';
  selectedBoard: any;

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
        this.getUser(params['login']);
      }
    });
  }

  getUser(login: string): void {
    this.authService.getUsers()
      .subscribe(
        (response) => {
          const user = response.find((user: any) => user.login === login);
          this.userId = user._id;
          localStorage.setItem('userId', this.userId);
          if (user && !this.authService.isAuthenticated()) {
            this.addBoard();
          }
          this.getBoards(this.userId);
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
         this.getBoards(this.userId);
      })
  }
  getBoards(ownerId:string){
    this.boardsService.getBoards(ownerId)
      .subscribe(
      (boards) => {
        this.boards = boards;
      })
  }
  deleteBoard(event: Event, userIdDel: any){
  event.preventDefault();
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
              this.getBoards(this.userId);
            }
          )
        }
      })
    }
  editBoard(event: Event, board: any): void {
    event.preventDefault();
    this.selectedBoard = board;
  }
  saveBoard(selectedBoard: any){
    this.boardsService.updateBoardName(
      selectedBoard._id, selectedBoard.title, selectedBoard.owner,selectedBoard.users)
      .subscribe(
        (res) => {
          this.selectedBoard = null;
        },
      )
  }
  cancelEdit(board:any): void {
  this.selectedBoard = null;
  }
   goToBoard(event: Event, board: any): void {
     event.preventDefault();
     if (board && board._id) {
       const boardId = board._id;
       this.router.navigate([`/dashboard/:${boardId}`],
         {queryParams : {boardId: boardId, userId: this.userId, board:board.title}});
     }
  }
}
