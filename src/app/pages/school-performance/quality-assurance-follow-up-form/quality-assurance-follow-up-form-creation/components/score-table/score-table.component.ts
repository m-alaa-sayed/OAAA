import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-score-table',
    templateUrl: './score-table.component.html',
    styleUrl: './score-table.component.scss'
})
export class ScoreTableComponent {
    @Input() scores!: { [key: string]: any };
    @Input() labels!: Record<string, string>;
    @Input() editable: boolean = true;

    keepOrder = (a: any, b: any): number => 0;
}
