import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ExamService } from '../../../_core/_services/exam.service';
import { StepContentPositionState, horizontalStepTransitionAnimation } from '../../../horizontal-step-transition.animation';
import { AuthService } from 'src/app/components/pages/core/service/auth.service';
import { CoursesService } from 'src/app/components/pages/core/service/courses.service';

interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: number; // lub boolean, w zależności od tego, jak dane są zwracane z backendu
}


@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
  animations: [
    horizontalStepTransitionAnimation({ anchor: 'stepTransition', duration: 500 })
  ]
})
export class ExamComponent implements OnInit {
  @Input() courseId: number = 0;
  @Input() courseName: string = ''; 

  current = 0;
  totalSteps = 0;
  dynamicSteps: number[] = Array.from({ length: this.totalSteps }, (_, index) => index);
  
  examQuestions: any[] = [];
  selectedAnswers: { [questionId: number]: number } = {};
  currentQuestionIndex = 0;
  startTime: Date | null = null;
  endTime: Date | null = null;
  correctAnswersCount = 0;
  testDuration = 20; // minutes
  remainingTime: number = this.testDuration * 60; // 20 minut przeliczone na sekundy
  timer: any;
  userName: any;
  userId: any;
  constructor(
      private examService: ExamService, 
      private authService: AuthService) {}

  ngOnInit(): void {
    this.loadExam(this.courseId);
   alert('course '+this.courseId+' coruseName '+this.courseName)
  }

  loadExam(courseId: number) {
    this.examService.getExam(courseId).subscribe(
      (examData) => {
        this.examQuestions = examData;
        this.totalSteps = this.examQuestions.length; // Ustawienie totalSteps na podstawie ilości pytań
        this.startTest();
      },
      (error) => console.error('Error loading exam', error)
    );
  }

  getStepTransition(step: number | string): StepContentPositionState {
    if (typeof step === 'number') {
      console.log('number')
      return (step === this.currentQuestionIndex) ? 'current' : (step < this.currentQuestionIndex) ? 'previous' : 'next';
    } else if (step === 'finish') {
      console.log('finish')
      return (this.currentQuestionIndex === this.totalSteps) ? 'finish' : 'next';
    }
    return 'next';
  }

  formatTime(seconds: number): string {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  startTest() {
    this.startTime = new Date();
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime < 0) {
        clearInterval(this.timer);
        this.endTime = new Date();
        this.completeTest(); // Bezpośrednie wywołanie completeTest() po upłynięciu czasu
      }
    }, 1000);
  }
  
  
  

  selectAnswer(questionId: number, answerId: number) {
    this.selectedAnswers[questionId] = answerId;
  }

getProgressBarWidth(): string {
  const progress = ((this.currentQuestionIndex + 1) / this.examQuestions.length) * 100;
  return progress + '%';
}

onNext() {
  if (this.currentQuestionIndex < this.examQuestions.length - 1) {
    this.currentQuestionIndex++;
  } else {
    this.completeTest();
  }
}

onPrev() {
  if (this.currentQuestionIndex > 0) {
    this.currentQuestionIndex--;
  }
}

completeTest() {
  clearInterval(this.timer); // Zatrzymaj timer
  this.endTime = new Date();

  // Przenieś logikę obliczania wyniku do tej funkcji
  this.correctAnswersCount = this.examQuestions.reduce((count, question) => {
    const selectedAnswer = this.selectedAnswers[question.id];
    const correctAnswer = question.answers.find((answer: Answer) => answer.is_correct === 1);
    return count + (selectedAnswer === correctAnswer?.id ? 1 : 0);
  }, 0);

  const passed = this.correctAnswersCount / this.examQuestions.length >= 0.8;

  if (passed) {
    const userData = this.authService.getUserData();
   // const courseData = this.courseService.getCourseDetails(this.courseId.toString())
    this.userName = `${userData.userName} ${userData.surname}`;
    this.userId = userData.userId;
    // Test zaliczony - generuj certyfikat
    const userName = this.userName; // Tutaj zastosuj logikę do dynamicznego pobierania tej wartości
    const courseName = this.courseName // I tej również
    const date = this.endTime.toLocaleDateString(); // Możesz dostosować format daty, jeśli jest taka potrzeba

    this.examService.generateCertificate(courseName, userName, date, this.courseId, this.userId).subscribe({
      next: (data) => {
        // Obsłuż pobieranie certyfikatu
        const a = document.createElement('a');
        document.body.appendChild(a);
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'certificate.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error generating certificate', error)
    });
  } else {
    // Test niezaliczony - wyświetl komunikat
    alert("Niestety, test nie został zaliczony.");
  }
}

getElapsedTime() {
  if (!this.endTime || !this.startTime) return 0;
  // Convert milliseconds to minutes and fix the number to two decimal places
  return ((this.endTime.getTime() - this.startTime.getTime()) / 1000 / 60).toFixed(2);
}


  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  
}
