import { Component, OnInit, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../_core/_services/exam.service';

@Component({
  selector: 'app-course-exam',
  templateUrl: './course-exam.component.html',
  styleUrls: ['./course-exam.component.scss'],
})
export class CourseExamComponent implements OnInit {
  startingIndex: number = 4;
  courseId: number = 0;

  questionText: string = '';
answerText: string = '';
currentQuestionId: number | null = null;
isCorrect: boolean = false;
questions: any[] = [];
activeQuestionIndex: number = 0;


  calculateIndex(index: number): number {
    return index + this.startingIndex;
  }

  ngOnInit() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    if (courseIdParam) {
      this.courseId = +courseIdParam;
      // Dodaj domyślne pytanie
      this.addNewQuestion();
    } else {
      console.error('Brak parametru courseId w trasie.');
      this.router.navigate(['/admin-dashboard']); // Dostosuj do swojej ścieżki
    }
  }
  
  textOptions: string[] = [];
  textOptionsecond: string[] = [];

  selectedtxt: string = ''; // Initialize with an empty string or provide a default value
  selectedText: string = ''; // Initialize with an empty string or provide a default value


  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private elRef: ElementRef
  ) {}
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const dropdownMenu = this.elRef.nativeElement.querySelector('.dropdown-menu');

    if (dropdownMenu && event.target !== dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
      dropdownMenu.classList.remove('show');
    }
  }
  trackByIndex(index: number): number {
    return index + 1; // Add 1 to the index
  }

  addRadioButton() {
    this.textOptions.push(`Option ${this.textOptions.length + 1}`);
    this.cdRef.detectChanges();
  }

  removeRadioButton(index: number) {
    this.textOptions.splice(index, 1);
  }

  addRadioBtn() {
    this.textOptionsecond.push(`Option ${this.textOptionsecond.length + 1}`);
    this.cdRef.detectChanges();
  }

  removeRadioBtn(index: number) {
    this.textOptionsecond.splice(index, 1);
  }

  removeRadiofirst() {
    const div = document.getElementById('myDiv');
    if (div) {
      div.style.display = 'none';
    }
  }

  addSecondDiv() {
    const firstDiv = document.getElementsByClassName(
      'first-parent'
    )[0] as HTMLElement | undefined;
    const div = document.getElementById('second-section');
    const secondTab = document.querySelector('.secondtab'); // Use querySelector to get the first matching element
    const firstTab = document.querySelector('.firsttab');
    if (secondTab) {
      secondTab.classList.remove('d-none'); // Add 'd-none' class directly
    }
    if (firstTab) {
      firstTab.classList.add('not-active'); // Add 'd-none' class directly
    }
    if (firstDiv) {
      firstDiv.style.display = 'none';
    }

    if (div) {
      div.style.display = 'block';
    }
  }

  firstTab() {
    const firstDiv = document.getElementsByClassName(
      'first-parent'
    )[0] as HTMLElement | undefined;
    const div = document.getElementById('second-section');
    const secondTab = document.querySelector('.secondtab'); // Use querySelector to get the first matching element
    const firstTab = document.querySelector('.firsttab');
    if (firstTab) {
      firstTab.classList.remove('not-active'); // Add 'd-none' class directly
    }
    if (secondTab) {
      secondTab.classList.add('d-none'); // Add 'd-none' class directly
    }
  
    if (firstDiv) {
      firstDiv.style.display = 'block';
    }

    if (div) {
      div.style.display = 'none';
    }
    
  }
 
  setActiveQuestion(index: number) {
    this.activeQuestionIndex = index;
  }

  
  public isOpenAray: boolean[] = [false, false, false, false, false, false, false, false, false, false];

  toggleDropdon(index: number): void {
    this.isOpenAray[index] = !this.isOpenAray[index];
  }

  textsuccess(index: number): void {
    const textarea = document.getElementById(`radioButton${index}`);
    if (textarea) {
      textarea.classList.add('border-success');
    }
  }

  public isOpenArray: boolean[] = [false, false, false, false, false, false, false, false, false, false];

  toggleDropdown(index: number): void {
    this.isOpenArray[index] = !this.isOpenArray[index];
  }

  clickOutsideDropdown(event: Event, index: number): void {
    if (!this.el.nativeElement.contains(event.target)) {
      // Clicked outside the dropdown
      this.isOpenArray[index] = false;
    }
  }

  // moveSecondpage() {
  //   this.router.navigate(['dashboard/edycja-Szkolenia']);
  // }

  myFunction(): void {
    this.hideDropdown();
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) {
      dropdown.classList.toggle("show");
    }
  }
  
  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    

    // Check if the clicked element is not a dropdown button
    if (!(event.target instanceof Element) || !event.target.matches('.dropbtn')) {
      // Close all dropdowns by removing the 'show' class
     
      const dropdowns = document.getElementsByClassName("dropdown-content");
      
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i] as HTMLElement;
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  
 
  hideDropdown(): void {
 
    const dropdowns = document.querySelectorAll(".dropdown-content.show") as NodeListOf<HTMLElement>;
    dropdowns.forEach((dropdown: HTMLElement) => {
      dropdown.classList.remove("show");
    });
  }



  mdFunction(index: number): void {
    this.hideDropdown();
    const dropdown = document.getElementById("myDropdown" + index);
    if (dropdown) {
      dropdown.classList.toggle("show");
    }
    
  }

  addNewQuestion() {
    const newQuestion = {
      questionText: '',
      answers: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ],
      isCorrect: false,
    };
  
    this.questions.push(newQuestion);
    this.setActiveQuestion(this.questions.length - 1); // Przełącz na nowe pytanie
  }

  
  
  
  submitQuestion(index: number) {
    const question = this.questions[index];
    if (question.questionText) {
      this.examService.addQuestion(this.courseId, question.questionText).subscribe(
        (response: any) => {
          question.currentQuestionId = response.questionId;
          question.questionText = '';
          // Tutaj możesz dodać logikę do odświeżenia listy pytań / odpowiedzi
        },
        (error) => {
          console.error('Błąd przy dodawaniu pytania', error);
        }
      );
    } else {
      alert('Treść pytania nie może być pusta.');
    }
  }

  saveAllQuestions() {
    this.questions.forEach((question, qIndex) => {
      if (question.questionText && question.currentQuestionId) {
        question.answers.forEach((answer: { answerText: string; isCorrect: boolean; }, aIndex: number) => {
          if (answer.answerText) {
            this.examService.addAnswer(question.currentQuestionId, answer.answerText, answer.isCorrect).subscribe(
              response => {
                console.log(`Odpowiedź ${aIndex + 1} dla pytania ${qIndex + 1} zapisana.`);
              },
              error => {
                console.error('Błąd przy dodawaniu odpowiedzi', error);
              }
            );
          }
        });
      } else if (question.questionText) {
        // Zapisz pytanie, jeśli jeszcze nie ma ID
        console.log(`Zapisywanie pytania ${qIndex + 1}.`);
      }
    });
  }
  
  
  addAnswerToQuestion(questionIndex: number) {
    this.questions[questionIndex].answers.push({
      answerText: '',
      isCorrect: false,
    });
  }
  submitAnswer(questionIndex: number, answerIndex: number) {
    const question = this.questions[questionIndex];
    const answer = question.answers[answerIndex];
  
    if (answer.answerText && question.currentQuestionId) {
      this.examService.addAnswer(question.currentQuestionId, answer.answerText, answer.isCorrect).subscribe(
        (response) => {
          // Tutaj możesz zresetować stan odpowiedzi lub zaktualizować UI
          answer.answerText = '';
          answer.isCorrect = false;
          // Dodaj logikę odświeżania listy odpowiedzi, jeśli to konieczne
        },
        (error) => {
          console.error('Błąd przy dodawaniu odpowiedzi', error);
        }
      );
    } else {
      alert('Treść odpowiedzi nie może być pusta lub nie wybrano pytania.');
    }
  }
  


}
