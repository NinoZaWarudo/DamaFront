import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private openModalSubject = new Subject<void>();

  openModal$ = this.openModalSubject.asObservable();

  constructor() { }

  openSupportModal(): void {
    this.openModalSubject.next();
  }
}
