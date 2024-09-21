import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addBoard,
  updateBoard,
} from '../../state/boards/actions/boards.actions';
import {
  selectBoard,
  selectNextBoardId,
} from '../../state/boards/selectors/boards.selectors';
import { map, Observable } from 'rxjs';
import { Board, Column } from '../../models/board.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.sass',
})
export class BoardFormComponent {
  boardData = inject(MAT_DIALOG_DATA);
  boardForm: FormGroup;
  nextId!: number;
  @Input() board: Board | null | undefined;

  constructor(private fb: FormBuilder, private store: Store) {
    this.boardForm = this.fb.group({});
    this.store.select(selectNextBoardId).subscribe((id) => (this.nextId = id));
  }

  ngOnChanges(simpleChanges: any) {
    if (simpleChanges.boardData && this.boardData) {
      this.initForm();
    }
  }

  ngOnInit() {
    // console.log(this.boardData);
    this.initForm();
  }

  initializeColumns() {
    const columns = this.boardData?.columns || [];
    const columnFormControls = columns.map((column: Column) =>
      this.fb.control(column.name, Validators.required)
    );
    return columnFormControls;
  }

  initForm() {
    this.boardForm = this.fb.group({
      name: [this.boardData?.name || '', Validators.required],
      columns: this.fb.array(
        this.boardData?.columns
          ? this.initializeColumns()
          : [
              this.fb.control('', Validators.required),
              this.fb.control('', Validators.required),
            ]
      ),
    });
  }

  get columns() {
    return this.boardForm.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.control('', Validators.required));
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  onSubmit() {
    if (this.boardForm.valid) {
      const newColumns = this.columns.value.map(
        (columnName: string, index: number) => {
          const existingTasks = this.boardData?.columns[index]?.tasks || [];
          return { name: columnName, tasks: existingTasks };
        }
      );

      const newBoard = {
        id: this.nextId,
        name: this.boardForm.value.name,
        columns: newColumns,
      };

      if (this.boardData) {
        newBoard.id = this.boardData.id;
        this.store.dispatch(updateBoard({ board: newBoard }));
      }

      this.store.dispatch(addBoard({ board: newBoard }));
      this.boardForm.get('name')?.reset();
    }
  }
}
