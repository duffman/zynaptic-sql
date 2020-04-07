/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
import { CompareType, IDRecord } from "../types";
export declare class DWhere implements IDRecord {
    data: any;
    value2: any;
    whereType: CompareType;
    constructor(data: any, value2?: any, whereType?: CompareType);
}
export declare class DOrWhere extends DWhere implements IDRecord {
}
export declare class DAndWhere extends DWhere implements IDRecord {
}
export declare class DAndOrWhere extends DWhere implements IDRecord {
}
export declare class DOrAndWhere extends DWhere implements IDRecord {
}
export declare class DWhereSimple implements IDRecord {
    value1: any;
    value2: any;
    whereType: CompareType;
    escape: boolean;
    constructor(value1: any, value2?: any, whereType?: CompareType, escape?: boolean);
}
export declare class DWhereBetween implements IDRecord {
    type: CompareType;
    that: any;
    value1: any;
    value2?: any;
    constructor(type: CompareType, that: any, value1: any, value2?: any);
}
