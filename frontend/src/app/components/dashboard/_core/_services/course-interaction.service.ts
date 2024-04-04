import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseInteractionService {
  private courseTitleSource = new BehaviorSubject<string>('');
  currentCourseTitle = this.courseTitleSource.asObservable();

  constructor() {}

  changeCourseTitle(title: string) {
    this.courseTitleSource.next(title);
  }
}
