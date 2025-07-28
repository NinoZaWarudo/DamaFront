import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _currentLanguage = new BehaviorSubject<'it' | 'en'>('it');
  public readonly currentLanguage$ = this._currentLanguage.asObservable();

  private isBrowser: boolean;

  private translations: any = {
    it: {
      appName: 'The New Dama',
      login: 'Accedi',
      register: 'Registrati',
      logout: 'Logout',
      englishButton: 'English',
      support: 'Supporto',
      profile: 'Profilo',
      homeButton: 'Home',
      friends: 'Amici',

      loginTitle: 'Accedi a The New Dama',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Inserisci il tuo username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Inserisci la password',
      rememberMe: 'Ricordami',
      loginButton: 'Accedi',
      forgotPassword: 'Password dimenticata?',
      loginErrorInvalidCredentials: 'Credenziali non valide. Riprova.',
      loginErrorGeneric: 'Si è verificato un errore durante il login.',
      loginErrorMissingFields: 'Per favore, compila tutti i campi obbligatori.',
      usernameRequired: 'Username è obbligatorio.',
      usernameMinLength: 'Username deve avere almeno 4 caratteri.',
      usernameMaxLength: 'Username non può superare i 10 caratteri.',
      passwordRequired: 'Password è obbligatoria.',
      passwordMinLength: 'Password deve avere almeno 8 caratteri.',
      passwordMaxLength: 'Password non può superare i 16 caratteri.',
      passwordPattern: 'Password deve contenere almeno un numero.',
      passwordStrengthWeak: 'Forza password: Debole',
      passwordStrengthMedium: 'Forza password: Media',
      passwordStrengthGood: 'Forza password: Buona',
      passwordStrengthStrong: 'Forza password: Forte',

      registerTitle: 'Registrati a The New Dama',
      nameLabel: 'Nome',
      namePlaceholder: 'Inserisci il tuo nome',
      surnameLabel: 'Cognome',
      surnamePlaceholder: 'Inserisci il tuo cognome',
      emailLabel: 'Email',
      emailPlaceholder: 'Inserisci la tua email',
      registerButton: 'Registrati',
      registerErrorGeneric: 'Si è verificato un errore durante la registrazione.',
      registerErrorMissingFields: 'Per favorere, compila tutti i campi correttamente.',
      nameRequired: 'Nome è obbligatorio.',
      surnameRequired: 'Cognome è obbligatorio.',
      emailRequired: 'Email è obbligatoria.',
      emailInvalid: 'Formato email non valido.',

      homeTitle: 'The New Dama è qui!',
      homeSubtitle: 'Il futuro del gioco della Dama è qui!',
      homePlayOnlineButton: 'GIOCA ONLINE',
      homePlayVsComputerButton: 'GIOCA COL COMPUTER',
      homeLearnToPlayTitle: 'Impara subito a giocare!',
      homeLearnToPlayDescription: 'Molti dei giocatori più forti del mondo hanno iniziato a giocare sul nostro sito!',
      homePlayersOnline: 'Persone online',
      homeGamesPlayedToday: 'Partite disputate oggi',
      homeRegisterButton: 'Registrati',
      homeLoginButton: 'Accedi',

      dashboard: 'Dashboard',
      dashboardWelcomeMessage: 'Benvenuto {{username}}!',
      dashboardSubtitle: 'Mettiti pure comodo e inizia a giocare.',
      dashboardDescription: 'L\'antica arte della dama incontra la tecnologia del futuro. Preparati a sfidare avversari da tutto il mondo in un\'esperienza di gioco senza precedenti.',
      dashboardNinoMessage: '(Se trovi qualcosa che non va, è colpa di Nino. Ma stiamo lavorando sodo per te!)',
      dashboardStatsTitle: 'Statistiche dal Futuro (Dati Inventati)',
      dashboardPlayers: 'Giocatori Attivi Globali',
      dashboardGamesPlayed: 'Partite Giocate Ogni Giorno',
      dashboardSatisfaction: 'Soddisfazione Utenti',
      dashboardTournamentsTitle: 'Prossimi Tornei Globali',
      dashboardTournament1: 'DAMA World Championship 2077 - Neo-Tokyo (Ottobre)',
      dashboardTournament2: 'Cyber-Checkers Open - New York (Novembre)',
      dashboardTournament3: 'Galactic Grandmaster Series - Marte (Dicembre)',
      dashboardLogoutButton: 'Logout',

      supportPageTitle: 'Contatta il Supporto',
      supportEmailLabel: 'La tua Email',
      supportEmailPlaceholder: 'email@example.com',
      supportSubjectLabel: 'Oggetto',
      supportSubjectPlaceholder: 'Breve descrizione del problema',
      supportMessageLabel: 'Il tuo Messaggio',
      supportMessagePlaceholder: 'Descrivi il tuo problema o la tua domanda qui...',
      supportSendButton: 'Invia Messaggio',
      supportSuccessMessage: 'Grazie per il tuo messaggio! Ti risponderemo al più presto.',
      supportErrorMessage: 'Per favore, compila tutti i campi correttamente.',
      supportSubjectRequired: 'L\'oggetto è obbligatorio.',
      supportSubjectMinLength: 'L\'oggetto deve avere almeno 5 caratteri.',
      supportMessageRequired: 'Il messaggio è obbligatorio.',
      supportMessageMinLength: 'Il messaggio deve avere almeno 10 caratteri.',
      supportDirectContact: 'Puoi anche contattarci direttamente via email a',
      supportOrCall: 'o chiamando il',

      loading: 'Caricamento...',

      'Please enter a username or email for the search.': 'Per favore, inserisci un username o un\'email per la ricerca.',
      'An error occurred during the search.': 'Si è verificato un errore durante la ricerca.',
      'Unauthorized. Please ensure you are logged in.': 'Non autorizzato. Assicurati di essere loggato.',
      'Invalid search query.': 'Query di ricerca non valida.',
      'User found!': 'Utente trovato!',
      'No user found with this query.': 'Nessun utente trovato con questa query.',
      'No user selected to send the request.': 'Nessun utente selezionato per inviare la richiesta.',
      'Error sending friend request.': 'Errore durante l\'invio della richiesta di amicizia.',
      'Friend request sent successfully!': 'Richiesta di amicizia inviata con successo!',
      'Loading pending requests...': 'Caricamento richieste in sospeso...',
      'Error loading pending requests.': 'Errore durante il caricamento delle richieste in sospeso.',
      'Unauthorized to view requests.': 'Non autorizzato a visualizzare le richieste.',
      'No pending friend requests.': 'Nessuna richiesta di amicizia in sospeso.',
      'Error accepting friend request.': 'Errore durante l\'accettazione della richiesta di amicizia.',
      'Request accepted!': 'Richiesta accettata!',
      'Error rejecting friend request.': 'Errore durante il rifiuto della richiesta di amicizia.',
      'Request rejected.': 'Richiesta rifiutata.'
    },
    en: {
      appName: 'The New Dama',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      italianButton: 'Italiano',
      support: 'Support',
      profile: 'Profile',
      homeButton: 'Home',
      friends: 'Friends',

      loginTitle: 'Login to The New Dama',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      loginButton: 'Login',
      forgotPassword: 'Forgot password?',
      loginErrorInvalidCredentials: 'Invalid credentials. Please try again.',
      loginErrorGeneric: 'An error occurred during login.',
      loginErrorMissingFields: 'Please fill in all required fields.',
      usernameRequired: 'Username is required.',
      usernameMinLength: 'Username must be at least 4 characters long.',
      usernameMaxLength: 'Username cannot exceed 10 characters.',
      passwordRequired: 'Password is required.',
      passwordMinLength: 'Password must be at least 8 characters long.',
      passwordMaxLength: 'Password cannot exceed 16 characters.',
      passwordPattern: 'Password must contain at least one number.',
      passwordStrengthWeak: 'Password Strength: Weak',
      passwordStrengthMedium: 'Password Strength: Medium',
      passwordStrengthGood: 'Password Strength: Good',
      passwordStrengthStrong: 'Password Strength: Strong',

      registerTitle: 'Register for The New Dama',
      nameLabel: 'First Name',
      namePlaceholder: 'Enter your first name',
      surnameLabel: 'Last Name',
      surnamePlaceholder: 'Enter your last name',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      registerButton: 'Register',
      registerErrorGeneric: 'An error occurred during registration.',
      registerErrorMissingFields: 'Please fill in all fields correctly.',
      nameRequired: 'First Name is required.',
      surnameRequired: 'Last Name is required.',
      emailInvalid: 'Invalid email format.',
      emailRequired: 'Email is required.',

      homeTitle: 'The New Dama is here!',
      homeSubtitle: 'The future of Checkers is here!',
      homePlayOnlineButton: 'PLAY ONLINE',
      homePlayVsComputerButton: 'PLAY VS COMPUTER',
      homeLearnToPlayTitle: 'Learn to play now!',
      homeLearnToPlayDescription: 'Many of the world\'s strongest players started playing on our site!',
      homePlayersOnline: 'People online',
      homeGamesPlayedToday: 'Games played today',
      homeRegisterButton: 'Register',
      homeLoginButton: 'Login',

      dashboard: 'Dashboard',
      dashboardWelcomeMessage: 'Welcome {{username}}!',
      dashboardSubtitle: 'Make yourself comfortable and start playing.',
      dashboardDescription: 'The ancient art of checkers meets the technology of the future. Get ready to challenge opponents from all over the world in an unprecedented gaming experience.',
      dashboardNinoMessage: '(If something goes wrong, it\'s Nino\'s fault. But we are working hard for you!)',
      dashboardStatsTitle: 'Future Statistics (Invented Data)',
      dashboardPlayers: 'Global Active Players',
      dashboardGamesPlayed: 'Games Played Daily',
      dashboardSatisfaction: 'User Satisfaction',
      dashboardTournamentsTitle: 'Upcoming Global Tournaments',
      dashboardTournament1: 'DAMA World Championship 2077 - Neo-Tokyo (October)',
      dashboardTournament2: 'Cyber-Checkers Open - New York (November)',
      dashboardTournament3: 'Galactic Grandmaster Series - Mars (December)',
      dashboardLogoutButton: 'Logout',

      supportPageTitle: 'Contact Support',
      supportEmailLabel: 'Your Email',
      supportEmailPlaceholder: 'email@example.com',
      supportSubjectLabel: 'Subject',
      supportSubjectPlaceholder: 'Brief description of the issue',
      supportMessageLabel: 'Your Message',
      supportMessagePlaceholder: 'Describe your problem or question here...',
      supportSendButton: 'Send Message',
      supportSuccessMessage: 'Thank you for your message! We will reply as soon as possible.',
      supportErrorMessage: 'Please fill in all fields correctly.',
      supportSubjectRequired: 'Subject is required.',
      supportSubjectMinLength: 'Subject must be at least 5 characters long.',
      supportMessageRequired: 'Message is required.',
      supportMessageMinLength: 'Message must be at least 10 characters long.',
      supportDirectContact: 'You can also contact us directly via email at',
      supportOrCall: 'or by calling',

      loading: 'Loading...',

      'Please enter a username or email for the search.': 'Please enter a username or email for the search.',
      'An error occurred during the search.': 'An error occurred during the search.',
      'Unauthorized. Please ensure you are logged in.': 'Unauthorized. Please ensure you are logged in.',
      'Invalid search query.': 'Invalid search query.',
      'User found!': 'User found!',
      'No user found with this query.': 'No user found with this query.',
      'No user selected to send the request.': 'No user selected to send the request.',
      'Error sending friend request.': 'Error sending friend request.',
      'Friend request sent successfully!': 'Friend request sent successfully!',
      'Loading pending requests...': 'Loading pending requests...',
      'Error loading pending requests.': 'Error loading pending requests.',
      'Unauthorized to view requests.': 'Unauthorized to view requests.',
      'No pending friend requests.': 'No pending friend requests.',
      'Error accepting friend request.': 'Error accepting friend request.',
      'Request accepted!': 'Request accepted!',
      'Error rejecting friend request.': 'Error rejecting friend request.',
      'Request rejected.': 'Request rejected.'
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeLanguage();
  }

  initializeLanguage(): void {
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('currentLanguage') as 'it' | 'en';
      if (savedLang) {
        this._currentLanguage.next(savedLang);
      } else {
        const browserLang = navigator.language.includes('it') ? 'it' : 'en';
        this._currentLanguage.next(browserLang);
        localStorage.setItem('currentLanguage', browserLang);
      }
    }
  }

  get currentTranslations(): any {
    return this.translations[this._currentLanguage.value];
  }

  toggleLanguage(): void {
    const newLang = this._currentLanguage.value === 'it' ? 'en' : 'it';
    this._currentLanguage.next(newLang);
    if (this.isBrowser) {
      localStorage.setItem('currentLanguage', newLang);
    }
    console.log('Lingua cambiata in:', newLang);
  }

  translate(key: string): string {
    const currentLang = this._currentLanguage.value;
    return this.translations[currentLang][key] || key;
  }
}
