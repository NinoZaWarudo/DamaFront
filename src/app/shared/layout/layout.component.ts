import { Component } from '@angular/core'; // Rimosso EventEmitter e Output
import { RouterModule, RouterOutlet } from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor() {
    console.log('LayoutComponent constructor chiamato.'); // DEBUG
  }
}
