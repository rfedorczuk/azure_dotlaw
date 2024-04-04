import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';
import Player from '@vimeo/player';
import {
  ProgressService
} from '../_core/_services/progress.service';
import {
  StepContentPositionState,
  horizontalStepTransitionAnimation
} from '../horizontal-step-transition.animation';
import {
  ExamService
} from '../_core/_services/exam.service';
import {
  LibraryDurationService
} from '../../pages/core/service/library-duration.service';
import { NotesService } from '../_core/_services/notes.service';
import { catchError, finalize, of, switchMap, throwError } from 'rxjs';


@Component({
  selector: 'app-your-course',
  templateUrl: './your-course.component.html',
  styleUrls: ['./your-course.component.scss'],
})
export class YourCourseComponent implements OnInit, AfterViewInit, OnDestroy  {

  //@ViewChild('vimeoPlayer') vimeoPlayer?: ElementRef;
  @ViewChildren('vimeoPlayer') vimeoPlayer?: QueryList<ElementRef>;
  
  public showTest: boolean = false;
  public isCourseCompleted: boolean = false;

  private player: any;
  private lastSavedTime = 0;
  private userId: number = 0; // Zaktualizuj to zgodnie z logiką uwierzytelniania
  public _videoUrl: SafeResourceUrl | null = null;
  public rawVideoUrl: string | undefined;
  public safeVideoUrl: SafeResourceUrl | null = null;

  @Input() course_id: number = 0; // ID kursu
  @Input() user_id: number = 0;
  @Input() courseName: string = '';
  @Input() courseDuration: number = 0;
  @Input() courseCategory: string = '';
  @Input() authorName: string = '';
  @Input() lessons: any[] = [];
  @Output() returnToCourses = new EventEmitter < void > ();

  activeTab: number = 0;

  isNoteExpanded = false;
  notes: any[] = [];
  noteContent: string = '';
  activeNoteId: number | null = null;
  activeNote: any = { content: '' };
  isStep1Expanded: boolean = false;
  lessonId: number = 0;

  //exam
  examQuestions: any[] = [];
  currentQuestionIndex = -1;
  selectedAnswers: {
      [questionId: number]: number
  } = {};

  currentQuestion: any = null;
  showTestResult: boolean = false;
  current = 0;
  totalSteps = 7;

  courseDurationDisplay: string = "";
  authorDisplay: string = "";

  constructor(private sanitizer: DomSanitizer,
      private progressService: ProgressService,
      private examService: ExamService,
      private libraryDurationService: LibraryDurationService,
      private notesService: NotesService,
      private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      // this.loadExam(this.course_id);
      console.log('this.course_id ',this.course_id)
      if (this.course_id) {
        this.libraryDurationService.getDuration(this.course_id).subscribe(duration => {
          this.courseDurationDisplay = duration;
          console.log('Duration:', duration);
        }, error => {
          console.error('Error fetching duration:', error);
        });
          this.authorDisplay = this.reversedLessons[0].author;
          this.rawVideoUrl = this.reversedLessons[0].rawVideoUrl;
         // this.initializeVimeoPlayer();
          //this.rawVideoUrl = this.lessons[0].rawVideoUrl;
        //  alert('rawVideoUrl '+this.rawVideoUrl)
        //  this.initializeVimeoPlayer();
      }
    console.log('lessons: ', this.lessons[0])
  }

  // setActiveTab(index: number) {
  //     this.activeTab = index;
  // }
  setActiveTab(index: number): void {
    this.activeTab = index;
    const selectedLesson = this.reversedLessons[index];
    this.rawVideoUrl = selectedLesson.rawVideoUrl;
    this.lastSavedTime = 0; 
    
    // Niszczenie poprzedniego odtwarzacza, jeśli istnieje
    if (this.player) {
      this.player.destroy();
    }
    // Opóźnienie potrzebne, aby upewnić się, że Angular zaktualizował widok
    setTimeout(() => this.initializeVimeoPlayer(), 10);
  }
  
  
  
  

