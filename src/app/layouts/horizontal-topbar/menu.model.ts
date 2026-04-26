import {Permission} from "../../core/enum/permission";

interface SubMenuItem extends MenuItem {
    childItems?: MenuItem[];
}

export interface MenuItem {
    id?: number;
    label?: any;
    icon?: string;
    link?: string;
    subItems?: SubMenuItem[];
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    roles: string[];
    excludeRoles?: string[];
    permissions: Permission[];
    procedures?: string[];
    excludeProcedures?: string[];
  }
