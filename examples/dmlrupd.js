/* Copyright (c) 2015, 2022, Oracle and/or its affiliates. */

/******************************************************************************
 *
 * This software is dual-licensed to you under the Universal Permissive License
 * (UPL) 1.0 as shown at https://oss.oracle.com/licenses/upl and Apache License
 * 2.0 as shown at http://www.apache.org/licenses/LICENSE-2.0. You may choose
 * either license.
 *
 * If you elect to accept the software under the Apache License, Version 2.0,
 * the following applies:
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   dmlrupd.js
 *
 * DESCRIPTION
 *   Example of 'DML Returning' with multiple rows matched.
 *   The ROWIDs of the changed records are returned.  This is how to get
 *   the 'last insert id' of multiple rows.  For a single row, use "lastRowid".
 *
 *   This example uses Node 8's async/await syntax.
 *
 *****************************************************************************/

const fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

// On Windows and macOS, you can specify the directory containing the Oracle
// Client Libraries at runtime, or before Node.js starts.  On other platforms
// the system library search path must always be set before Node.js is started.
// See the node-oracledb installation documentation.
// If the search path is not correct, you will get a DPI-1047 error.
let libPath;
if (process.platform === 'win32') {           // Windows
  libPath = 'C:\\oracle\\instantclient_19_12';
} else if (process.platform === 'darwin') {   // macOS
  libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    //
    // Setup
    //

    const stmts = [
      `DROP TABLE no_dmlrupdtab`,

      `CREATE TABLE no_dmlrupdtab (id NUMBER, name VARCHAR2(40))`,

      `INSERT INTO no_dmlrupdtab VALUES (1001, 'Venkat')`,

      `INSERT INTO no_dmlrupdtab VALUES (1002, 'Neeharika')`
    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch (e) {
        if (e.errorNum != 942)
          console.error(e);
      }
    }

    //
    // Show DML Returning
    //

    // SQL statement.
    // Note bind names cannot be reused in the DML section and the RETURNING section
    const sql =
          `UPDATE no_dmlrupdtab
           SET name = :name
           WHERE id IN (:id1, :id2)
           RETURNING id, ROWID INTO :ids, :rids`;

    const result = await connection.execute(
      sql,
      {
        id1:   1001,
        id2:   1002,
        name:  "Chris",
        ids:   { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        rids:  { type: oracledb.STRING, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    console.log(result.outBinds);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();
