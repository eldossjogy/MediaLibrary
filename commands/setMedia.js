const { SlashCommandBuilder } = require('discord.js');
const { insertData } = require("../db/dbCommands");
const { tableExists } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('setmedia')
            .setDescription('Set Media by Name')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Set a name for the media your saving.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('link')
                    .setDescription('Link of the media you save.')
                    .setRequired(true)),
    async execute(interaction) {
        let id = "id" + interaction.guild.id
        if (await tableExists(id)) {
            if (await insertData(id, interaction.options.getString('name'), interaction.options.getString('link'))) {
                res = `Media saved under ${interaction.options.getString('name')}`
            }
            else {
                res = "Failed to save."
            }
        }
        else {
            res = "A media library does not exist.";
        }

        await interaction.reply(res);

    },
};