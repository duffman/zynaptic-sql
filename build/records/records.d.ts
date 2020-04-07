/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
import { IDRecord, ColumnArray, CompareType, OrderType } from "../types";
declare type ZynSql = any;
export declare class DJoin implements IDRecord {
    columns: ColumnArray;
    constructor(columns: ColumnArray);
}
export declare class DInQuery implements IDRecord {
    query: ZynSql;
    constructor(query: ZynSql);
}
export declare class DUpdate implements IDRecord {
    table: string;
    constructor(table: string);
}
export declare class DInsert implements IDRecord {
    data: any;
    tableName: string;
    mySQLReplace: boolean;
    constructor(data: any, tableName: string);
}
export declare class DDelete implements IDRecord {
    constructor();
}
export declare class DDrop implements IDRecord {
    tableName: string;
    constructor(tableName: string);
}
export declare class DWith implements IDRecord {
    data: Array<string>;
    constructor(...data: Array<any>);
}
export declare class DInto implements IDRecord {
    tableName: string;
    constructor(tableName: string);
}
export declare class DSelect implements IDRecord {
    column: string;
    alias?: string;
    haveAlias: boolean;
    constructor(column: string, alias?: string);
}
export declare class DSelectAll implements IDRecord {
    column: string;
    alias?: string;
    haveAlias: boolean;
    constructor(column: string, alias?: string);
}
export declare class DSet implements IDRecord {
    column: string;
    value: any;
    escape: boolean;
    constructor(column: string, value: any, escape?: boolean);
}
export declare class DLeftJoin implements IDRecord {
    table: string;
    on: string;
    value: any;
    escapeVal: boolean;
    constructor(table: string, on: string, value?: any, escapeVal?: boolean);
}
export declare class DFrom implements IDRecord {
    table: string;
    alias?: string;
    constructor(table: string, alias?: string);
}
export declare class DInsertExt implements IDRecord {
    data: any;
    tableName: string;
    mySQLReplace: boolean;
    constructor(data: any, tableName: string);
}
export declare class DAnd implements IDRecord {
    column: string;
    value: any;
    compare: CompareType;
    escapeVal: boolean;
    constructor(column: string, value?: any, compare?: CompareType, escapeVal?: boolean);
}
export declare class DOrderBy implements IDRecord {
    fieldName: string;
    orderType: OrderType;
    escapeVal?: boolean;
    constructor(fieldName: string, orderType?: OrderType, escapeVal?: boolean);
}
export declare class DLimit implements IDRecord {
    fromValue: number;
    toValue?: number;
    constructor(fromValue: number, toValue?: number);
}
export {};
