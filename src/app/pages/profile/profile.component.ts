import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string | null = null;

  constructor(
    public languageService: LanguageService,
    private authService: AuthService
  ) {
    console.log('ProfileComponent constructor chiamato.');
  }

  ngOnInit(): void {
    this.username = this.authService.getUsernameFromToken();
  }
}
