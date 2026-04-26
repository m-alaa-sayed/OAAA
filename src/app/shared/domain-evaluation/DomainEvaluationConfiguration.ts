import {ex} from "@fullcalendar/core/internal-common";

export interface DomainEvaluationConfiguration {
    mainStandardCodes: string[];
    secondaryStandardCodes: string[];
}

export const JUDGMENT: Record<number, string> = {
    1: 'EXCELLENT',
    2: 'GOOD',
    3: 'ACCEPTABLE',
    4: 'INADEQUATE',
    5: 'NEEDS_URGENT_INTERVENTION',
    0: 'INVALID'
};

export const DOMAIN_EVALUATION_CONFIGURATIONS: Record<string, DomainEvaluationConfiguration> = {
    'ACADEMIC_ACHIEVEMENT': {
        mainStandardCodes: ['1.1', '1.2'],
        secondaryStandardCodes: ['1.3']
    },
    'PERSONAL_DEVELOPMENT': {
        mainStandardCodes: ['2.1', '2.2'],
        secondaryStandardCodes: ['2.3', '2.4']
    },
    'TEACHING_AND_ASSESSMENT': {
        mainStandardCodes: ['3.1', '3.2', '3.3', '3.5'],
        secondaryStandardCodes: ['3.4']
    },
    'LEARNING_ENVIRONMENT': {
        mainStandardCodes: ['4.1', '4.2', '4.3'],
        secondaryStandardCodes: ['4.4']
    },
    'LEADERSHIP_AND_GOVERNANCE': {
        mainStandardCodes: ['5.1', '5.2', '5.3', '5.5'],
        secondaryStandardCodes: ['5.4']
    },
};