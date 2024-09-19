import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { Board, Task } from '../../models/board.model';
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
    const subtasks = this.task?.subtasks || [];
    const subtaskFormControls = subtasks.map((subtask) =>
      this.fb.control(subtask.title, Validators.required)
    );
    return subtaskFormControls;
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      subtasks: this.fb.array(this.initializeSubtasks()),
      status: [this.task?.status || '', Validators.required],
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

      this.store.dispatch(addTask(newTask));
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