  ngAfterViewInit(): void {
    // Sprawdzamy, czy this.vimeoPlayer jest zdefiniowane
    if (this.vimeoPlayer) {
      // Subskrybujemy na zmiany w QueryList
      this.vimeoPlayer.changes.subscribe((comps: QueryList<ElementRef>) => {
        if (comps.length > 0) {
          // Tutaj możesz zainicjalizować odtwarzacz dla pierwszego elementu lub dla wszystkich, w zależności od logiki
          this.initializeVimeoPlayer();
        }
      });
  
      // Jeśli elementy są już dostępne, inicjalizujemy odtwarzacz
      if (this.vimeoPlayer.length > 0) {
        this.initializeVimeoPlayer();
      }
    }
  }
  
  get reversedLessons() {
      return this.lessons.slice().reverse();
  }

  private initializeVimeoPlayer(): void {
    console.log('rawVideoUrl ', this.rawVideoUrl);
  
    if (!this.rawVideoUrl) {
      console.error('URL wideo jest niezdefiniowany');
      return;
    }
  
    const videoIdMatch = this.rawVideoUrl.match(/video\/(\d+)/);
    if (!videoIdMatch) {
      console.error('Nie można znaleźć ID wideo w URL');
      return;
    }
  
    this.lessonId = parseInt(videoIdMatch[1], 10);
    if (isNaN(this.lessonId)) {
      console.error('Nie udało się przekonwertować ID wideo na numer');
      return;
    }
    console.log('Video ID: ', this.lessonId);
  
    if (!this.rawVideoUrl || !this.vimeoPlayer || this.vimeoPlayer.length === 0) {
      console.error('Element VimeoPlayer lub rawVideoUrl jest undefined lub nie ma elementów');
      return;
    }
  
    if (this.vimeoPlayer && this.vimeoPlayer.length > 0) {
      const playerElementRef = this.vimeoPlayer.toArray()[this.activeTab];
      if (playerElementRef) {
        this.player = new Player(playerElementRef.nativeElement, {
          url: this.rawVideoUrl,
          autoplay: false,
          controls: true,
        });
  
        this.registerPlayerEvents(); // Rejestruj zdarzenia dla nowej instancji odtwarzacza
  
       // this.cdr.detectChanges();
      } else {
        console.error('Nie znaleziono elementu odtwarzacza dla aktywnej zakładki.');
      }
    } else {
      console.error('Elementy odtwarzacza nie są dostępne.');
    }
  
    this.cdr.detectChanges();
  
    this.progressService.getProgress(this.user_id, this.course_id, this.lessonId).subscribe(
      response => {
        const progress = response.progress;
        this.player.getDuration().then((duration: number) => {
          this.isCourseCompleted = progress >= (duration - 30);
          console.log('isCourseCompleted  ',this.isCourseCompleted )
  
          if (progress < duration) {
            this.setPlayerTime(progress);
          } else {
            console.warn('Progress time is greater than or equal to video duration, starting from the beginning');
            this.setPlayerTime(0);
          }
        });
      },
      error => {
        console.error('Error fetching progress:', error);
        this.setPlayerTime(0);
      }
    );
  }
  
  private registerPlayerEvents(): void {
    this.player.on('timeupdate', (data: { seconds: number }) => {
      console.log('timeupdate event', data.seconds, 'lastSavedTime', this.lastSavedTime);
      if (data.seconds - this.lastSavedTime >= 10) {
        console.log('Saving progress...');
  
        // Tutaj aktualizujesz lastSavedTime przed wywołaniem saveProgress,
        // aby zapewnić, że kolejne wywołanie nastąpi nie wcześniej niż po upływie kolejnych 30 sekund.
        this.lastSavedTime = data.seconds;
  
        this.progressService.saveProgress(this.user_id, this.course_id, this.lessonId, data.seconds)
          .pipe(
            switchMap(() => of('Progress saved without further actions')),
            catchError(error => {
              console.error('Error during operations:', error);
              return throwError(() => new Error(error));
            })
          )
          .subscribe({
            next: (result) => console.log(result),
            error: (error) => console.error('Error updating course status:', error)
          });
      }
    });
  }
  
  
  
  
  // private initializeVimeoPlayer(): void {
  //   console.log('rawVideoUrl ', this.rawVideoUrl);
  

