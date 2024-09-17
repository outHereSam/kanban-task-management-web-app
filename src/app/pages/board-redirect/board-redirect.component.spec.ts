import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardRedirectComponent } from './board-redirect.component';

describe('BoardRedirectComponent', () => {
  let component: BoardRedirectComponent;
  let fixture: ComponentFixture<BoardRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardRedirectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
