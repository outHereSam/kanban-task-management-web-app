import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
// import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import { deleteBoard } from '../../state/boards/actions/boards.actions';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BoardFormComponent,
    AsyncPipe,
    TaskFormComponent,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  // dialog = inject(MatDialog);

  @Input() board!: Board;
  isFormOpened: boolean = false;
  isOptionsOpened: boolean = false;
  // board$: Observable<Board | undefined>;

  constructor(
    private store: Store,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  openDialog() {
    this.dialog.open(SidebarComponent, {
      position: {
        top: '80px',
      },
    });
  }

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }

  toggleOptions() {
    this.isOptionsOpened = !this.isOptionsOpened;
  }

  deleteBoard(id: number) {
    this.store.dispatch(deleteBoard({ id }));
    this.router.navigate(['']);
  }
}
