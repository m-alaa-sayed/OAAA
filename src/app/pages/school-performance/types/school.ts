export interface School {
    id?: number;
    nameAr?: string;
    nameEn?: string;
    code?: string;
    type?: string;
    principalName?: string;
    gender?: string;
    email?: string;
    phone?: string;
    governmentId?: number;
    governorate?: Governorate;
    wilayaId?: number;
    wilayat?: Wilayat;
    village?: string;
    status?: string;
    infoUuid?: string; // UUID as string
    classes?: string;
    studentsNumber?: number;
}

export interface Wilayat {
    id?: number;
    nameAr?: string;
    nameEn?: string;
    governorateId?: number;
}

export interface Governorate {
    id?: number;
    nameAr?: string;
    nameEn?: string;
    wilayats?: Wilayat[];
}