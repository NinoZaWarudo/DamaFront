import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.form = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/\d/)]),
      rememberMe: new FormControl(false)
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    if (this.form.valid) {
      const { username, password, rememberMe } = this.form.value;

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          console.log('Login avvenuto con successo!', response);
          if (response.access_token) {
            this.authService.saveToken(response.access_token, rememberMe);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = this.languageService.currentTranslations.loginErrorGeneric;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
          this.errorMessage = error.error?.message || this.languageService.currentTranslations.loginErrorInvalidCredentials;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = this.languageService.currentTranslations.loginErrorMissingFields;
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
