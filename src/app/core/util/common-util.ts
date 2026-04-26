export class CommonUtil {
  static deepCopyList(list: any[]) {
    const newList: any[] = []
    list.forEach(i => newList.push({...i}));
    return newList;
  }

  /**
   * Maps operation type codes to their corresponding translation keys
   * @param operationType - The operation type code (e.g., 'ADD', 'CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE')
   * @returns The translation key for the operation type, or the original value if not found
   */
  static getOperationTypeLabel(operationType?: string): string {
    const operationTypeMap: { [key: string]: string } = {
      'ADD': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATE',
      'CREATE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATE',
      'UPDATE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.UPDATE',
      'DELETE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.DELETE',
      'USER_ROLE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.USER_ROLE_CHANGE',
      'USER_ROLE_ADD': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.USER_ROLE_ADD',
      'USER_ROLE_DELETE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.USER_ROLE_DELETE',
      'USER_ROLE_UPDATE': 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.USER_ROLE_UPDATE',
      'PASSWORD_CHANGE': 'PAGES.LOGIN.LABELS.CHANGE_PASSWORD',
      'CHANGE_PASSWORD': 'PAGES.LOGIN.LABELS.CHANGE_PASSWORD',
    };
    return operationTypeMap[operationType || ''] || operationType || '-';
  }
}
