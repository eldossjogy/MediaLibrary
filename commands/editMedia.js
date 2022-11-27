const { SlashCommandBuilder } = require('discord.js');
const { queryData, updateMedia } = require("../db/dbCommands");
const { hasManager } = require('../util/hasRole');
const { isAuthor } = require('../util/isAuthor');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('editmedia')
            .setDescription('Edit the media link for a media in the library.')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Name of media being edited.')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('newmedia')
                    .setDescription('Link of the new media.')
                    .setRequired(true)),
    async execute(interaction) {
        let id = interaction.guild.id.toString()
        let userId = interaction.member.id

        if (!(hasManager(interaction.member) || isAuthor(id, interaction.options.getString('name'),userId))) {
            return await interaction.reply( { content: "You are not authorized to use this command. Only users with the 'Manage Messages' permission or higher can use this command.", ephemeral: true })
        }

        if (!(await queryData(id, interaction.options.getString('name')))) {
            return await interaction.reply( `There is no media with the name ${interaction.options.getString('name')}.`)
        }
 
        if (!(await updateMedia(id, interaction.options.getString('name'), interaction.options.getString('newmedia')))) {
            return await interaction.reply( "Something went wrong with the database.")
        }

        return await interaction.reply( `The media saved under ${interaction.options.getString('name')} has been updated.`)
    },
};