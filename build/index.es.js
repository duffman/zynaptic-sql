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
var SqlCommands;
(function (SqlCommands) {
    SqlCommands["DbInsert"] = "INSERT";
    SqlCommands["DbMySqlReplace"] = "REPLACE";
    SqlCommands["DbSelect"] = "SELECT";
    SqlCommands["DbUpdate"] = "UPDATE";
    SqlCommands["DbDelete"] = "DELETE";
    SqlCommands["DbFrom"] = "FROM";
    SqlCommands["DbWhere"] = "WHERE";
    SqlCommands["DbSet"] = "SET";
    SqlCommands["DbDrop"] = "DROP";
})(SqlCommands || (SqlCommands = {}));
var CompareType;
(function (CompareType) {
    CompareType[CompareType["Equal"] = 0] = "Equal";
    CompareType[CompareType["SafeEqual"] = 1] = "SafeEqual";
    CompareType[CompareType["NotEqual"] = 2] = "NotEqual";
    CompareType[CompareType["GreaterThan"] = 3] = "GreaterThan";
    CompareType[CompareType["GreaterOrEquals"] = 4] = "GreaterOrEquals";
    CompareType[CompareType["LessThan"] = 5] = "LessThan";
    CompareType[CompareType["LessOrEquals"] = 6] = "LessOrEquals";
    CompareType[CompareType["Between"] = 7] = "Between";
    CompareType[CompareType["InValue"] = 8] = "InValue";
    CompareType[CompareType["InQuery"] = 9] = "InQuery";
    CompareType[CompareType["Or"] = 10] = "Or";
    CompareType[CompareType["In"] = 11] = "In";
})(CompareType || (CompareType = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["None"] = 0] = "None";
    OrderType[OrderType["Asc"] = 1] = "Asc";
    OrderType[OrderType["Desc"] = 2] = "Desc";
})(OrderType || (OrderType = {}));
var DataType;
(function (DataType) {
    DataType[DataType["VarChar"] = 0] = "VarChar";
    DataType[DataType["Boolean"] = 1] = "Boolean";
    DataType[DataType["Int"] = 2] = "Int";
    DataType[DataType["Date"] = 3] = "Date";
})(DataType || (DataType = {}));
var JoinType;
(function (JoinType) {
    JoinType[JoinType["Inner"] = 0] = "Inner";
    JoinType[JoinType["Outer"] = 1] = "Outer";
    JoinType[JoinType["Left"] = 2] = "Left";
    JoinType[JoinType["Right"] = 3] = "Right";
    JoinType[JoinType["Cross"] = 4] = "Cross";
})(JoinType || (JoinType = {}));

/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: February 2018
 *
 * Partly based on DynUtils
 * https://github.com/mysqljs/sqlstring/blob/master/lib/DynUtils.js
 */
