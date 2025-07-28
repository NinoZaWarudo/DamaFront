import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LanguageService } from '../../services/language.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentLanguage$: Observable<'it' | 'en'>;
  currentRoute: string = '';

  constructor(
    public authService: AuthService,
    public router: Router,
    public languageService: LanguageService
  ) {
    this.currentLanguage$ = this.languageService.currentLanguage$;
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentRoute = event.urlAfterRedirects;
      console.log('Current Route in Navbar:', this.currentRoute);
      console.log('Is logged in:', this.authService.isLoggedIn());
    });
  }

  onLogout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
