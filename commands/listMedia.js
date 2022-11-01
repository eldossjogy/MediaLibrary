const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { queryAll } = require("../db/dbCommands");
const { tableExists, tableNotEmpty } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('listmedia')
            .setDescription('List all saved media by name'),

    async execute(interaction) {
        let id = "id" + interaction.guild.id

        if (!(await tableExists(id))) {
            return await interaction.reply("A media library does not exist.");
        }

        if (!(await tableNotEmpty(id))) {
            return await interaction.reply("The media library has no content.")
        }

        res = await queryAll(id)
        optionsList = []
        res.sort((a, b) => (a.name.toUpperCase()[0] > b.name.toUpperCase()[0]) ? 1 : -1)
        res.forEach(element => {
            optionsList.push({ label: element.name, value: element.name })
        });
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions(optionsList),);
        return await interaction.reply({ content: 'Select from the dropdown to see the content for each name.', ephemeral: true, components: [row] })
    }
};