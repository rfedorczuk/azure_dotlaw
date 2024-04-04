import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-featured',
    templateUrl: './featured.component.html',
    styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent {

    constructor(
        public router: Router
    ) { }

    featuredBox = [
        {
            text: `zrealizowanych projektów dla firm`,
            title: `220+`
        },
        {
            text: `nasze doświadczenie w doradztwie biznesowym`,
            title: `+10 lat`
        },
      
        {
            text: `przeszkolonych osób`,
            title: `1500+`
        }
    ]

}