  //   if (!this.rawVideoUrl) {
  //     console.error('URL wideo jest niezdefiniowany');
  //     return;
  //   }

  //   // Wyodrębnianie ID wideo z URL
  //   const videoIdMatch = this.rawVideoUrl.match(/video\/(\d+)/);
  //   if (!videoIdMatch) {
  //     console.error('Nie można znaleźć ID wideo w URL');
  //     return;
  //   }
  //   this.lessonId = parseInt(videoIdMatch[1], 10); // Convert to number using parseInt
  //   if (isNaN(this.lessonId)) {
  //     console.error('Nie udało się przekonwertować ID wideo na numer');
  //     return;
  //   }
  //   console.log('Video ID: ', this.lessonId);
    
  
  //   // Sprawdzenie, czy istnieje jakikolwiek element i czy rawVideoUrl jest zdefiniowany
  //   if (!this.rawVideoUrl || !this.vimeoPlayer || this.vimeoPlayer.length === 0) {
  //     console.error('Element VimeoPlayer lub rawVideoUrl jest undefined lub nie ma elementów');
  //     return;
  //   }
  
  //   // Pobranie pierwszego elementu z QueryList
  //   if (this.vimeoPlayer && this.vimeoPlayer.length > 0) {
  //     // Znajdujemy element DOM dla aktywnej zakładki
  //     const playerElementRef = this.vimeoPlayer.toArray()[this.activeTab];
  //     if (playerElementRef) {
  //       // Inicjalizujemy odtwarzacz Vimeo dla znalezionego elementu
  //       this.player = new Player(playerElementRef.nativeElement, {
  //         url: this.rawVideoUrl,
  //         autoplay: false,
  //         controls: true,
  //       });
  //       this.cdr.detectChanges();
  //     } else {
  //       console.error('Nie znaleziono elementu odtwarzacza dla aktywnej zakładki.');
  //     }
  //   } else {
  //     console.error('Elementy odtwarzacza nie są dostępne.');
  //   }
  
  //     this.cdr.detectChanges(); // Wywołanie detekcji zmian po inicjalizacji odtwarzacza
  
  //     // Logika dotycząca pobierania postępu kursu i aktualizacji stanu ukończenia kursu
  //     this.progressService.getProgress(this.user_id, this.course_id, this.lessonId).subscribe(
  //       response => {
  //           const progress = response.progress;
  //           this.player.getDuration().then((duration: number) => {
  //               this.isCourseCompleted = progress >= (duration - 30);
      
  //               if (progress < duration) {
  //                   this.setPlayerTime(progress);
  //               } else {
  //                   console.warn('Progress time is greater than or equal to video duration, starting from the beginning');
  //                   this.setPlayerTime(0);
  //               }
  //           });
  //       },
  //       error => {
  //           console.error('Error fetching progress:', error);
  //           this.setPlayerTime(0);
  //       }
  //     );
     
