import {
  Component,
  EventEmitter,
  Output,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DashboardService, Task} from "../services/dashboard.service";

@Component({
  selector: 'app-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.scss']
})
export class TaskEditFormComponent{
  @Input()taskData: Task = {
    _id: '',
    boardId: '',
    columnId: '',
    title: '',
    order: 0,
    userId: '',
    description: '',
    users: ['']
  };
 //@Output() updatedDataEvent: EventEmitter<Task> = new EventEmitter();
  taskForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TaskEditFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Task,
  ) {
    this.taskForm = this.formBuilder.group({
      title: [data.title, Validators.required],
      description: [data.description, Validators.required],
    });
  }

    save(){
    if (this.taskForm.valid) {
    const updatedData: Task = {
      ...this.data,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
    };
      this.dialogRef.close(updatedData);
  }

}
  cancel(){
    this.dialogRef.close();
  }
}
