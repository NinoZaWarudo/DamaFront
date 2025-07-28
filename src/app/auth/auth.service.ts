import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  username: string;
  password:
    string;
}

interface LoginCredentials {
  username: string;
  password:
    string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api/v1/auth';
  private usersUrl = 'http://localhost:8081/api/v1/users';
  private friendsUrl = 'http://localhost:8081/api/v1/friends';

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  saveToken(token: string, rememberMe: boolean = false): void {
    if (this.isBrowser) {
      if (rememberMe) {
        localStorage.setItem('jwtToken', token);
        sessionStorage.removeItem('jwtToken');
      } else {
        sessionStorage.setItem('jwtToken', token);
        localStorage.removeItem('jwtToken');
      }
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    }
    return null;
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('jwtToken');
      sessionStorage.removeItem('jwtToken');
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return this.getToken() !== null;
    }
    return false;
  }

  getUsernameFromToken(): string | null {
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.sub || null;
        } catch (e) {
          console.error('Errore durante la decodifica del token JWT:', e);
          return null;
        }
      }
    }
    return null;
  }

  searchUsers(query: string): Observable<any> {
    return this.http.get(`${this.usersUrl}/search?query=${query}`);
  }

  sendFriendRequest(recipientId: string): Observable<any> {
    return this.http.post(`${this.friendsUrl}/request`, { recipientId });
  }
}
