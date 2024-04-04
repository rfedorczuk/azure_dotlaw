// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LibraryDurationService {
//   private durations: { [key: string]: string } = {
//     "19347943": "1:30:00",
//     "19349945": "3:31:49",
//     "19347952": "2:16:19",
//     "19347949": "2:16:19",
//     "19347944": "2:16:19",
//     "19347940": "2:16:19",
//     // możesz tutaj dodawać więcej par klucz-wartość
//   };

//   constructor() { }

//   getDuration(libraryId: string): string {
//     return this.durations[libraryId] || "00:00:00";
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class LibraryDurationService {
  constructor(private http: HttpClient) {}

  private apiUri = `${environment.apiUri}`;

  getDuration(courseId: number): Observable<any> {
    // Zakładam, że backendowa trasa do pobierania czasu trwania wygląda następująco:
    // GET /api/courses/{courseId}/duration
    // Należy dostosować URL do konfiguracji swojego backendu
    return this.http.get<{ duration: any }>(`${this.apiUri}/course/${courseId}/duration`)
      .pipe(
        map(response => response.duration)
      );
  }
}
