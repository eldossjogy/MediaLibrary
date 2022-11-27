const { queryKeys } = require("../db/dbCommands");
const difflib = require('difflib');

const isSimilar = async function (serverID, search, choices) {
    allKeys = await queryKeys(serverID)

    const result = allKeys.filter(key => {
        s = new difflib.SequenceMatcher(null, key["name"], search);
        return s.ratio() > 0.50
    })
    result.forEach(element => {
        choices.indexOf(element["name"]) === -1 && choices.push(element["name"]) 
    });

    return choices
}

module.exports = { isSimilar };