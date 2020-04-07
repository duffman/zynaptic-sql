/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
import { CompareType, DataType, OrderType } from "./types";
export interface IDRecord {
}
export declare class DataColumn {
    value: any;
    dataType: DataType;
    name: string;
    length: number;
    constructor(value: any);
}
declare enum JoinType {
    Inner = 0,
    Outer = 1,
    Left = 2,
    Right = 3,
    Cross = 4
}
interface Column {
    name: string;
    value: any;
    join?: JoinType;
}
declare type ColumnArray = Array<Column>;
/**
 * Simple Active Record implementation
 * Note: This does not add any intelligens, stupid behaviour such
 * as calling an SELECT after a SET, broken SQL will remain broken :)
 */
export interface IZynSql {
}
export declare class ZynSql implements IZynSql {
    protected records: Array<IDRecord>;
    dbName?: string;
    constructor(dbName?: string);
    clear(): void;
    debugShowAll(): void;
    private isWhereRec;
    private isSelectRec;
    protected currRec: IDRecord;
    protected prevRec: IDRecord;
    toSql(): string;
    /**
     * Returns the previous record from a given
     * record in the record array
     * @param {IDRecord} record
     * @returns {IDRecord}
     */
    private getPreviousRecord;
    selectAll(...elements: Array<string> | null): this;
    get(table: string): this;
    select(...param: Array<string>): ZynSql;
    update(table: string): ZynSql;
    insert(data: any, tableName: string): ZynSql;
    with(...data: Array<any>): ZynSql;
    into(tableName: string): ZynSql;
    set(column: string, value: any): ZynSql;
    join(columns: ColumnArray): ZynSql;
    inQuery(dynSql: ZynSql): ZynSql;
    joinTable(table: string, on: string, value?: any, escapeVal?: boolean): ZynSql;
    selectAs(fromTable: string, alias?: string): ZynSql;
    from(table: string, alias?: string): ZynSql;
    where(value1: any, value2?: any, whereType?: CompareType, escapeValue?: boolean): ZynSql;
    orWhere(value1: any, value2?: any, compareType?: CompareType): ZynSql;
    andWhere(value1: any, value2?: any, compareType?: CompareType): ZynSql;
    andOrWhere(value1: any, value2?: any, compareType?: CompareType): ZynSql;
    orAndWhere(value1: any, value2?: any, compareType?: CompareType): ZynSql;
    /**
     * Adds a Where record to the active record stack
     * @param thisElem
     * @param elemIs
     * @param escapeValue - set this to true when handling user inputted values, false when like "lucas.arts=rulez.row"
     * @returns {ZynSql}
     */
    whereIs(whereParamsObj: any, value2?: any, whereType?: CompareType): ZynSql;
    whereBetween(value: any, rangeStart: any, rangeEnd: any): ZynSql;
    orderBy(column: string, orderType?: OrderType): ZynSql;
    orderByRand(): ZynSql;
    and(col: string, value?: any, compType?: CompareType, escapeVal?: boolean): this;
    limitBy(fromValue: number, toValue?: number): ZynSql;
    findRecord(recType: IDRecord): IDRecord;
    findRecords(recType: IDRecord, firstHit?: boolean): Array<IDRecord>;
    pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][];
    private parseJoin;
    escpaeVal(value: any): string;
    protected parseInsert(): string;
    protected parseSelect(): string;
    parseSelectAll(): string;
    parseUpdate(): string;
    parseDelete(): string;
    parseDrop(): string;
    parseFrom(): string;
    parseSet(): string;
    parseLeftJoin(): string;
    parseWhere(): string;
    parseAnd(): string;
    parseOrderBy(): string;
    parseLimit(): string;
}
export {};
