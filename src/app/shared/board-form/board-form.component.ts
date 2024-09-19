import { Component, Input } from '@angular/core';
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
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.sass',
})
export class BoardFormComponent {
  boardForm: FormGroup;
  nextId!: number;
  @Input() board: Board | null | undefined;

  constructor(private fb: FormBuilder, private store: Store) {
    this.boardForm = this.fb.group({
      name: ['', Validators.required],
      columns: this.fb.array([]),
    });
    this.store.select(selectNextBoardId).subscribe((id) => (this.nextId = id));
  }

  ngOnChanges(simpleChanges: any) {
    if (simpleChanges.board && this.board) {
      this.initForm();
    }
  }

  initializeColumns() {
    const columns = this.board?.columns || [];
    const columnFormControls = columns.map((column) =>
      this.fb.control(column.name, Validators.required)
    );
    return columnFormControls;
  }

  initForm() {
    this.boardForm = this.fb.group({
      name: [this.board?.name || '', Validators.required],
      columns: this.fb.array(this.initializeColumns()),
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
          const existingTasks = this.board?.columns[index]?.tasks || [];
          return { name: columnName, tasks: existingTasks };
        }
      );

      const newBoard = {
        id: this.nextId,
        name: this.boardForm.value.name,
        columns: newColumns,
      };

      if (this.board) {
        newBoard.id = this.board.id;
        this.store.dispatch(updateBoard({ board: newBoard }));
      }

      this.store.dispatch(addBoard({ board: newBoard }));
      this.boardForm.get('name')?.reset();
    }
  }
}
