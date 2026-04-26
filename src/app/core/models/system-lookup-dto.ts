export interface SystemLookupDto {
    id?: number;
    lookupValueAr?: string;
    lookupValueEn?: string;
    lookupCode?: string;
    parentLookup?: SystemLookupDto;
    lookupIdentifier ?: string;
}