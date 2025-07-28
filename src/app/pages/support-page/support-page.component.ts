import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support-page.component.html',
  styleUrl: './support-page.component.css'
})
export class SupportPageComponent {
  supportForm: FormGroup;
  statusMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.supportForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', [Validators.required, Validators.minLength(5)]),
      message: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  onSubmit(): void {
    this.statusMessage = '';
    this.isLoading = true;

    if (this.supportForm.valid) {
      const { email, subject, message } = this.supportForm.value;
      console.log('Dati del modulo di supporto:', { email, subject, message });

      setTimeout(() => {
        this.statusMessage = this.languageService.currentTranslations.supportSuccessMessage;
        this.isLoading = false;
        this.supportForm.reset();
      }, 2000);
    } else {
      this.statusMessage = this.languageService.currentTranslations.supportErrorMessage;
      this.isLoading = false;
    }
  }
}
