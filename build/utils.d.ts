/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: February 2018
 *
 * Partly based on DynUtils
 * https://github.com/mysqljs/sqlstring/blob/master/lib/DynUtils.js
 */
import { CompareType } from './types';
export declare enum VarType {
    None = 0,
    NullOrUndefined = 1,
    String = 2,
    Number = 3,
    Boolean = 4,
    Object = 5,
    Date = 6,
    Array = 7,
    Buffer = 8
}
export declare class DynUtils {
    static prepMySqlDate(dateObj: Date): string;
    static parseCompareType(value1: any, value2: any, whereType: CompareType): string;
    static escapeId(val: any, forbidQualified?: boolean): string;
    /**
     *
     * @param val
     * @param stringifyObjects
     * @param timeZone
     */
    static escape(val: any, stringifyObjects?: boolean, timeZone?: number): string;
    static arrayToList(array: any[], timeZone: number): string;
    static format(sql: string, values: any[], stringifyObjects: boolean, timeZone: number): string;
    static dateToString(date: any, timeZone: any): string;
    static bufferToString(buffer: any): string;
    static objectToValues(object: any, timeZone: number): string;
    static raw(sql: string): {
        toDynUtils: () => string;
    };
    static escapeString(val: any): string;
    static zeroPad(value: any, length: number): string;
    static convertStrToTimezone(tz: string): number;
}
