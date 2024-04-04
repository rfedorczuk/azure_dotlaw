import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
 

export class FooterComponent implements OnInit {
    isDashboardPage: boolean = false;
    isAdminDashboardPage: boolean = false;

    constructor(
        public router: Router
    ) { }
    // ngOnInit() {
    //     this.router.events
    //       .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    //       .subscribe((event: NavigationEnd) => {
    //         this.isDashboardPage = event.url.startsWith('/dashboard');
    //       });
    //   }
    ngOnInit() {
        this.router.events
          .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.isDashboardPage = event.url.startsWith('/dashboard');
            this.isAdminDashboardPage = event.url.startsWith('/admin-dashboard'); // Dodaj tę linię
          });
      }
      
    UpperfooterContent = [
        {
            image1: `assets/images/features/Sample.png`,
            image2: `assets/images/features/Avatar.png`,
            image3: `assets/images/features/doubble.png`,
            
            title: `Bogaty materiał, profesjonalni wykładowcy i narzędzia, które pozwoliły mi pogłębić swoją wiedzę prawno-logiczną. Gorąco polecam`,
            title2: `Dołącz do Akademii dotlaw i przenieś swoją organizację na wyższy poziom.`,
            text: `Nasza platforma e-learningowa oferuje kursy z różnych dziedzin prawa, takich jak prawo nowych technologii, ochrona danych, bezpieczeństwo informacji czy prawo korporacyjne. Z nami zdobędziesz wiedzę, która pozwoli Ci rozwijać umiejętności potrzebne w dzisiejszym świecie biznesu i technologii oraz skutecznie i bezpiecznie prowadzić swój interes.`,
           
        }
    ]
    

}