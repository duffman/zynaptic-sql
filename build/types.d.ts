/**
 * Coldmind AB ("COMPANY") CONFIDENTIAL
 * Unpublished Copyright (c) 2020 Coldmind AB, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of COMPANY. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * File Date: 2018-04-02 14:09
 */
export declare enum SqlCommands {
    DbInsert = "INSERT",
    DbMySqlReplace = "REPLACE",
    DbSelect = "SELECT",
    DbUpdate = "UPDATE",
    DbDelete = "DELETE",
    DbFrom = "FROM",
    DbWhere = "WHERE",
    DbSet = "SET",
    DbDrop = "DROP"
}
export declare enum CompareType {
    Equal = 0,
    SafeEqual = 1,
    NotEqual = 2,
    GreaterThan = 3,
    GreaterOrEquals = 4,
    LessThan = 5,
    LessOrEquals = 6,
    Between = 7,
    InValue = 8,
    InQuery = 9,
    Or = 10,
    In = 11
}
export declare enum OrderType {
    None = 0,
    Asc = 1,
    Desc = 2
}
export declare enum DataType {
    VarChar = 0,
    Boolean = 1,
    Int = 2,
    Date = 3
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
export interface IDRecord {
}
export declare type ColumnArray = Array<Column>;
export {};