  // }
  private setPlayerTime(progressTime: number): void {
    console.log('setPlayerTime progressTime', progressTime);
    this.cdr.detectChanges();
  
    this.player.ready().then(() => {
      return this.player.getDuration().then((duration: number) => {
        console.log('duration', duration);
        // Sprawdź, czy progressTime jest mniejszy niż duration lub równy 0
        if (progressTime < duration || progressTime === 0) {
          console.log('warunek spelniony')
          return this.player.setCurrentTime(progressTime).then(() => {
            console.log('progressTime', progressTime);
            this.lastSavedTime = progressTime; // Aktualizuj lastSavedTime tutaj
            console.log(`Player time set to ${progressTime}, lastSavedTime updated to ${this.lastSavedTime}`);
          });
        }
      });
    }).catch((error: any) => {
      console.error('Error initializing player or setting time:', error);
    });
  }
  
  

// private setPlayerTime(progressTime: number): void {
//   console.log('setPlayerTime')
//   this.cdr.detectChanges();
//   this.player.ready().then(() => {
//       return this.player.getDuration().then((duration: number) => {
//           if (progressTime < duration) {
//               return this.player.setCurrentTime(progressTime);
//           } else {
//               console.warn('Progress time is greater than video duration, starting from the beginning');
//               return this.player.setCurrentTime(0);
//           }
//       });
//   }).then(() => {
//   }).catch((error: any) => {
//       console.error('Error initializing player:', error);
//   });


//   this.player.on('timeupdate', (data: { seconds: number }) => {
//     console.log('player.on')
//     if (data.seconds - this.lastSavedTime > 30) {
//       this.lastSavedTime = data.seconds;
//       console.log('lastSavedTime ', this.lastSavedTime);
//       console.log('this.user_id, this.course_id, this.lessonId, data.seconds ', this.user_id, this.course_id, this.lessonId, data.seconds);
//       this.cdr.detectChanges();
//       this.progressService.saveProgress(this.user_id, this.course_id, this.lessonId, data.seconds)
//         .pipe(
//           switchMap(() => {
//             // Jeśli jest potrzeba wywołania kolejnej metody serwisu po zapisaniu postępu, to tutaj można to zrobić.
//             // Na przykład, jeśli potrzebujemy aktualizować status kursu na podstawie czasu trwania, można to zaimplementować tutaj.
//             // Poniżej zakładam, że nie ma dodatkowego wywołania serwisu i zwracam obserwowalny z symulowanym sukcesem.
//             // Należy to dostosować zgodnie z rzeczywistymi wymaganiami.
//             return of('Progress saved without further actions');
//           }),
//           catchError(error => {
//             console.error('Error during operations:', error);
//             return throwError(() => new Error(error));
//           })
//         )
//         .subscribe({
//           next: (result) => console.log(result), // Tutaj można dostosować komunikat logowania na podstawie rzeczywistej odpowiedzi.
//           error: (error) => console.error('Error updating course status:', error)
//         });
//     }
//   });
// }


  startExam(): void {
    if (!this.isCourseCompleted) {
      alert('Ukończ szkolenie, aby wykonać test.');
      return;
    }
    alert('this.courseName'+this.courseName)
    this.showTest = true;
    this.cdr.detectChanges(); // Ręczne wywołanie detekcji zmian
  }
  
  handleFinishExam(result: any): void {
      // Obsługa zakończenia egzaminu
      console.log('Egzamin zakończony', result);
      this.showTest = false;
  }
  onExamCompleted(): void {
      this.showTest = false; // Egzamin zakończony
  }


  toggleNote() {
    this.isNoteExpanded = !this.isNoteExpanded;
    if (this.isNoteExpanded) {
      alert('fetch')

      this.fetchNotes();
    }
  }

  fetchNotes() {
    this.notesService.getNotes(this.user_id, this.course_id).subscribe(
      (data) => {
        this.notes = data;
        console.log(this.notes);
      },
      (error) => {
        console.error('Błąd podczas pobierania notatek:', error);
      }
    );
  }

  saveNote(): void {
    alert('course_id '+this.course_id)
    const note = {
      user_id: this.user_id,
      course_id: this.course_id,
      content: this.noteContent
    };
    this.notesService.saveNote(note).subscribe(response => {
      console.log('Notatka zapisana:', response);
    //  this.noteContent = ''; // Opcjonalnie, wyczyść pole po zapisie
    }, error => {
      console.error('Błąd zapisu notatki:', error);
    });
  }

  editNote(noteId: number) {
    const note = this.notes.find(note => note.id === noteId);
    if (note) {
      this.noteContent = note.content;
      this.activeNoteId = note.id;
      this.isNoteExpanded = true; // Otwórz edytor
    }
  }


  onReturnClick(): void {
      this.returnToCourses.emit();
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }

}