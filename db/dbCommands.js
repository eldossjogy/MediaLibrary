const { pool } = require("./db");

async function insertData(serverID, name, link, userID) {
    try {
        await pool.query(
            `INSERT INTO ${serverID} (name, link,author_id) VALUES ($1, $2, $3)`,
            [name, link,userID]
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

async function queryAuthor(serverID, name) {
    try {
        const res = await pool.query(
            `SELECT author_id FROM ${serverID} WHERE name = $1`,
            [name]
        );
        return res.rows[0].author_id
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
        return res.rows
    } catch (error) {
        return false
    }
}

async function queryKeysFilter(serverID,filter) {
    try {
        const res = await pool.query(
            `SELECT name FROM ${serverID} WHERE name ILIKE '%${filter}%'`
        );
        return res.rows
    } catch (error) {
        return false
    }
}

async function createTable(serverID) {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS ${serverID} ( id serial PRIMARY KEY, name TEXT UNIQUE NOT NULL, link TEXT UNIQUE NOT NULL, author_id TEXT NOT NULL)`
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

        return false
    }
}

async function updateMedia(serverID, name, newMedia) {
    try {
        await pool.query(
            `UPDATE ${serverID}
            SET link = $1
            WHERE name = $2;`,
            [newMedia,name]
        );
        return true
    } catch (error) {

        return false
    }
}

module.exports = { insertData, deleteData, queryAll, queryKeys, queryKeysFilter, queryData, createTable, deleteTable, clearTable, updateName ,updateMedia, queryAuthor};