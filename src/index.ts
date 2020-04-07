/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */

import { DynUtils } from "./utils";
import {
	DAnd,
	DFrom,
	DLeftJoin,
	DLimit,
	DOrderBy,
	DSelect,
	DSelectAll,
	DSet,
	DInsert,
	DUpdate,
	DInto,
	DWith,
	DJoin,
	DInQuery,
	DDelete,
	DDrop
} from "./records/records";
import { CompareType, DataType, OrderType, SqlCommands } from "./types";
import {
	DAndOrWhere,
	DAndWhere, DOrAndWhere, DOrWhere, DWhere, DWhereBetween, DWhereSimple
} from "./records/where-record";

export interface IDRecord { }

export class DataColumn {
	dataType: DataType;
	name: string;
	length: number;

	constructor(public value: any) {}
}

enum JoinType {
	Inner,
	Outer,
	Left,
	Right,
	Cross
}

interface Column {
	name: string;
	value: any;
	join?: JoinType;
}

type ColumnArray = Array<Column>;


/**
 * Simple Active Record implementation
 * Note: This does not add any intelligens, stupid behaviour such
 * as calling an SELECT after a SET, broken SQL will remain broken :)
 */
export interface IZynSql {

}

export class ZynSql implements IZynSql {
	protected records: Array<IDRecord>;

	dbName?: string;

	constructor(dbName?: string) {
		this.dbName = dbName;
		this.records = new Array<IDRecord>();
	}

	public clear() {
		this.records.length = 0;
	}

	public debugShowAll(): void {
		for (let item of this.records) {
			console.log('item ::', item);
		}
	}

	private isWhereRec(arec: any): boolean {
		return (arec instanceof DOrWhere
			|| arec instanceof DAndWhere
			|| arec instanceof DWhere
			|| arec instanceof DAndOrWhere
			|| arec instanceof DOrAndWhere
			|| arec instanceof DWhereSimple
		);
	}

	private isSelectRec(arec: any): boolean {
		return (arec instanceof DSelect || arec instanceof DSelectAll);
	}

	protected currRec: IDRecord = undefined;
	protected prevRec: IDRecord = undefined;

