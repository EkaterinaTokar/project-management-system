import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup;

  @Output() taskCreated = new EventEmitter<any>();
  constructor(private FormBuilder: FormBuilder) {
    this.taskForm = this.FormBuilder.group({
      title: ['', Validators.required],
      order: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskCreated.emit(this.taskForm.value);
      this.taskForm.reset();
    }
  }
}