var ID_GLOBAL_REGEXP = /`/g;
var QUAL_GLOBAL_REGEXP = /\./g;
var CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
var CHARS_ESCAPE_MAP = {
    '\0': '\\0',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\r': '\\r',
    '\x1a': '\\Z',
    '"': '\\"',
    '\'': '\\\'',
    '\\': '\\\\'
};
var VarType;
(function (VarType) {
    VarType[VarType["None"] = 0] = "None";
    VarType[VarType["NullOrUndefined"] = 1] = "NullOrUndefined";
    VarType[VarType["String"] = 2] = "String";
    VarType[VarType["Number"] = 3] = "Number";
    VarType[VarType["Boolean"] = 4] = "Boolean";
    VarType[VarType["Object"] = 5] = "Object";
    VarType[VarType["Date"] = 6] = "Date";
    VarType[VarType["Array"] = 7] = "Array";
    VarType[VarType["Buffer"] = 8] = "Buffer";
})(VarType || (VarType = {}));
var DynUtils = /** @class */ (function () {
    function DynUtils() {
    }
    DynUtils.prepMySqlDate = function (dateObj) {
        dateObj.setHours(dateObj.getHours() - 2);
        return dateObj.toISOString().slice(0, 19).replace('T', ' ');
    };
    DynUtils.parseCompareType = function (value1, value2, whereType) {
        var sql = "";
        switch (whereType) {
            case CompareType.Equal:
                sql = value1 + " = " + DynUtils.escape(value2);
                break;
            // Equal (Safe to compare NULL values)
            case CompareType.SafeEqual:
                sql = value1 + " <=> " + DynUtils.escape(value2);
                break;
            case CompareType.GreaterThan:
                sql = value1 + " > " + DynUtils.escape(value2);
                break;
            case CompareType.GreaterOrEquals:
                sql = value1 + " >= " + DynUtils.escape(value2);
                break;
            case CompareType.LessThan:
                sql = value1 + " < " + DynUtils.escape(value2);
                break;
            case CompareType.LessOrEquals:
                sql = value1 + " <= " + DynUtils.escape(value2);
                break;
            case CompareType.Between:
                sql = "BETWEEN " + DynUtils.escape(value1) + " AND " + DynUtils.escape(value2);
                break;
            case CompareType.Or:
                sql = value1 + " <= " + DynUtils.escape(value2);
                break;
            default: {
                sql = 'UNKNOWN_DIRECTIVE';
            }
        }
        return sql;
    };
    DynUtils.escapeId = function (val, forbidQualified) {
        if (forbidQualified === void 0) { forbidQualified = false; }
        if (Array.isArray(val)) {
            var sql = '';
            for (var i = 0; i < val.length; i++) {
                sql += (i === 0 ? '' : ', ') + DynUtils.escapeId(val[i], forbidQualified);
            }
            return sql;
        }
        else if (forbidQualified) {
            return '`' + String(val).replace(ID_GLOBAL_REGEXP, '``') + '`';
        }
        else {
            return '`' + String(val).replace(ID_GLOBAL_REGEXP, '``').replace(QUAL_GLOBAL_REGEXP, '`.`') + '`';
        }
    };
    /**
     *
     * @param val
     * @param stringifyObjects
     * @param timeZone
     */
    DynUtils.escape = function (val, stringifyObjects, timeZone) {
        if (stringifyObjects === void 0) { stringifyObjects = true; }
        if (timeZone === void 0) { timeZone = 0; }
        if (val === undefined || val === null) {
            return 'NULL';
        }
        switch (typeof val) {
            case 'boolean':
                return (val) ? 'true' : 'false';
            case 'number':
                return val + '';
            case 'object':
                if (val instanceof Date) {
                    return DynUtils.dateToString(val, timeZone || 'local');
                }
                else if (Array.isArray(val)) {
                    return DynUtils.arrayToList(val, timeZone);
                }
                else if (Buffer.isBuffer(val)) {
                    return DynUtils.bufferToString(val);
                }
                else if (typeof val.toDynUtils === 'function') {
                    return String(val.toDynUtils());
                }
                else if (stringifyObjects) {
                    return DynUtils.escapeString(val.toString());
                }
                else {
                    return DynUtils.objectToValues(val, timeZone);
                }
            default:
                return DynUtils.escapeString(val);
        }
    };
    DynUtils.arrayToList = function (array, timeZone) {
        var sql = '';
        for (var i = 0; i < array.length; i++) {
            var val = array[i];
            if (Array.isArray(val)) {
                sql += (i === 0 ? '' : ', ') + '(' + DynUtils.arrayToList(val, timeZone) + ')';
            }
            else {
                sql += (i === 0 ? '' : ', ') + DynUtils.escape(val, true, timeZone);
            }
        }
        return sql;
    };
    DynUtils.format = function (sql, values, stringifyObjects, timeZone) {
        if (values == null) {
            return sql;
        }
        if (!(values instanceof Array || Array.isArray(values))) {
            values = [values];
        }
        var chunkIndex = 0;
        var placeholdersRegex = /\?+/g;
        var result = '';
        var valuesIndex = 0;
        var match;
        while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
            var len = match[0].length;
            if (len > 2) {
                continue;
            }
            var value = len === 2
                ? DynUtils.escapeId(values[valuesIndex])
                : DynUtils.escape(values[valuesIndex], stringifyObjects, timeZone);
            result += sql.slice(chunkIndex, match.index) + value;
            chunkIndex = placeholdersRegex.lastIndex;
            valuesIndex++;
        }
        if (chunkIndex === 0) {
            // Nothing was replaced
            return sql;
        }
        if (chunkIndex < sql.length) {
            return result + sql.slice(chunkIndex);
        }
        return result;
    };
    DynUtils.dateToString = function (date, timeZone) {
        var dt = new Date(date);
        if (isNaN(dt.getTime())) {
            return 'NULL';
        }
        var year, month, day, hour, minute, second, millisecond;
        if (timeZone === 'local') {
            year = dt.getFullYear();
            month = dt.getMonth() + 1;
            day = dt.getDate();
            hour = dt.getHours();
            minute = dt.getMinutes();
            second = dt.getSeconds();
            millisecond = dt.getMilliseconds();
        }
        else {
            var tz = DynUtils.convertStrToTimezone(timeZone);
            if (tz != 0) {
                dt.setTime(dt.getTime() + (tz * 60000));
            }
            year = dt.getUTCFullYear();
            month = dt.getUTCMonth() + 1;
            day = dt.getUTCDate();
            hour = dt.getUTCHours();
            minute = dt.getUTCMinutes();
            second = dt.getUTCSeconds();
            millisecond = dt.getUTCMilliseconds();
        }
        // YYYY-MM-DD HH:mm:ss.mmm
        var str = DynUtils.zeroPad(year, 4) + '-' + DynUtils.zeroPad(month, 2) + '-' + DynUtils.zeroPad(day, 2) + ' ' +
            DynUtils.zeroPad(hour, 2) + ':' + DynUtils.zeroPad(minute, 2) + ':' + DynUtils.zeroPad(second, 2) + '.' +
            DynUtils.zeroPad(millisecond, 3);
        return DynUtils.escapeString(str);
    };
    DynUtils.bufferToString = function (buffer) {
        return 'X' + DynUtils.escapeString(buffer.toString('hex'));
    };
    DynUtils.objectToValues = function (object, timeZone) {
        var sql = '';
        for (var key in object) {
            var val = object[key];
            if (typeof val === 'function') {
                continue;
            }
            sql += (sql.length === 0 ? '' : ', ') + DynUtils.escapeId(key)
                + ' = ' + DynUtils.escape(val, true, timeZone);
        }
        return sql;
    };
    DynUtils.raw = function (sql) {
        if (typeof sql !== 'string') {
            throw new TypeError('argument sql must be a string');
        }
        return {
            toDynUtils: function toDynUtils() {
                return sql;
            }
        };
    };
    DynUtils.escapeString = function (val) {
        if (typeof val !== "string") {
            return val;
        }
        var chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
        var escapedVal = '';
        var match;
        while ((match = CHARS_GLOBAL_REGEXP.exec(val))) {
            escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
            chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
        }
        if (chunkIndex === 0) {
            // Nothing was escaped
            return "'" + val + "'";
        }
        if (chunkIndex < val.length) {
            return "'" + escapedVal + val.slice(chunkIndex) + "'";
        }
        return "'" + escapedVal + "'";
    };
    DynUtils.zeroPad = function (value, length) {
        value = value.toString();
        while (value.length < length) {
            value = '0' + value;
        }
        return value;
    };
    DynUtils.convertStrToTimezone = function (tz) {
        if (tz === 'Z') {
            return 0;
        }
        var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
        if (m) {
            return (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
        }
        return 0;
    };
    return DynUtils;
}());

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
 * File Date: 2020-04-02 15:20
 *
 ************************************************
 * Description:
 *
 */
var VarUtils = /** @class */ (function () {
    function VarUtils() {
    }
    VarUtils.getVarType = function (value) {
        var result = VarType.None;
        if (value === undefined || value === null) {
            return VarType.NullOrUndefined;
        }
        switch (typeof value) {
            case 'string':
                result = VarType.String;
                break;
            case 'boolean':
                result = VarType.Boolean;
                break;
            case 'number':
                result = VarType.Number;
                break;
            case 'object':
                if (value instanceof Date) {
                    result = VarType.Date;
                }
                else if (Array.isArray(value)) {
                    result = VarType.Array;
                }
                else if (Buffer.isBuffer(value)) {
                    result = VarType.Buffer;
                }
                else {
                    result = VarType.Object;
                }
                break;
        }
        return result;
    };
    /**
     * Checks wheater a given variable is of string type
     * and has a length greater than 0
     * @param value - variable
     */
    VarUtils.haveStrValue = function (value) {
        var varType = VarUtils.getVarType(value);
        return value !== undefined
            && varType === VarType.String
            && value.length > 0;
    };
    return VarUtils;
}());

/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
var DJoin = /** @class */ (function () {
    function DJoin(columns) {
        this.columns = columns;
    }
    return DJoin;
}());
var DInQuery = /** @class */ (function () {
    function DInQuery(query) {
        this.query = query;
    }
    return DInQuery;
}());
var DUpdate = /** @class */ (function () {
    function DUpdate(table) {
        this.table = table;
    }
    return DUpdate;
}());
var DInsert = /** @class */ (function () {
    function DInsert(data, tableName) {
        this.data = data;
        this.tableName = tableName;
        this.mySQLReplace = false;
    }
    return DInsert;
}());
var DDelete = /** @class */ (function () {
    function DDelete() {
    }
    return DDelete;
}());
var DDrop = /** @class */ (function () {
    function DDrop(tableName) {
        this.tableName = tableName;
    }
    return DDrop;
}());
var DWith = /** @class */ (function () {
    function DWith() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        this.data = data;
    }
    return DWith;
}());
var DInto = /** @class */ (function () {
    function DInto(tableName) {
        this.tableName = tableName;
    }
    return DInto;
}());
var DSelect = /** @class */ (function () {
    function DSelect(column, alias) {
        this.column = column;
        this.alias = alias;
        this.haveAlias = alias != null;
    }
    return DSelect;
}());
var DSelectAll = /** @class */ (function () {
    function DSelectAll(column, alias) {
        this.column = column;
        this.alias = alias;
        this.haveAlias = VarUtils.haveStrValue(alias);
    }
    return DSelectAll;
}());
var DSet = /** @class */ (function () {
    function DSet(column, value, escape) {
        if (escape === void 0) { escape = true; }
        this.column = column;
        this.value = value;
        this.escape = escape;
    }
    return DSet;
}());
var DLeftJoin = /** @class */ (function () {
    function DLeftJoin(table, on, value, escapeVal) {
        if (value === void 0) { value = null; }
        if (escapeVal === void 0) { escapeVal = true; }
        this.table = table;
        this.on = on;
        this.value = value;
        this.escapeVal = escapeVal;
    }
    return DLeftJoin;
}());
var DFrom = /** @class */ (function () {
    function DFrom(table, alias) {
        this.table = table;
        this.alias = alias;
    }
    return DFrom;
}());
var DAnd = /** @class */ (function () {
    function DAnd(column, value, compare, escapeVal) {
        if (value === void 0) { value = undefined; }
        if (compare === void 0) { compare = CompareType.Equal; }
        if (escapeVal === void 0) { escapeVal = true; }
        this.column = column;
        this.value = value;
        this.compare = compare;
        this.escapeVal = escapeVal;
    }
    return DAnd;
}());
var DOrderBy = /** @class */ (function () {
    function DOrderBy(fieldName, orderType, escapeVal) {
        if (orderType === void 0) { orderType = OrderType.None; }
        this.fieldName = fieldName;
        this.orderType = orderType;
        this.escapeVal = escapeVal;
    }
    return DOrderBy;
}());
var DLimit = /** @class */ (function () {
    function DLimit(fromValue, toValue) {
        this.fromValue = fromValue;
        this.toValue = toValue;
    }
    return DLimit;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
var DWhere = /** @class */ (function () {
    function DWhere(data, value2, whereType) {
        if (value2 === void 0) { value2 = null; }
        if (whereType === void 0) { whereType = CompareType.Equal; }
        this.data = data;
        this.value2 = value2;
        this.whereType = whereType;
    }
    return DWhere;
}());
var DOrWhere = /** @class */ (function (_super) {
    __extends(DOrWhere, _super);
    function DOrWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DOrWhere;
}(DWhere));
var DAndWhere = /** @class */ (function (_super) {
    __extends(DAndWhere, _super);
    function DAndWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DAndWhere;
}(DWhere));
var DAndOrWhere = /** @class */ (function (_super) {
    __extends(DAndOrWhere, _super);
    function DAndOrWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DAndOrWhere;
}(DWhere));
var DOrAndWhere = /** @class */ (function (_super) {
    __extends(DOrAndWhere, _super);
    function DOrAndWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DOrAndWhere;
}(DWhere));
var DWhereSimple = /** @class */ (function () {
    function DWhereSimple(value1, value2, whereType, escape) {
        if (value2 === void 0) { value2 = null; }
        if (whereType === void 0) { whereType = CompareType.Equal; }
        if (escape === void 0) { escape = true; }
        this.value1 = value1;
        this.value2 = value2;
        this.whereType = whereType;
        this.escape = escape;
    }
    return DWhereSimple;
}());
var DWhereBetween = /** @class */ (function () {
    function DWhereBetween(type, that, value1, value2) {
        this.type = type;
        this.that = that;
        this.value1 = value1;
        this.value2 = value2;
    }
    return DWhereBetween;
}());

/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
var DataColumn = /** @class */ (function () {
    function DataColumn(value) {
        this.value = value;
    }
    return DataColumn;
}());
var JoinType$1;
(function (JoinType) {
    JoinType[JoinType["Inner"] = 0] = "Inner";
    JoinType[JoinType["Outer"] = 1] = "Outer";
    JoinType[JoinType["Left"] = 2] = "Left";
    JoinType[JoinType["Right"] = 3] = "Right";
    JoinType[JoinType["Cross"] = 4] = "Cross";
})(JoinType$1 || (JoinType$1 = {}));
var ZynSql = /** @class */ (function () {
    function ZynSql(dbName) {
        this.currRec = undefined;
        this.prevRec = undefined;
        this.dbName = dbName;
        this.records = new Array();
    }
    ZynSql.prototype.clear = function () {
        this.records.length = 0;
    };
    ZynSql.prototype.debugShowAll = function () {
        for (var _i = 0, _a = this.records; _i < _a.length; _i++) {
            var item = _a[_i];
            console.log('item ::', item);
        }
    };
    ZynSql.prototype.isWhereRec = function (arec) {
        return (arec instanceof DOrWhere
            || arec instanceof DAndWhere
            || arec instanceof DWhere
            || arec instanceof DAndOrWhere
            || arec instanceof DOrAndWhere
            || arec instanceof DWhereSimple);
    };
    ZynSql.prototype.isSelectRec = function (arec) {
        return (arec instanceof DSelect || arec instanceof DSelectAll);
    };
    ZynSql.prototype.toSql = function () {
        var sql = "";
        for (var i = 0; i < this.records.length; i++) {
            this.prevRec = this.currRec;
            this.currRec = this.records[i];
            if (this.currRec instanceof DSelect) {
                sql += this.parseSelect();
            }
            if (this.currRec instanceof DSelectAll) {
                sql += this.parseSelectAll();
            }
            if (this.currRec instanceof DFrom) {
                sql += this.parseFrom();
            }
            if (this.currRec instanceof DSet) {
                sql += this.parseSet();
            }
            if (this.currRec instanceof DLeftJoin) {
                sql += this.parseLeftJoin();
            }
            if (this.isWhereRec(this.currRec)) {
                sql += this.parseWhere();
            }
            if (this.currRec instanceof DAnd) {
                sql += this.parseAnd();
            }
            if (this.currRec instanceof DOrderBy) {
                sql += this.parseOrderBy();
            }
            if (this.currRec instanceof DLimit) {
                sql += this.parseLimit();
            }
        }
        return sql;
    };
    /**
     * Returns the previous record from a given
     * record in the record array
     * @param {IDRecord} record
     * @returns {IDRecord}
     */
    ZynSql.prototype.getPreviousRecord = function (record) {
        var result;
        var index = this.records.indexOf(record);
        if (index > -1 && index - 1 > 0) {
            result = this.records[index];
        }
        return result;
    };
    ZynSql.prototype.selectAll = function () {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        // Be nice, if no parameter is passed add an asterisk
        if (!elements) {
            elements.push("kalle");
        }
        for (var item in elements) {
            var name_1 = elements[item];
            this.records.push(new DSelectAll(name_1));
        }
        return this;
    };
    ZynSql.prototype.get = function (table) {
        this.records.push(new DSelect('*'));
        var rec = new DFrom(table);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.select = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        for (var item in param) {
            var name_2 = param[item];
            this.records.push(new DSelect(name_2));
        }
        return this;
    };
    ZynSql.prototype.update = function (table) {
        this.records.push(new DUpdate(table));
        return this;
    };
    ZynSql.prototype.insert = function (data, tableName) {
        this.records.push(new DInsert(data, tableName));
        return this;
    };
    ZynSql.prototype.with = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        this.records.push(new DWith(data));
        return this;
    };
    ZynSql.prototype.into = function (tableName) {
        this.records.push(new DInto(tableName));
        return this;
    };
    ZynSql.prototype.set = function (column, value) {
        this.records.push(new DSet(column, value));
        return this;
    };
    ZynSql.prototype.join = function (columns) {
        this.records.push(new DJoin(columns));
        return this;
    };
    ZynSql.prototype.inQuery = function (dynSql) {
        this.records.push(new DInQuery(dynSql));
        return this;
    };
    ZynSql.prototype.joinTable = function (table, on, value, escapeVal) {
        if (escapeVal === void 0) { escapeVal = true; }
        this.records.push(new DLeftJoin(table, on, value, escapeVal));
        return this;
    };
    ZynSql.prototype.selectAs = function (fromTable, alias) {
        if (alias === void 0) { alias = null; }
        this.records.push(new DSelect(fromTable, alias));
        return this;
    };
    ZynSql.prototype.from = function (table, alias) {
        if (alias === void 0) { alias = null; }
        var rec = new DFrom(table, alias);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.where = function (value1, value2, whereType, escapeValue) {
        if (value2 === void 0) { value2 = null; }
        if (whereType === void 0) { whereType = CompareType.Equal; }
        if (escapeValue === void 0) { escapeValue = true; }
        var rec = new DWhereSimple(value1, value2, whereType, escapeValue);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.orWhere = function (value1, value2, compareType) {
        if (value2 === void 0) { value2 = null; }
        var rec = new DOrWhere(value1, value2, compareType);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.andWhere = function (value1, value2, compareType) {
        if (value2 === void 0) { value2 = null; }
        var rec = new DAndWhere(value1, value2, compareType);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.andOrWhere = function (value1, value2, compareType) {
        if (value2 === void 0) { value2 = null; }
        var rec = new DAndOrWhere(value1, value2, compareType);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.orAndWhere = function (value1, value2, compareType) {
        if (value2 === void 0) { value2 = null; }
        var rec = new DOrAndWhere(value1, value2, compareType);
        this.records.push(rec);
        return this;
    };
    /**
     * Adds a Where record to the active record stack
     * @param thisElem
     * @param elemIs
     * @param escapeValue - set this to true when handling user inputted values, false when like "lucas.arts=rulez.row"
     * @returns {ZynSql}
     */
    ZynSql.prototype.whereIs = function (whereParamsObj, value2, whereType) {
        if (whereType === void 0) { whereType = CompareType.Equal; }
        var rec = new DWhere(whereParamsObj, value2, whereType);
        this.records.push(rec);
        return this;
    };
    /*
    public whereIs(whereParamsObj: any, escapeValue: boolean = true): ZynSql {
        let rec = new DWhere(whereParamsObj, escapeValue);
        this.records.push(rec);

        return this;
    }
    */
    // withintrig
    ZynSql.prototype.whereBetween = function (value, rangeStart, rangeEnd) {
        DynUtils.escape(value);
        var rec = new DWhereBetween(CompareType.Between, value, rangeStart, rangeEnd);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.orderBy = function (column, orderType) {
        if (orderType === void 0) { orderType = OrderType.None; }
        var rec = new DOrderBy(column, orderType);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.orderByRand = function () {
        var rec = new DOrderBy("RAND()");
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.and = function (col, value, compType, escapeVal) {
        if (value === void 0) { value = null; }
        if (compType === void 0) { compType = CompareType.Equal; }
        if (escapeVal === void 0) { escapeVal = true; }
        var rec = new DAnd(col, value, compType, escapeVal);
        this.records.push(rec);
        return this;
    };
    ZynSql.prototype.limitBy = function (fromValue, toValue) {
        if (toValue === void 0) { toValue = null; }
        var rec = new DLimit(fromValue, toValue);
        this.records.push(rec);
        return this;
    };
    ///////////////////////////////////////////
    //
    //     TEST JOIN
    //
    ///////////////////////////////////////////
    ZynSql.prototype.findRecord = function (recType) {
        var result = this.findRecords(recType);
        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    };
    ZynSql.prototype.findRecords = function (recType, firstHit) {
        if (firstHit === void 0) { firstHit = false; }
        var result = [];
        for (var i = 0; i < this.records.length; i++) {
            var record = this.records[i];
            if (typeof record === recType) {
                result.push(record);
                if (firstHit) {
                    break;
                }
            }
        }
        return result;
    };
    ZynSql.prototype.pluck = function (o, propertyNames) {
        return propertyNames.map(function (n) { return o[n]; });
    };
    ZynSql.prototype.parseJoin = function () {
        for (var i = 0; i < this.records.length; i++) {
            var record = this.records[i];
        }
        return "";
    };
    ////////////////////////////////////////
    //
    //     SELECT
    //
    ////////////////////////////////////////
    ZynSql.prototype.escpaeVal = function (value) {
        var result = value;
        if (typeof value === "string") {
            result = DynUtils.escape(value);
        }
        else if (typeof value === "object") {
            result = DynUtils.escape(value);
        }
        else {
            result = value;
        }
        return result;
    };
    ZynSql.prototype.parseInsert = function () {
        var record = this.records[0];
        if (!(record instanceof DInsert))
            return "";
        var result = "";
        var dRec = record;
        var insertType = dRec.mySQLReplace ? SqlCommands.DbMySqlReplace : SqlCommands.DbInsert;
        var colNames = new Array();
        var colValues = new Array();
        var obj = dRec.data;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                colNames.push(key);
                colValues.push(obj[key]);
            }
        }
        for (var i = 0; i < colValues.length; i++) {
            colValues[i] = this.escpaeVal(colValues[i]);
        }
        result = insertType + " INTO " + dRec.tableName + " (" + colNames.join(",") + ") VALUES (" + colValues.join(",") + ")";
        return result;
    };
    ////////////////////////////////////////
    //
    //     SELECT
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseSelect = function () {
        var result = "";
        if (this.currRec instanceof DSelect) {
            var rec = this.currRec;
            if (this.isSelectRec(this.prevRec)) {
                result += ",";
            }
            else {
                result += "SELECT";
            }
            result += " " + rec.column;
        }
        return result;
    };
    ZynSql.prototype.parseSelectAll = function () {
        var result = "";
        console.log("** parseSelectAll");
        if (this.currRec instanceof DSelectAll) {
            var rec = this.currRec;
            if (this.isWhereRec(this.prevRec)) {
                result += "SELECT";
            }
            else {
                result += ",";
            }
            result += " " + rec.column + ".*";
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //     UPDATE
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseUpdate = function () {
        var result = "";
        if (this.currRec instanceof DUpdate) {
            var rec = this.currRec;
            result = "UPDATE " + rec.table;
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //     DELETE
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseDelete = function () {
        var result = "";
        if (this.currRec instanceof DDelete) {
            result = "DELETE";
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //     DROP
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseDrop = function () {
        var result = "";
        if (this.currRec instanceof DDrop) {
            var rec = this.currRec;
            result = "DROP " + DynUtils.escape(rec.tableName);
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //     FROM
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseFrom = function () {
        var result = "";
        if (this.currRec instanceof DFrom) {
            var rec = this.currRec;
            if (this.prevRec instanceof DFrom) {
                result += ",";
            }
            else {
                result += " " + SqlCommands.DbFrom;
            }
            result += " " + rec.table;
            if (rec.alias != null) {
                result += " AS " + rec.alias;
            }
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //     SET
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseSet = function () {
        var result = "";
        if (this.currRec instanceof DSet) {
            var rec = this.currRec;
            if (this.prevRec instanceof DSet) {
                result += " SET";
            }
            else {
                result += " ,";
            }
            var val = rec.escape ? DynUtils.escape(rec.value) : rec.value;
            result += " " + rec.column + "='" + val + "'";
        }
        return result;
    }; // parseSet
    ////////////////////////////////////////
    //
    //     LEFT JOIN
    //
    //...
    ////////////////////////////////////////
    ZynSql.prototype.parseLeftJoin = function () {
        var result = "";
        if (this.currRec instanceof DLeftJoin) {
            var rec = this.currRec;
            result += " LEFT JOIN "
                + rec.table + " ON "
                + rec.on;
            if (rec.value) {
                rec.value = rec.escapeVal ? DynUtils.escape(rec.value) : rec.value;
                result += " = " + rec.value;
            }
        }
        return result;
    }; // parseLeftJoin
    ////////////////////////////////////////
    //
    //     WHERE
    //
    ////////////////////////////////////////
    ZynSql.prototype.parseWhere = function () {
        var result = "";
        if (this.isWhereRec(this.prevRec)) {
            result += " AND ";
        }
        else {
            result += " WHERE ";
        }
        if (this.currRec instanceof DWhereSimple) {
            result += DynUtils.parseCompareType(this.currRec.value1, this.currRec.value2, this.currRec.whereType);
        }
        //
        // Where
        //
        if (this.currRec instanceof DWhere) {
            var rec = this.currRec;
            if (typeof rec.data === "string") {
                result += rec.data;
            }
            else {
                var colNames = new Array();
                var colValues = new Array();
                var obj = rec.data;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        colNames.push(key);
                        colValues.push(obj[key]);
                    }
                }
                var colData = Array();
                for (var i = 0; i < colValues.length; i++) {
                    colData.push(colNames[i] + "=" + DynUtils.escape(colValues[i]));
                }
                result += colData.join(" AND ");
            }
        }
        /*
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];

            if (!this.isWhereRecord(record)) {
                continue;
            }

            if (firstIteration) {
                sql += " WHERE ";
            } else {
                sql += " AND ";
            }

            //
            // Where
            //
            if (record instanceof DWhere) {
                if (typeof record.data === "string") {
                    sql += record.data;
                } else {
                    let whereRec =  record as DWhere;

                    let colNames = new Array<string>();
                    let colValues = new Array<any>();

                    let obj = whereRec.data;

                    for (let key in obj) {
                        if (obj.hasOwnProperty(key) ) {
                            colNames.push(key);
                            colValues.push(obj[key]);
                        }
                    }

                    let colData = Array<string>();

                    for (let i = 0; i < colValues.length; i++) {
                        colData.push(`${colNames[i]}=${this.escpaeVal(colValues[i])}`);
                    }

                    sql += colData.join(" AND ");
                }
            }

            ////////////////////////////////////////////////
            //
            //  SIMPLE WHERE
            //
            ///////////////////////////////////////////////

            else if (record instanceof DWhereSimple) {
                let rec = record as DWhereSimple;

                let aRec: any = rec;
                while (isWhereRec(rec)) {
                    aRec = this.records[i];
                    console.log(">>>>>>>####### :::", aRec);
                    //console.log("rec", aRec)

                    sql += DynUtils.parseCompareType(rec.value1, rec.value2, rec.whereType);

                    if (i +1 >= this.records.length) {
                        break;
                    }

                    i++;
                }
            }

            firstIteration = false;
        } // end for

        */
        return result;
    }; // parseWhere
    ////////////////////////////////////////
    //
    //      And
    //
    ////////////////////////////////////////
    ZynSql.prototype.parseAnd = function () {
        var result = "";
        if (this.currRec instanceof DAnd) {
            var rec = this.currRec;
            result += " AND ";
            if (rec.value !== undefined) {
                // Special case for null value
                if (rec.value === null) {
                    switch (rec.compare) {
                        case CompareType.Equal:
                            result += " IS NULL";
                            break;
                        case CompareType.NotEqual:
                            result += " NOT NULL";
                            break;
                    }
                }
                else {
                    result += DynUtils.parseCompareType(rec.column, rec.value, rec.compare);
                }
            }
        }
        return result;
    };
    ////////////////////////////////////////
    //
    //  Order
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseOrderBy = function () {
        var result = "";
        if (this.currRec instanceof DOrderBy) {
            var rec = this.currRec;
            if (this.prevRec instanceof DOrderBy) {
                result += ", ";
            }
            else {
                result += " ORDER BY ";
            }
            result += rec.fieldName;
            if (rec.orderType !== OrderType.None) {
                switch (rec.orderType) {
                    case OrderType.Asc:
                        result += " ASC";
                        break;
                    case OrderType.Desc:
                        result += " DESC";
                        break;
                }
            }
        }
        return result;
    }; // end parseOrderBy
    ////////////////////////////////////////
    //
    //  Limit
    //
    ///////////////////////////////////////
    ZynSql.prototype.parseLimit = function () {
        var result = "";
        if (this.currRec instanceof DLimit) {
            var rec = this.currRec;
            result += " LIMIT " + rec.fromValue;
            if (rec.toValue != null) {
                result += ", " + rec.toValue;
            }
        }
        return result;
    }; // end parseLimit
    return ZynSql;
}());

export { DataColumn, ZynSql };
//# sourceMappingURL=index.es.js.map
