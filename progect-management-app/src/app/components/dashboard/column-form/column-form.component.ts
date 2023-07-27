import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-column-form',
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.scss']
})
export class ColumnFormComponent {
  @Output() columnCreated = new EventEmitter<any>();
  columnForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.columnForm = this.formBuilder.group({
      title: ['', Validators.required],
      order: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.columnForm.valid) {
      this.columnCreated.emit(this.columnForm.value);
    }
  }
}
