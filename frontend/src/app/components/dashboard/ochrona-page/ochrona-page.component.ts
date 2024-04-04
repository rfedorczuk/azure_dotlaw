import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-ochrona',
  templateUrl: './ochrona-page.component.html',
  styleUrls: ['./ochrona-page.component.scss']
})
export class OchronaComponent { 
  constructor(private cdr: ChangeDetectorRef){}
  @ViewChildren('dropdown')
	dropdownElementRefs!: QueryList<ElementRef>;
// Component code
public isOpenArray: boolean[] = []; // Initialize with the number of dropdowns you have

toggleDropdown(clickedIndex: number): void {
    // Zamienia stan tylko klikniętego dropdownu.
    this.isOpenArray[clickedIndex] = !this.isOpenArray[clickedIndex];

    // Opcjonalnie: Zamyka pozostałe dropdowny, jeśli jest taka potrzeba.
    this.isOpenArray.forEach((_, index) => {
        if (index !== clickedIndex) {
            this.isOpenArray[index] = false;
        }
    });

    // Wywołanie detekcji zmian, aby upewnić się, że Angular zauważy aktualizację stanu.
    this.cdr.detectChanges();
}


@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  let clickedInside = false;

  this.dropdownElementRefs.forEach(ref => {
    if (ref.nativeElement.contains(event.target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    this.isOpenArray = this.isOpenArray.map(() => false);
    this.cdr.detectChanges();
  }
}
}
