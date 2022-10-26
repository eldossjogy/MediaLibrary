const { queryData } = require("../db/dbCommands");

const hasMedia = async function (serverID, mediaName) {
  create = await queryData(serverID, mediaName)
  if (create) {
    return true;
  }
  return false
}

module.exports = {hasMedia };