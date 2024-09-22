import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SidebarComponent, ThemeToggleComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass',
})
export class SidenavComponent {}
