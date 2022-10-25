const { PermissionsBitField} = require('discord.js');

const hasAdmin = function (member) {
  if (member.permissions.has(PermissionsBitField.Flags.BanMembers) || member.roles.cache.has('Administrator')) {
    return true
  }
  return false
}

const hasManager = function (member) {
  if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return true
  }
  return false
}

module.exports = { hasAdmin, hasManager};