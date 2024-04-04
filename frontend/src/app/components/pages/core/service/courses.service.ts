// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, of, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CoursesService {
//   private coursesListCache: any;
//   private coursesCache = new Map<string, any>();

//   constructor(private http: HttpClient) {}

//   getCoursesFromVimeo() {
//     // Sprawdź, czy lista kursów jest już w cache'u
//     if (this.coursesListCache) {
//       // Użyj Observable.of lub of z RxJS, aby zwrócić wartość z cache'a
//       return of(this.coursesListCache);
//     }
  
//     // Jeśli lista kursów nie jest w cache'u, pobierz dane z API
//     return this.http.get<any>('https://demo.crem.support/api/vimeo/courses').pipe(
//       tap(courses => {
//         // Zapisz odpowiedź w cache'u
//         this.coursesListCache = courses;
//       })
//     );
//   }

//   getCourseDetails(courseId: string) {
//   // Sprawdź, czy kurs jest już w cache'u
//   if (this.coursesCache.has(courseId)) {
//     // Użyj Observable.of lub of z RxJS, aby zwrócić wartość z cache'a
//     return of(this.coursesCache.get(courseId));
//   }

//   // Jeśli kursu nie ma w cache'u, pobierz dane z API
//   return this.http.get<any>(`https://demo.crem.support/api/vimeo/courses/${courseId}`).pipe(
//     tap(course => {
//       // Zapisz odpowiedź w cache'u
//       this.coursesCache.set(courseId, course);
//     })
//   );
// }

// purchaseCourse(userId: string, courseId: string, amount: number): Observable<any> {
//   const purchaseData = { user_id: userId, vimeo_course_id: courseId, amount: amount };
//   return this.http.post<any>('https://demo.crem.support/api/new/transactions/purchase', purchaseData);
// }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUri = `${environment.apiUri}`;
  private coursesListCache: any;
  private coursesCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getCoursesFromVimeo() {
    // Check if the courses list is already in the cache
    if (this.coursesListCache) {
      return of(this.coursesListCache);
    }
  
    // If the courses list is not in the cache, fetch it from the API
    return this.http.get<any>(`${this.apiUri}/vimeo/courses`).pipe(
      tap(courses => {
        this.coursesListCache = courses;
      })
    );
  }

  getCourseDetails(courseId: string) {
    // Check if the course is already in the cache
    if (this.coursesCache.has(courseId)) {
      return of(this.coursesCache.get(courseId));
    }

    // If the course is not in the cache, fetch it from the API
    return this.http.get<any>(`${this.apiUri}/vimeo/courses/${courseId}`).pipe(
      tap(course => {
        this.coursesCache.set(courseId, course);
      })
    );
  }

  purchaseCourse(userId: string, courseId: string, amount: number): Observable<any> {``
    const purchaseData = { user_id: userId, vimeo_course_id: courseId, amount: amount };
    return this.http.post<any>(`${this.apiUri}/new/transactions/purchase`, purchaseData);
  }
  enrollUser(userId: number, courseId: number): Observable<any> {
    // Replace with the correct API endpoint
    return this.http.post<any>(`${this.apiUri}/course/enroll`, { userId, courseId });
}

checkIfUserEnrolled(userId: number, courseId: number): Observable<any> {
  return this.http.get(`${this.apiUri}/course/user/${userId}/course/${courseId}/enrolled`);
}

verifyPaymentAndEnroll(userId: string, paymentSessionId: string): Observable<any> {
  return this.http.post<any>(`${this.apiUri}/payments/verify-payment-and-enroll`, {
    userId,
    paymentSessionId
  });
}



  // Additional methods can be added here as needed
}
