import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upper-footer',
    templateUrl: './upper-footer.component.html',
    styleUrls: ['./upper-footer.component.scss']
})
export class UpperfooterComponent {

    constructor(
        public router: Router
    ) { }

    featuresContent = [
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