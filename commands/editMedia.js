const { SlashCommandBuilder } = require('discord.js');
const { queryData, updateMedia } = require("../db/dbCommands");
const { hasManager } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('editmedia')
            .setDescription('Edit a media for the library by name')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Set a name for the media your saving.')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('newmedia')
                    .setDescription('Link of the media you save.')
                    .setRequired(true)),
    async execute(interaction) {
        let id = "id" + interaction.guild.id
        if (hasManager(interaction.member)) {
            if (await tableExists(id)) {
                if (await queryData(id, interaction.options.getString('name'))) {
                    if (await updateMedia(id, interaction.options.getString('name'), interaction.options.getString('newmedia'))) {
                        res = `The media saved under ${interaction.options.getString('name')} has been updated.`
                    }
                    else {
                        res = "Something went wrong with the database."
                    }
                }
                else {
                    res = `There is no media with the name ${interaction.options.getString('name')}.`
                }
            }
            else {
                res = "A media library does not exist.";
            }
        }
        else {
            res = { content: "You are not authorized to use this command. Only users with the 'Manage Messages' permission or higher can use this command.", ephemeral: true }
        }

        await interaction.reply(res);

    },
};