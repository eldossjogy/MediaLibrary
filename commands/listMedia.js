const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { queryAll } = require("../db/dbCommands");
const { tableExists, tableEmpty } = require('../util/tableCheck');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('listmedia')
            .setDescription('List all saved media by name'),

    async execute(interaction) {
        let id = "id" + interaction.guild.id
        if (await tableExists(id)) {
            if (await tableEmpty(id)) {
                res = await queryAll(id)
                optionsList = []
                res.forEach(element => {
                    optionsList.push({ label: element.name, value: element.name })
                });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Nothing selected')
                            .addOptions(optionsList),);
                res = { content: 'Select from the dropdown to see the content for each name.', ephemeral: true, components: [row] }
            }
            else {
                res = "The media library has no content."
            }
        }
        else {
            res = "A media library does not exist.";
        }
        await interaction.reply(res);

    }
};