	public toSql(): string {
		let sql: string = "";

		for (let i = 0; i < this.records.length; i++) {
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
	}

	/**
	 * Returns the previous record from a given
	 * record in the record array
	 * @param {IDRecord} record
	 * @returns {IDRecord}
	 */
	private getPreviousRecord(record: IDRecord): IDRecord | null {
		let result: IDRecord;
		let index = this.records.indexOf(record);

		if (index > -1 && index -1 > 0) {
			result = this.records[index] as IDRecord;
		}

		return result;
	}

	public selectAll(...elements: Array<string> | null) {
		// Be nice, if no parameter is passed add an asterisk
		if (!elements) {
			elements.push("kalle")
		}

		for (let item in elements) {
			let name = elements[item];
			this.records.push(new DSelectAll(name));
		}

		return this;
	}

	public get(table: string) {
		this.records.push(new DSelect('*'));
		let rec = new DFrom(table);
		this.records.push(rec);
		return this;
	}

	public select(...param: Array<string>): ZynSql {
		for (let item in param) {
			let name = param[item];
			this.records.push(new DSelect(name));
		}

		return this;
	}

	public update(table: string): ZynSql {
		this.records.push(new DUpdate(table));
		return this;
	}

	public insert(data: any, tableName: string): ZynSql {
		this.records.push(new DInsert(data, tableName));
		return this;
	}

	public with(...data: Array<any>): ZynSql {
		this.records.push(new DWith(data));
		return this;
	}

	public into(tableName: string): ZynSql {
		this.records.push(new DInto(tableName));
		return this;
	}

	public set(column: string, value: any): ZynSql {
		this.records.push(new DSet(column, value));
		return this;
	}

	public join(columns: ColumnArray): ZynSql {
		this.records.push(new DJoin(columns));
		return this;
	}

	public inQuery(dynSql: ZynSql): ZynSql {
		this.records.push(new DInQuery(dynSql));
		return this;
	}

	public joinTable(table: string, on: string, value?: any, escapeVal: boolean = true): ZynSql {
		this.records.push(new DLeftJoin(table, on, value, escapeVal));
		return this;
	}

	public selectAs(fromTable: string, alias: string = null): ZynSql {
		this.records.push(new DSelect(fromTable, alias));
		return this;
	}

	public from(table: string, alias: string = null): ZynSql {
		let rec = new DFrom(table, alias);
		this.records.push(rec);
		return this;
	}

	public where(value1: any, value2: any = null,
				 whereType: CompareType = CompareType.Equal,
				 escapeValue: boolean = true): ZynSql {
		let rec = new DWhereSimple(value1, value2, whereType, escapeValue);
		this.records.push(rec);
		return this;
	}

	public orWhere(value1: any, value2: any = null, compareType?: CompareType): ZynSql {
		let rec = new DOrWhere(value1, value2, compareType);
		this.records.push(rec);
		return this;
	}

	public andWhere(value1: any, value2: any = null, compareType?: CompareType): ZynSql {
		let rec = new DAndWhere(value1, value2, compareType);
		this.records.push(rec);
		return this;
	}

	public andOrWhere(value1: any, value2: any = null, compareType?: CompareType): ZynSql {
		let rec = new DAndOrWhere(value1, value2, compareType);
		this.records.push(rec);
		return this;
	}

	public orAndWhere(value1: any, value2: any = null, compareType?: CompareType): ZynSql {
		let rec = new DOrAndWhere(value1, value2, compareType);
		this.records.push(rec);
		return this;
	}

	/**
	 * Adds a Where record to the active record stack
	 * @param thisElem
	 * @param elemIs
	 * @param escapeValue - set this to true when handling user inputted values, false when like "lucas.arts=rulez.row"
	 * @returns {ZynSql}
	 */
	public whereIs(whereParamsObj: any, value2?: any, whereType: CompareType = CompareType.Equal): ZynSql {
		let rec = new DWhere(whereParamsObj, value2, whereType);
		this.records.push(rec);

		return this;
	}

	/*
	public whereIs(whereParamsObj: any, escapeValue: boolean = true): ZynSql {
		let rec = new DWhere(whereParamsObj, escapeValue);
		this.records.push(rec);

		return this;
	}
	*/

	// withintrig
	public whereBetween(value: any, rangeStart: any, rangeEnd: any): ZynSql {
		DynUtils.escape(value);

		let rec = new DWhereBetween(CompareType.Between, value, rangeStart, rangeEnd);
		this.records.push(rec);
		return this;
	}

	public orderBy(column: string, orderType: OrderType = OrderType.None): ZynSql {
		let rec = new DOrderBy(column, orderType);
		this.records.push(rec);
		return this;
	}

	public orderByRand(): ZynSql {
		let rec = new DOrderBy("RAND()");
		this.records.push(rec);
		return this;
	}

	public and(col: string, value: any = null, compType: CompareType = CompareType.Equal, escapeVal: boolean = true) {
		let rec = new DAnd(col, value, compType, escapeVal);
		this.records.push(rec);
		return this;
	}

	public limitBy(fromValue: number, toValue: number = null): ZynSql {
		let rec = new DLimit(fromValue, toValue);
		this.records.push(rec);
		return this;
	}

	///////////////////////////////////////////
	//
	//     TEST JOIN
	//
	///////////////////////////////////////////

	findRecord(recType: IDRecord): IDRecord {
		let result = this.findRecords(recType);
		if (result.length > 0) {
			return result[0];
		} else {
			return null;
		}
	}

	findRecords(recType: IDRecord, firstHit: boolean = false): Array<IDRecord> {
		let result: Array<IDRecord> = [];
		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];

			if (typeof record === recType) {
				result.push(record);
				if (firstHit) {
					break;
				}
			}
		}

