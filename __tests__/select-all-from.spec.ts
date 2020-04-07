//
// Select all from
//

import { ZynSql } from "../src";

let zynSql = new ZynSql();

const sql = zynSql.selectAll().from("TEST").toSql();
console.log(sql);

test(sql, () => {
	expect(sql).toBe("SELECT * FROM 'TEST'")
});

