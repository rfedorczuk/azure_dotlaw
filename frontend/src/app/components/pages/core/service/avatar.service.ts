import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string | null>(null);
  
  constructor() {
    const savedAvatarUrl = localStorage.getItem('avatarUrl');
    if (savedAvatarUrl) {
      this.avatarSubject.next(savedAvatarUrl);
    }
  }

  updateAvatarUrl(newAvatarUrl: string): void {
    this.avatarSubject.next(newAvatarUrl);
  }

  getAvatarUrl(): Observable<string | null> {
    return this.avatarSubject.asObservable();
  }

  resetAvatarUrl(): void {
    this.avatarSubject.next(null);
  }
  
}