		return result;
	}

	pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
		return propertyNames.map(n => o[n]);
	}

	private parseJoin(): string {
		let localCounter = 0;

		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];

			if (record instanceof DJoin) {
				const dRec = record as DJoin;

			}
		}

		return "";
	}

	////////////////////////////////////////
	//
	//     SELECT
	//
	////////////////////////////////////////
	public escpaeVal(value: any): string {
		let result = value;

		if (typeof value === "string") {
			result = DynUtils.escape(value);
		}
		else if (typeof value === "object") {
			result = DynUtils.escape(value);
		} else {
			result = value;
		}

		return result;
	}

	protected parseInsert(): string {
		let record = this.records[0];

		if (!(record instanceof DInsert))
			return "";

		let result = "";
		const dRec: DInsert = record as DInsert;
		let insertType = dRec.mySQLReplace ? SqlCommands.DbMySqlReplace : SqlCommands.DbInsert;

		let colNames = new Array<string>();
		let colValues = new Array<any>();

		let obj = dRec.data;

		for (let key in obj) {
			if (obj.hasOwnProperty(key) ) {
				colNames.push(key);
				colValues.push(obj[key]);
			}
		}

		for (let i = 0; i < colValues.length; i++) {
			colValues[i] = this.escpaeVal(colValues[i]);
		}

		result = `${insertType} INTO ${dRec.tableName} (${colNames.join(",")}) VALUES (${colValues.join(",")})`;

		return result;
	}

	////////////////////////////////////////
	//
	//     SELECT
	//
	///////////////////////////////////////
	protected parseSelect(): string {
		let result = "";

		if (this.currRec instanceof DSelect) {
			const rec = this.currRec as DSelect;

			if (this.isSelectRec(this.prevRec)) {
				result += ",";
			} else {
				result += "SELECT"
			}

			result += " " + rec.column;
		}

		return result;
	}

	parseSelectAll(): string {
		let result = "";

		console.log("** parseSelectAll");

		if (this.currRec instanceof DSelectAll) {
			const rec = this.currRec as DSelectAll;

			if (this.isWhereRec(this.prevRec)) {
				result += "SELECT"
			} else {
				result += ",";
			}

			result += " " + rec.column + ".*";
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     UPDATE
	//
	///////////////////////////////////////
	parseUpdate(): string {
		let result = "";

		if (this.currRec instanceof DUpdate) {
			const rec = this.currRec as DUpdate;
			result = "UPDATE " + rec.table;
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     DELETE
	//
	///////////////////////////////////////
	parseDelete(): string {
		let result = "";

		if (this.currRec instanceof DDelete) {
			result = "DELETE";
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     DROP
	//
	///////////////////////////////////////
	parseDrop(): string {
		let result = "";

		if (this.currRec instanceof DDrop) {
			const rec = this.currRec as DDrop;
			result = "DROP " + DynUtils.escape(rec.tableName);
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     FROM
	//
	///////////////////////////////////////
	parseFrom(): string {
		let result = "";

		if (this.currRec instanceof DFrom) {
			const rec = this.currRec as DFrom;

			if (this.prevRec instanceof DFrom) {
				result += ",";
			} else {
				result += " " + SqlCommands.DbFrom;
			}

			result += " " + rec.table;

			if (rec.alias != null) {
				result += " AS " + rec.alias;
			}
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     SET
	//
	///////////////////////////////////////
	parseSet(): string {
		let result = "";

		if (this.currRec instanceof DSet) {
			const rec = this.currRec as DSet;

			if (this.prevRec instanceof DSet) {
				result += " SET"
			} else {
				result += " ,";
			}

			let val = rec.escape ? DynUtils.escape(rec.value) : rec.value;
			result += " " + rec.column + "='" + val + "'";
		}

		return result;

	} // parseSet

	////////////////////////////////////////
	//
	//     LEFT JOIN
	//
	//...
	////////////////////////////////////////
	parseLeftJoin(): string {
		let result = "";

		if (this.currRec instanceof DLeftJoin) {
			const rec = this.currRec as DLeftJoin;

			result += " LEFT JOIN "
				+ rec.table + " ON "
				+ rec.on;

			if (rec.value) {
				rec.value = rec.escapeVal ? DynUtils.escape(rec.value) : rec.value;
				result += " = " + rec.value;
			}
		}

		return result;

	} // parseLeftJoin

	////////////////////////////////////////
	//
	//     WHERE
	//
	////////////////////////////////////////
	parseWhere(): string {
		let result = "";

		if (this.isWhereRec(this.prevRec)) {
			result += " AND ";
		} else {
			result += " WHERE ";
		}

		if (this.currRec instanceof DWhereSimple) {
			result += DynUtils.parseCompareType(
										this.currRec.value1,
										this.currRec.value2,
										this.currRec.whereType
									);
		}

		//
		// Where
		//
		if (this.currRec instanceof DWhere) {
			const rec = this.currRec as DWhere;

			if (typeof rec.data === "string") {
				result += rec.data;

			} else {
				let colNames = new Array<string>();
				let colValues = new Array<any>();

				let obj = rec.data;

				for (let key in obj) {
					if (obj.hasOwnProperty(key) ) {
						colNames.push(key);
						colValues.push(obj[key]);
					}
				}

				let colData = Array<string>();

				for (let i = 0; i < colValues.length; i++) {
					colData.push(`${ colNames[i] }=${ DynUtils.escape(colValues[i]) }`);
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

	} // parseWhere

	////////////////////////////////////////
	//
	//      And
	//
	////////////////////////////////////////
	public parseAnd(): string {
		let result = "";

		if (this.currRec instanceof DAnd) {
			let rec = this.currRec as DAnd;
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

				} else {
					result += DynUtils.parseCompareType(
						rec.column,
						rec.value,
						rec.compare
					);
				}
			}
		}

		return result;
	}

	////////////////////////////////////////
	//
	//  Order
	//
	///////////////////////////////////////
	parseOrderBy(): string {
		let result = "";

		if (this.currRec instanceof DOrderBy) {
			let rec = this.currRec as DOrderBy;

			if (this.prevRec instanceof DOrderBy) {
				result += ", ";
			} else {
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

	} // end parseOrderBy

	////////////////////////////////////////
	//
	//  Limit
	//
	///////////////////////////////////////
	parseLimit(): string {
		let result = "";

		if (this.currRec instanceof DLimit) {
			const rec = this.currRec as DLimit;
			result += " LIMIT " + rec.fromValue;

			if (rec.toValue != null) {
				result += ", " + rec.toValue;
			}
		}

		return result;

	} // end parseLimit
}
