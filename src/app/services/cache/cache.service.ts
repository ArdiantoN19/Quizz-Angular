import { Injectable } from '@angular/core';
import { HashService } from '../hash/hash.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private hashService: HashService) {}

  saveCache<T>(key: string, data: T, expired: number = 10000): void {
    expired = expired + Date.now();
    
    const dataString = JSON.stringify({ data, expired });

    const hashData = this.hashService.hash(dataString);
    localStorage.setItem(key, hashData);
  }

  getCache<T>(key: string): {
    data: T[];
    expired: number;
  } | null {
    const dataString = localStorage.getItem(key);

    if (!dataString) {
      return null;
    }

    const decodeQuiz = this.hashService.decode(dataString);
    const result = JSON.parse(decodeQuiz);

    return result as { data: T[]; expired: number };
  }
}
