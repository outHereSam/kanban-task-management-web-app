import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFirstBoardId } from '../../state/boards/selectors/boards.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-redirect',
  standalone: true,
  imports: [],
  templateUrl: './board-redirect.component.html',
  styleUrl: './board-redirect.component.sass',
})
export class BoardRedirectComponent {
  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store
      .select(selectFirstBoardId)
      .subscribe((id) => this.router.navigate(['/board', id]));
  }
}
