import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectStatusById,
} from '../../state/boards/selectors/boards.selectors';
import { addTask } from '../../state/boards/actions/boards.actions';

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
  statuses: string[] = [];
  currentBoardId!: number;
  private boardSubscription!: Subscription;

  constructor(private fb: FormBuilder, private store: Store) {
    this.taskForm = this.fb.group({});
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    this.initForm();
    this.boardSubscription = this.board$.subscribe((board) => {
      this.statuses = [];
      if (board) {
        this.currentBoardId = board.id;
        this.statuses = board.columns.map((column) => column.name);
      }
    });
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
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

  onSubmit() {
    if (this.taskForm.valid) {
      const newSubtasks = this.taskForm.value.subtasks.map(
        (subtask: string) => {
          return { title: subtask, isCompleted: false };
        }
      );
      console.log(this.taskForm.value);
      this.store.dispatch(
        addTask({
          boardId: this.currentBoardId,
          columnName: this.taskForm.value.status,
          task: {
            ...this.taskForm.value,
            subtasks: newSubtasks,
          },
        })
      );
      this.taskForm.reset();
    } else {
      console.log(this.taskForm.errors);
    }
  }

  ngOnDestroy() {
    if (this.boardSubscription) {
      this.boardSubscription.unsubscribe();
    }
  }
}
