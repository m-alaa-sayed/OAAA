import {Injectable} from '@angular/core';
import {DOMAIN_EVALUATION_CONFIGURATIONS, JUDGMENT} from "./DomainEvaluationConfiguration";

@Injectable({
    providedIn: 'root'
})
export class DomainJudgmentUtilsService {


    constructor() {
    }

    public evaluateDomainJudgment(standardJudgment: Record<string, number>, domainCode: string): number {
        const domainEvaluationConfiguration = DOMAIN_EVALUATION_CONFIGURATIONS[domainCode];
        const mainStandardValues: number[] = domainEvaluationConfiguration.mainStandardCodes.map(code => standardJudgment[code] ?? 0);
        const secondaryStandardValues: number[] = domainEvaluationConfiguration.secondaryStandardCodes.map(code => standardJudgment[code] ?? 0);
        return this.evaluate(mainStandardValues, secondaryStandardValues);
    }

    public evaluate(mainJudgments: number[], secondaryJudgments: number[]): number {

        if (mainJudgments.some(j => j === 5)) return 5;

        if (mainJudgments.some(j => j === 0) || secondaryJudgments.some(j => j === 0))
            return 0;

        else if (mainJudgments.every(j => j === 1) && secondaryJudgments.every(j => j <= 2))
            return 1;
        else if (mainJudgments.every(j => j <= 2) && secondaryJudgments.every(j => j <= 3))
            return 2;
        else if (mainJudgments.every(j => j <= 3) && secondaryJudgments.every(j => j <= 4))
            return 3;
        else if (mainJudgments.every(j => j <= 4) || secondaryJudgments.some(j => j === 5))
            return 4;

        return 3;
    }

    public getJudgmentLabel(judgment: number): string {
        return JUDGMENT[judgment];
    }

    getJudgmentStyles(judgment: number | null | undefined): any {
        const baseStyles = {
            'padding': '0.75rem 1.25rem',
            'min-height': '2.75rem'
        };

        if (!judgment || judgment < 1 || judgment > 5) {
            return {
                ...baseStyles,
                'background-color': 'transparent',
                'color': 'inherit'
            };
        }

        const judgmentColors: Record<number, { bg: string; hover: string }> = {
            1: { bg: 'rgb(0,176,80)',   hover: 'rgb(0,150,68)' },   // متميز - Green
            2: { bg: 'rgb(146,208,80)', hover: 'rgb(120,180,60)' }, // جيد - Light Green
            3: { bg: 'rgb(255,255,0)',  hover: 'rgb(230,230,0)' },  // ملائم - Yellow
            4: { bg: 'rgb(244,176,131)',hover: 'rgb(220,150,110)'}, // غير ملائم - Orange
            5: { bg: 'rgb(255,0,0)',    hover: 'rgb(200,0,0)' }     // يحتاج تدخل سريع - Red
        };

        // const judgmentColors: Record<number, { bg: string; hover: string }> = {
        //     1: {bg: '#28a745', hover: '#1e7e34'}, // Green - متميز
        //     2: {bg: '#8bc34a', hover: '#7cb342'}, // Light Green - جيد
        //     3: {bg: '#ffc107', hover: '#e0a800'}, // Yellow - ملائم
        //     4: {bg: '#fd7e14', hover: '#e8650e'}, // Orange - غير ملائم
        //     5: {bg: '#dc3545', hover: '#c82333'}  // Red - يحتاج إلى تدخل سريع
        // };

        return {
            ...baseStyles,
            'background-color': judgmentColors[judgment].bg,
            'color': 'black',
            'font-weight': 'bold',
            'transition': 'background-color 0.3s ease'
        };
    }

}
