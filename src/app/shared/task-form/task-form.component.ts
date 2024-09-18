import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, switchMap } from 'rxjs';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectStatusById,
} from '../../state/boards/selectors/boards.selectors';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.sass',
})
export class TaskFormComponent {
  taskForm: FormGroup;
  board$: Observable<Board | undefined>;
  statuses: string[] = ['Todo', 'In Progress', 'Done'];
  constructor(private fb: FormBuilder, private store: Store) {
    this.taskForm = this.fb.group({});
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([this.fb.control(''), this.fb.control('')]),
      status: ['', Validators.required],
    });
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.fb.control('', Validators.required));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }
}
