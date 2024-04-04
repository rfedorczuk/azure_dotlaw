import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseSelectionService {
  private selectedCourseTitle: string | null = null;

  constructor() { }

  selectCourse(title: string) {
    this.selectedCourseTitle = title;
  }

  getSelectedCourseTitle(): string | null {
    return this.selectedCourseTitle;
  }

  clearSelectedCourse() {
    this.selectedCourseTitle = null;
  }
}
