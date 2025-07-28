import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  foundUser: any = null;
  searchMessage: string = '';
  isFriendRequestSent: boolean = false;
  isLoadingSearch: boolean = false;

  username: string | null = null;
  friendsCount: number = 0;
  pendingRequests: any[] = [];
  pendingRequestsMessage: string = '';

  currentLanguage: string = 'en';
  private languageSubscription: Subscription | undefined;

  private baseUrl = 'http://localhost:8081/api/v1';

  constructor(
    private fb: FormBuilder,
    public languageService: LanguageService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.searchForm = this.fb.group({
      searchQuery: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsernameFromToken();
    this.friendsCount = Math.floor(Math.random() * 50) + 10;
    this.fetchPendingFriendRequests();

    this.languageSubscription = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    console.log('DEBUG: Type of error.error:', typeof error.error, 'Is ArrayBuffer:', error.error instanceof ArrayBuffer, 'Error object:', error.error);

    if (!error.error) {
      return this.languageService.translate('An unknown error occurred (no error body).');
    }
    if (error.error instanceof ErrorEvent) {
      return `An error occurred: ${error.error.message}`;
    } else if (typeof error.error === 'string') {
      return error.error;
    } else if (error.error instanceof ArrayBuffer) {
      try {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(error.error);
      } catch (e) {
        console.error('Failed to decode ArrayBuffer error:', e);
        return this.languageService.translate('An unexpected binary error occurred.');
      }
    } else if (typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    }

    if (error.status === 403) {
      return this.languageService.translate('Unauthorized. Please ensure you are logged in.');
    } else if (error.status === 400) {
      return this.languageService.translate('Invalid request data.');
    } else if (error.status === 500) {
      return this.languageService.translate('An unexpected server error occurred.');
    }

    return this.languageService.translate('An unknown error occurred.');
  }

  onSearchUser(): void {
    this.searchMessage = '';
    this.foundUser = null;
    this.isFriendRequestSent = false;

    if (this.searchForm.invalid) {
      this.searchMessage = this.languageService.translate('Please enter a username or email for the search.');
      return;
    }

    this.isLoadingSearch = true;
    const query = this.searchForm.get('searchQuery')?.value;

    let params = new HttpParams().set('query', query);
    const headers = this.getAuthHeaders();

    this.http.get<any[]>(`${this.baseUrl}/friends/search`, { headers, params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Errore durante la ricerca utente:', error);
        this.isLoadingSearch = false;
        this.searchMessage = this.getErrorMessage(error);
        return of(null);
      })
    ).subscribe(response => {
      this.isLoadingSearch = false;
      if (response && response.length > 0) {
        this.foundUser = response[0];
        this.searchMessage = this.languageService.translate('User found!');
      } else {
        this.searchMessage = this.languageService.translate('No user found with this query.');
      }
    });
  }

  onSendFriendRequest(): void {
    const headers = this.getAuthHeaders();

    if (!this.foundUser) {
      console.error('Nessun utente trovato per inviare la richiesta di amicizia.');
      this.searchMessage = this.languageService.translate('No user selected to send the request.');
      return;
    }

    this.http.post<any>(`${this.baseUrl}/friends/sendRequest`, this.foundUser, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Errore durante l\'invio della richiesta di amicizia:', error);
        this.searchMessage = this.getErrorMessage(error);
        this.isFriendRequestSent = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        console.log('Richiesta di amicizia inviata con successo!', response);
        this.isFriendRequestSent = true;
        this.searchMessage = response.message || this.languageService.translate('Friend request sent successfully!');
        this.foundUser = null;
        this.searchForm.reset();
      }
    });
  }

  onCancelSearch(): void {
    this.foundUser = null;
    this.searchMessage = '';
    this.isFriendRequestSent = false;
    this.searchForm.reset();
  }

  fetchPendingFriendRequests(): void {
    this.pendingRequestsMessage = this.languageService.translate('Loading pending requests...');
    const headers = this.getAuthHeaders();

    this.http.get<any[]>(`${this.baseUrl}/friends/pendingRequests`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Errore durante il recupero delle richieste in sospeso:', error);
        this.pendingRequestsMessage = this.getErrorMessage(error);
        return of([]);
      })
    ).subscribe(requests => {
      if (requests && requests.length > 0) {
        this.pendingRequests = requests;
        this.pendingRequestsMessage = '';
      } else {
        this.pendingRequests = [];
        this.pendingRequestsMessage = this.languageService.translate('No pending friend requests.');
      }
    });
  }

  onAcceptFriendRequest(friendRequestId: string): void {
    const headers = this.getAuthHeaders();
    const payload = {
      friendRequestID: friendRequestId,
      status: 2
    };

    const requestOptions = {
      headers: headers,
      responseType: 'text' as 'json',
      observe: 'body' as 'body'
    };

    this.http.post<string>(`${this.baseUrl}/friends/manageRequest`, payload, requestOptions).pipe(
      catchError((error: HttpErrorResponse): Observable<string | null> => {
        console.error('Errore durante l\'accettazione della richiesta:', error);
        this.pendingRequestsMessage = this.getErrorMessage(error);
        return of(null);
      })
    ).subscribe((response: string | null) => {
      if (response) {
        console.log('Risposta dal backend (Accetta):', response);
        this.pendingRequestsMessage = response || this.languageService.translate('Request accepted!');
        this.fetchPendingFriendRequests();
      }
    });
  }

  onRejectFriendRequest(friendRequestId: string): void {
    const headers = this.getAuthHeaders();
    const payload = {
      friendRequestID: parseInt(friendRequestId, 10),
      status: 3
    };

    const requestOptions = {
      headers: headers,
      responseType: 'text' as 'json',
      observe: 'body' as 'body'
    };

    this.http.post<string>(`${this.baseUrl}/friends/manageRequest`, payload, requestOptions).pipe(
      catchError((error: HttpErrorResponse): Observable<string | null> => {
        console.error('Errore durante il rifiuto della richiesta:', error);
        this.pendingRequestsMessage = this.getErrorMessage(error);
        return of(null);
      })
    ).subscribe((response: string | null) => {
      if (response) {
        console.log('Risposta dal backend (Rifiuta):', response);
        this.pendingRequestsMessage = response || this.languageService.translate('Request rejected.');
        this.fetchPendingFriendRequests();
      }
    });
  }
}
