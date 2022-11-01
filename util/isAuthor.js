const { queryAuthor } = require("../db/dbCommands");

const isAuthor = async function (serverID, mediaName, userID) {
    dbAuthor = await queryAuthor(serverID, mediaName)
    if (dbAuthor == userID) {
        return true;
    }
    return false
}

module.exports = { isAuthor };