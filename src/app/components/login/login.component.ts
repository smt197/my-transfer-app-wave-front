import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      telephone: ['', [Validators.required]],
      mdp: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { telephone, mdp } = this.loginForm.value;
      
      this.authService.login(telephone, mdp).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // Redirige vers le tableau de bord
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          console.error('Erreur de connexion:', error);
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Getter pour les contrôles de formulaire
  get telephone() {
    return this.loginForm.get('telephone');
  }

  get mdp() {
    return this.loginForm.get('mdp');
  }

}