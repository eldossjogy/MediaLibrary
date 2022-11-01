const { SlashCommandBuilder } = require('discord.js');
const { insertData, queryData } = require("../db/dbCommands");
const { tableExists } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('setmedia')
            .setDescription('Set media by name')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Set a name for the media your saving.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('link')
                    .setDescription('Link of the media.')
                    .setRequired(true)),
    async execute(interaction) {
        let id = "id" + interaction.guild.id
        let userId = interaction.member.id

        if (!(await tableExists(id))) {
            return await interaction.reply( "A media library does not exist.")
        }

        if (await queryData(id, interaction.options.getString('name'))) {
            return await interaction.reply( `There is already a media with the name ${interaction.options.getString('name')}.`)
        }

        if (!(await insertData(id, interaction.options.getString('name'), interaction.options.getString('link'), userId))) {
            return await interaction.reply( "Something went wrong with the database.")
        }

        return await interaction.reply(`Media saved under ${interaction.options.getString('name')}`)
    },
};