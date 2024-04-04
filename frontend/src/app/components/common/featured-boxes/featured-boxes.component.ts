import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-featured-boxes',
    templateUrl: './featured-boxes.component.html',
    styleUrls: ['./featured-boxes.component.scss']
})
export class FeaturedBoxesComponent {

    constructor(
        public router: Router
    ) { }

    featuredBox = [
        {
            icon: `assets/images/featured/knowledge_icon.svg`,
            title: `Aktualna wiedza`,
            paragraph: `Korzystając z naszej platformy e-learningowej możesz być pewien, że zdobędziesz najbardziej aktualną wiedzę. Świat prawa i technologii stale się rozwija, dlatego nasze szkolenia są oparte na najnowszych trendach i zmianach w tych dziedzinach.`
        },
        {
            icon: `assets/images/featured/experience_icon.svg`,
            title: `Wieloletnie doświadczenie`,
            paragraph: `Nasze kursy zostały stworzone przez wykwalifikowanych i doświadczonych specjalistów, którzy posiadają wieloletnie doświadczenie w branży. Dzięki temu możemy zagwarantować, że kursy są doskonale dostosowane do Twoich potrzeb i oczekiwań.`
        },
        {
            icon: `assets/images/featured/certificate_icon.svg`, 
            title: `Certyfikaty uznania`,
            paragraph: `Nasi twórcy mogą pochwalić się wieloletnim doświadczeniem oraz licznymi sukcesami. Nie musisz już dłużej szukać kursów prowadzonych przez nieznane osoby - u nas masz pewność, że zdobywasz wiedzę u najlepszych w branży.`
        }
    ]

}