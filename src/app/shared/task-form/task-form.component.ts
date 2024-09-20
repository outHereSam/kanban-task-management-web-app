import { Component, inject, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { Board, Column, Subtask, Task } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectStatusById,
} from '../../state/boards/selectors/boards.selectors';
import { addTask, updateTask } from '../../state/boards/actions/boards.actions';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.sass',
})
export class TaskFormComponent {
  taskData = inject(MAT_DIALOG_DATA);
  @Input() task!: Task;
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

  initializeSubtasks() {
    const subtasks = this.taskData?.subtasks || [];
    const subtaskFormControls = subtasks.map((subtask: Subtask) =>
      this.fb.control(subtask.title, Validators.required)
    );
    return subtaskFormControls;
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: [this.taskData?.title || '', Validators.required],
      description: [this.taskData?.description || ''],
      subtasks: this.fb.array(
        this.taskData?.subtasks
          ? this.initializeSubtasks()
          : [
              this.fb.control('', Validators.required),
              this.fb.control('', Validators.required),
            ]
      ),
      status: [this.taskData?.status || '', Validators.required],
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

      const newTask = {
        boardId: this.currentBoardId,
        columnName: this.taskForm.value.status,
        task: {
          ...this.taskForm.value,
          subtasks: newSubtasks,
        },
      };

      if (this.task) {
        // Update task if this form is editing
        newTask.task.id = this.taskData.id;
        this.store.dispatch(updateTask({ ...newTask }));
      } else {
        this.store.dispatch(addTask(newTask));
        this.taskForm.reset();
      }
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
