import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'dama001';
  private supportModalSubscription: Subscription | undefined;

  constructor(
    public languageService: LanguageService
  ) {
    console.log('AppComponent constructor chiamato.');
  }

  ngOnInit(): void {
    this.languageService.initializeLanguage();
  }

  ngOnDestroy(): void {
    if (this.supportModalSubscription) {
      this.supportModalSubscription.unsubscribe();
    }
  }
}
