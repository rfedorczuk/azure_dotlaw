import { Component, OnInit, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../_core/_services/exam.service';
import { firstValueFrom } from 'rxjs'; 

interface QuestionResponse {
  questionId: number;
  // Możesz dodać więcej pól zgodnie z odpowiedzią z serwera
}

interface AnswerResponse {
  answerId: number;
  // Dodatkowe pola, jeśli są zwracane przez API
}

interface Answer {
  id?: number;
  answerText: string;
  isCorrect: boolean;
}



@Component({
  selector: 'app-admin-edit-exam',
  templateUrl: './admin-edit-exam.component.html',
  styleUrls: ['./admin-edit-exam.component.scss']
})
export class AdminEditExamComponent implements OnInit {
  startingIndex: number = 4;
  courseId: number = 0;
  selectedInput: { questionIndex: number, answerIndex: number } | null = null;

  questionText: string = '';
answerText: string = '';
currentQuestionId: number | null = null;
isCorrect: boolean = false;
questions: any[] = [];
activeQuestionIndex: number = 0;
index: number = 0;
isExamSaved: boolean = false;



  calculateIndex(index: number): number {
    return index + this.startingIndex;
  }

  async ngOnInit() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    if (courseIdParam) {
      this.courseId = +courseIdParam;
      try {
        const examData = await firstValueFrom(this.examService.getExam(this.courseId));
        if (examData && examData.length > 0) {
          this.questions = examData.map((question: any) => ({
            currentQuestionId: question.id,
            questionText: question.question_text,
            answers: question.answers.map((answer: any) => ({
              id: answer.id, // Teraz przypisujemy ID do każdej odpowiedzi
              answerText: answer.answer_text,
              isCorrect: answer.is_correct === 1
            }))
          }));
        } else {
          this.addNewQuestion();
        }
        
      } catch (error) {
        console.error('Błąd podczas ładowania egzaminu: ', error);
      }
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

  openContextMenu(event: MouseEvent, questionIndex: number, answerIndex: number): void {
    event.preventDefault();
    this.selectedInput = { questionIndex, answerIndex };
  }
  
  textsuccess(questionIndex: number, answerIndex: number): void {
    // Najpierw ustaw wszystkie odpowiedzi na nieprawidłowe
    this.questions[questionIndex].answers.forEach((answer: { isCorrect: boolean; }) => {
      answer.isCorrect = false;
    });
  
    // Następnie oznacz wybraną odpowiedź jako prawidłową
    this.questions[questionIndex].answers[answerIndex].isCorrect = true;
  
    // Opcjonalnie zaktualizuj UI lub wykonaj inne akcje
  }
  
  
  
  
  
  
  isOpen(questionIndex: number, answerIndex: number): boolean {
    const key = `dropdown-${questionIndex}-${answerIndex}`;
    // Podobnie, jasne typowanie eliminuje problem z niejawnym typem 'any'
    return !!this.isOpenArray[key];
  }
  
  





 // public isOpenArray: boolean[] = [false, false, false, false, false, false, false, false, false, false];
  // Jeśli jeszcze tego nie zrobiłeś, zdefiniuj stan w komponencie
isOpenArray: Record<string, boolean> = {};



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


  dropdownStates: { [key: string]: boolean } = {};

  mdFunction(questionIndex: number, answerIndex: number): void {
    const key = `dropdown-${questionIndex}-${answerIndex}`;
    this.dropdownStates[key] = !this.dropdownStates[key]; // Przełącz stan
    
    // Opcjonalnie, jeśli chcesz manipulować klasami CSS bezpośrednio w komponencie
    const dropdownElement = document.getElementById(key);
    if (dropdownElement) {
      if (this.dropdownStates[key]) {
        dropdownElement.classList.add('show');
      } else {
        dropdownElement.classList.remove('show');
      }
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

  async saveAllQuestions() {
    for (let question of this.questions) {
      console.log('question ',JSON.stringify(question))
        let questionId = question.currentQuestionId;
        if (questionId) {
          console.log('questionId ',questionId)
            // Aktualizuj istniejące pytanie
            await firstValueFrom(this.examService.updateQuestion(questionId, question.questionText));
        } else if (question.questionText.trim()) {
            // Dodaj nowe pytanie, jeśli nie ma currentQuestionId
            const response = await firstValueFrom(this.examService.addQuestion(this.courseId, question.questionText)) as QuestionResponse;
            questionId = response.questionId;
            question.currentQuestionId = questionId; // Zapamiętujemy ID dla nowo dodanego pytania
        }

        // Obsługa odpowiedzi
        for (let answer of question.answers) {
          if (answer.id) {
            // Jeśli odpowiedź ma ID, aktualizujemy istniejącą odpowiedź
            await firstValueFrom(this.examService.updateAnswer(answer.id, answer.answerText, answer.isCorrect));
          } else if (answer.answerText.trim() && questionId) {
            // Jeśli odpowiedź nie ma ID i jest to nowa odpowiedź, dodajemy ją
            await firstValueFrom(this.examService.addAnswer(questionId, answer.answerText, answer.isCorrect));
          }
        }
        
    }
    // Po zapisaniu wszystkich zmian
    this.isExamSaved = true;
    console.log('Wszystkie pytania i odpowiedzi zostały zapisane.');
}



  // async saveAllQuestions() {
  //   for (const question of this.questions) {
  //     if (question.questionText && !question.currentQuestionId) {
  //       try {
  //         // Konwersja Observable na Promise z określonym typem
  //         const response = await firstValueFrom(this.examService.addQuestion(this.courseId, question.questionText)) as QuestionResponse;
  //         const questionId = response.questionId;
  //         question.currentQuestionId = questionId;
  
  //         // Przygotowanie wszystkich Promise dla odpowiedzi
  //         const answerPromises = question.answers
  //           .filter((answer: { answerText: any; }) => answer.answerText) // Filtrujemy puste odpowiedzi
  //           .map((answer: { answerText: string; isCorrect: boolean; }) => 
  //             firstValueFrom(this.examService.addAnswer(questionId, answer.answerText, answer.isCorrect))
  //           );
  
  //         // Czekamy na zapisanie wszystkich odpowiedzi
  //         await Promise.all(answerPromises);
  //         this.isExamSaved = true;
  //         console.log(`Pytanie ${questionId} i jego odpowiedzi zostały zapisane pomyślnie.`);
  //       } catch (error) {
  //         console.error('Błąd przy dodawaniu pytania lub odpowiedzi', error);
  //       }
  //     }
  //   }
  //   // Tutaj możesz dodać logikę po zapisaniu wszystkich pytań, np. komunikat o sukcesie lub przekierowanie
  //   console.log('Wszystkie pytania i odpowiedzi zostały zapisane.');
  // }
  
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
  
  editQuestion(questionId: number, newQuestionText: string) {
    this.examService.updateQuestion(questionId, newQuestionText).subscribe({
        next: (response) => {
            // Aktualizuj pytanie w interfejsie użytkownika
            console.log('Pytanie zaktualizowane', response);
        },
        error: (error) => console.error('Błąd przy aktualizacji pytania', error)
    });
  }

  editAnswer(answerId: number, newAnswerText: string, isCorrect: boolean) {
      this.examService.updateAnswer(answerId, newAnswerText, isCorrect).subscribe({
          next: (response) => {
              // Aktualizuj odpowiedź w interfejsie użytkownika
              console.log('Odpowiedź zaktualizowana', response);
          },
          error: (error) => console.error('Błąd przy aktualizacji odpowiedzi', error)
      });
  }


  deleteQuestion(questionIndex: number) {
    const question = this.questions[questionIndex];
    if (question.currentQuestionId) {
      // Tutaj wywołaj usługę do usunięcia pytania z backendu
      this.examService.deleteQuestion(question.currentQuestionId).subscribe(() => {
        console.log(`Pytanie ${question.currentQuestionId} usunięte`);
      });
    }
    // Usuń pytanie z lokalnej listy
    this.questions.splice(questionIndex, 1);
  }
  

}

