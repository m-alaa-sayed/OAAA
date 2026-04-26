export const MODULE_SERVICE_MAP = [
  { module: 'CHEQA', serviceCode: 'CHEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION' },
  { module: 'CSEQA', serviceCode: 'CSEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION' },
  { module: 'OQF', serviceCode: 'OQF_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION' }
];

export const DELETION_MODULE_SERVICE_MAP = [
  { module: 'CHEQA', serviceCode: 'CHEQA_EXTERNAL_REVIEWER_DELETION' },
  { module: 'CSEQA', serviceCode: 'CSEQA_EXTERNAL_REVIEWER_DELETION' },
  { module: 'OQF', serviceCode: 'OQF_EXTERNAL_REVIEWER_DELETION' }
];

export function getServiceCodeByModule(moduleName: string): string | null {
  const found = MODULE_SERVICE_MAP.find(item => item.module === moduleName);
  return found ? found.serviceCode : null;
}

export function getDeletionServiceCodeByModule(moduleName: string): string | null {
  const found = DELETION_MODULE_SERVICE_MAP.find(item => item.module === moduleName);
  return found ? found.serviceCode : null;
}