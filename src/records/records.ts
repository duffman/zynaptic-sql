/**
 * The file is part of the ZynapticSQL project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */

import {
	IDRecord,
	ColumnArray,
	CompareType,
	OrderType
} from "../types";
import { VarUtils } from "../var.utils";

type ZynSql = any;

export class DJoin implements IDRecord {
	constructor(public columns: ColumnArray) {}
}

export class DInQuery implements IDRecord {
	constructor(public query: ZynSql) {}
}

export class DUpdate implements IDRecord {
	constructor(public table: string) {}
}

export class DInsert implements IDRecord {
	public mySQLReplace: boolean = false;

	constructor(
		public data: any,
		public tableName: string
	) {}
}

export class DDelete implements IDRecord {
	constructor() {}
}

export class DDrop implements IDRecord {
	constructor(public tableName: string) {}
}

export class DWith implements IDRecord {
	public data: Array<string>;
	constructor(...data: Array<any>) {
		this.data = data;
	}
}

export class DInto implements IDRecord {
	constructor(public tableName: string) {}
}

export class DSelect implements IDRecord {
	public haveAlias: boolean;

	constructor(public column: string, public alias?: string) {
		this.haveAlias = alias != null;
	}
}

export class DSelectAll implements IDRecord {
	public haveAlias: boolean;

	constructor(public column: string, public alias?: string) {
		this.haveAlias = VarUtils.haveStrValue(alias);
	}
}

export class DSet implements IDRecord {
	constructor(public column: string,
				public value: any,
				public escape: boolean = true) {}
}

export class DLeftJoin implements IDRecord {
	constructor(
		public table: string,
		public on: string,
		public value: any = null,
		public escapeVal: boolean = true
	) {}
}

export class DFrom implements IDRecord {
	constructor(public table: string, public alias?: string) {}
}

export class DInsertExt implements IDRecord {
	public mySQLReplace: boolean = false;

	constructor(
		public data: any,
		public tableName: string
	) {}
}

export class DAnd implements IDRecord {
	constructor(public column: string,
				public value: any = undefined,
				public compare: CompareType = CompareType.Equal,
				public escapeVal: boolean = true) {}
}

export class DOrderBy implements IDRecord {
	constructor(public fieldName: string,
				public orderType: OrderType = OrderType.None,
				public escapeVal?: boolean) {}
}

export class DLimit implements IDRecord {
	constructor(public fromValue: number, public toValue?: number) {};
}
