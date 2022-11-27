const { SlashCommandBuilder } = require('discord.js');
const { insertData } = require("../db/dbCommands");
const { hasMedia } = require('../util/hasMedia');

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
        let id = interaction.guild.id.toString()
        let userId = interaction.member.id

        if (await hasMedia(id, interaction.options.getString('name'))) {
            return await interaction.reply({ content: "There is already a media with this link.", ephemeral: true })
        }

        res = (await insertData(id, interaction.options.getString('name'), interaction.options.getString('link'), userId))

        if (!res.status) {
            return await interaction.reply({ content: res.message, ephemeral: true })
        }

        return await interaction.reply(`Media saved under ${interaction.options.getString('name')}`)
    },
};