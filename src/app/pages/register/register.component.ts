import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordFieldType: string = 'password';
  passwordStrength: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/\d/)]),
    });

    this.form.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordStrength(password);
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    if (this.form.valid) {
      const { name, surname, email, username, password } = this.form.value;

      this.authService.register({ name, surname, email, username, password }).subscribe({
        next: (response) => {
          console.log('Registrazione avvenuta con successo!', response);
          if (response.token) {
            this.authService.saveToken(response.token);
          }
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore durante la registrazione:', error);
          this.errorMessage = error.error?.message || this.languageService.currentTranslations.registerErrorGeneric;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = this.languageService.currentTranslations.registerErrorMissingFields;
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  checkPasswordStrength(password: string): void {
    let strength = 0;
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+={}\[\]:;<>,.?~\\-]/.test(password);

    if (password.length >= 8) strength++;
    if (hasLetters) strength++;
    if (hasNumbers) strength++;
    if (hasSymbols) strength++;
    if (password.length >= 12) strength++;

    if (strength <= 1) {
      this.passwordStrength = this.languageService.currentTranslations.passwordStrengthWeak;
    } else if (strength <= 3) {
      this.passwordStrength = this.languageService.currentTranslations.passwordStrengthMedium;
    } else if (strength <= 4) {
      this.passwordStrength = this.languageService.currentTranslations.passwordStrengthGood;
    } else {
      this.passwordStrength = this.languageService.currentTranslations.passwordStrengthStrong;
    }
  }
}

