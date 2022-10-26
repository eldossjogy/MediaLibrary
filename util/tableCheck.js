const { queryAll } = require("../db/dbCommands");

const tableExists = async function (serverID) {
  create = await queryAll(serverID)
  if (create) {
    return true;
  }
  return false
}

const tableNotEmpty = async function (serverID) {
  create = await queryAll(serverID)
  if (create.length > 0) {
    return true;
  }
  return false
}

module.exports = { tableExists,tableNotEmpty };