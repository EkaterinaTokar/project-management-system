import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import {HttpHeaders} from "@angular/common/http";
import {DashboardService, Column, Task} from "./services/dashboard.service";
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";
import { Location } from '@angular/common';
import {ColumnFormComponent} from "./column-form/column-form.component";
import {first, map, pipe} from "rxjs";
import {TaskFormComponent} from "./task-form/task-form.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() column: any;
  @Input() task: any;
  boardId = '';
  columns: Array<any> = [];
  tasks: Task[] = [];
  userDataId = '';

  constructor(
    private route: ActivatedRoute,
    private dashboardsService: DashboardService,
    private dialog: MatDialog,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      console.log(params)
      this.userDataId = params['userId'];
      if (params && params['boardId']) {
        this.getColumns(params['boardId'])
      }
    })
  }
  getColumns(boardDataId: string) {
    this.boardId = boardDataId;
    this.dashboardsService.getColumn(this.boardId)
      .subscribe(
        (columns: Column[]) => {
          if (columns.length > 0) {
            console.log(columns);
            this.getColumn(this.boardId)
          } else {
            this.openModuleForm()
          }
        })
  }
 openModuleForm(){
   const dialogRef = this.dialog.open(ColumnFormComponent);
   dialogRef.componentInstance.columnCreated.subscribe((formData: any) => {
     if(formData){
       const columnData: Column = {
         _id: this.boardId,
         title: formData.title,
         order: formData.order
       };
       this.createColumn(columnData);
       dialogRef.close();
     }
   });
 }
  createColumn(columnData: Column) {
    this.dashboardsService.createColumn(columnData.title, columnData.order, this.boardId)
      .subscribe(
        (res) => {
          console.log(res);
          this.getColumn(this.boardId);
        })
  }

  getColumn(boardColumnId: string) {
    //console.log(boardColumnId);
    this.dashboardsService.getColumn(boardColumnId)
      .subscribe(
        (columns: Column[]) => {
          console.log(columns);
          this.columns = columns.map(
            column=> {
            return { ...column, ...{tasks: []} };
          })
          this.columns.forEach(column => {
            this.getTasks(column.boardId, column._id);
          });
        })
  }

  deleteColumn(boardId: string, columnId: string) {
    const dialogRef = this.dialog.open(DialogComponent,{
      data: {
         message: 'Are you sure you want to delete this column-form?'
       }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.dashboardsService.deleteColumn(boardId, columnId)
          .subscribe(
            (res) => {
              console.log('Column delete:', res);
              this.getColumn(this.boardId);
            }
          );
      }
    })
  }
  goBack(){
    this.location.back();
  }

  createTasks(boardId: string, columnId: string,taskData: Task){
    /*const taskData: Task = {
      title: "new title",
      order: 0,
      description: "description",
      userId: this.userDataId,
      users: ["string"]
    };*/
    this.dashboardsService.addTask(
      boardId, columnId, taskData.title, taskData.order,taskData.description,taskData.userId!, taskData.users!
      )
      .subscribe(
        (task: Task) => {
          console.log(task);
          console.log("add task")
          this.getTasks(boardId, columnId)
        })
  }

  getTasks(boardId: string, columnId: string) {
    this.dashboardsService.getTasks(boardId, columnId)
      .pipe(
        map((tasks: Task[]) => {
          this.columns = this.columns.map(column => {
            if (column._id === columnId) {
              column.tasks = tasks;
            }
            return column;
          });
          return tasks;
        }),
        first()
      )
      .subscribe();
  }
  deleteTask(boardId:string,columnId: string, taskId:string){
    const dialogRef = this.dialog.open(DialogComponent,{
      data: {
        message: 'Are you sure you want to delete this task?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.dashboardsService.deleteTask(boardId, columnId, taskId)
          .subscribe(
            (res) => {
              console.log('task delete:', res);
              this.getTasks(boardId, columnId);
            }
          );
      }
    })
  }
  openModuleFormTask(boardId:string, columnId:string){
    const dialogRef = this.dialog.open(TaskFormComponent);
    dialogRef.componentInstance.taskCreated.subscribe((formData: any) => {
      if(formData){
        const taskData: Task = {
          title: formData.title,
          order:formData.order,
          description: formData.description,
          userId: this.userDataId,
          users: ["string"]
        };
        this.createTasks(
          boardId, columnId, taskData);
        dialogRef.close();
      }
    });
  }
  toggleEdit(column: Column) {
    column.isEditing = !column.isEditing;
    if (column.isEditing) {
      column.editedTitle = column.title;
    }
  }

  onEdit(column: Column) {
    column.isEditing = true;
    column.editedTitle = column.title;
  }

  onCancel(column: Column) {
    column.isEditing = false;
  }

  onSave(column: Column) {
    column.isEditing = false;
    column.title = column.editedTitle as string;
  }
}
