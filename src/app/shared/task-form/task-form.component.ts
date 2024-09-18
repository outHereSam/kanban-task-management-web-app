import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.sass',
})
export class TaskFormComponent {
  taskForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({});
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }
}
