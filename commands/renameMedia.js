const { SlashCommandBuilder } = require('discord.js');
const { queryData, updateName } = require("../db/dbCommands");
const { hasManager } = require('../util/hasRole');
const { isAuthor } = require('../util/isAuthor');
const { tableExists } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('renamemedia')
            .setDescription('Rename a media with a new name')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Current name of media.')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('newname')
                    .setDescription('New name of media.')
                    .setRequired(true)),
    async execute(interaction) {
		let id = "id" + interaction.guild.id
        let userId = interaction.member.id

        if (!(hasManager(interaction.member) || isAuthor(id, interaction.options.getString('name'),userId))) {
            return await interaction.reply( { content: "You are not authorized to use this command. Only users with the 'Manage Messages' permission or higher can use this command.", ephemeral: true })
        }

        if (!(await tableExists(id))) {
            return await interaction.reply( "A media library does not exist.")
        }

        if (!(await queryData(id, interaction.options.getString('name')))) {
            return await interaction.reply( `There is no media with the name ${interaction.options.getString('name')}.`)
        }
 
        if (!(await updateName(id, interaction.options.getString('name'), interaction.options.getString('newname')))) {
            return await interaction.reply( "Something went wrong with the database.")
        }
 
        return await interaction.reply(`The media saved under ${interaction.options.getString('name')} is now under ${interaction.options.getString('newname')}.`)
 
    },
};