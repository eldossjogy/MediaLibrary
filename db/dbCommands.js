const { pool } = require("./db");

async function insertData(serverID, name, link) {
    try {
        await pool.query(
            `INSERT INTO ${serverID} (name, link) VALUES ($1, $2)`,
            [name, link]
        );
        return true
    } catch (error) {
        return false
    }
}

async function deleteData(serverID, name) {
    try {
        await pool.query(
            `DELETE FROM ${serverID} WHERE name = $1;`,
            [name]
        );
        return true
    } catch (error) {
        return false
    }
}

async function queryData(serverID, name) {
    try {
        const res = await pool.query(
            `SELECT link FROM ${serverID} WHERE name = $1`,
            [name]
        );
        return res.rows[0].link
    } catch (error) {
        return false
    }
}

async function queryAll(serverID) {
    try {
        const res = await pool.query(
            `SELECT * FROM ${serverID}`
        );
        return res.rows
    } catch (error) {
        return false
    }
}

async function queryKeys(serverID) {
    try {
        const res = await pool.query(
            `SELECT name FROM ${serverID}`
        );
        console.log(res.rows);
        return res.rows
    } catch (error) {
        return false
    }
}

async function createTable(serverID) {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS ${serverID} ( id serial PRIMARY KEY, name TEXT UNIQUE NOT NULL, link TEXT UNIQUE NOT NULL)`
        );
        return true
    } catch (error) {
        return false
    }
}

async function deleteTable(serverID) {
    try {
        await pool.query(
            `DROP TABLE ${serverID}`
        );
        return true
    } catch (error) {
        return false
    }
}

async function clearTable(serverID) {
    try {
        await pool.query(
            `TRUNCATE TABLE ${serverID}`
        );
        return true
    } catch (error) {
        return false
    }
}

async function updateName(serverID, name, newName) {
    try {
        await pool.query(
            `UPDATE ${serverID}
            SET name = $1
            WHERE name = $2;`,
            [newName,name]
        );
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}

module.exports = { insertData, deleteData, queryAll, queryKeys, queryData, createTable, deleteTable, clearTable, updateName };