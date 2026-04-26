import {Component, Input} from '@angular/core';
import {School} from "../../types/school";
import {LanguageUtil} from "../../../../core/util/language.util";

@Component({
    selector: 'app-school-information',
    templateUrl: './school-information.component.html',
    styleUrl: './school-information.component.scss'
})
export class SchoolInformationComponent {

    protected readonly LanguageUtil = LanguageUtil;

    @Input() school: School | null = {} as School;
}
