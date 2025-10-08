import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Simulación de login - en producción validar credenciales
    if (this.username && this.password) {
      // Simular token de autenticación
      localStorage.setItem('token', 'demo-token-123');
      this.router.navigate(['/dashboard']);
    }
  }

  // Método para desarrollo - login automático
  devLogin() {
    localStorage.setItem('token', 'demo-token-123');
    this.router.navigate(['/dashboard']);
  }
}