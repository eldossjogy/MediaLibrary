const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { queryAll } = require("../db/dbCommands");
const buttonPages = require("../util/menuPagination");

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('listmedia')
            .setDescription('List all saved media by name'),

    async execute(interaction) {
        let id = interaction.guild.id.toString()

        res = await queryAll(id)
        optionsList = []
        res.sort((a, b) => (a.name.toUpperCase()[0] > b.name.toUpperCase()[0]) ? 1 : -1)
        res.forEach(element => {
            optionsList.push({ label: element.name, value: element.name })
        });
        selectRows = []
        count = optionsList.length
        if (count == 0) {
            return await interaction.reply({ content: `There is no media saved on the server. Use /setmedia to set a media`, ephemeral: true })
        }
        if (count > 25) {
            let numList = (Math.ceil(optionsList.length / 25))
            for (let i = 0; i < numList; i++) {
                optList = optionsList.slice(i * 25, 25 + (25 * i))
                const currentSelect = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Nothing selected on Page ' + (i + 1).toString())
                            .addOptions(optList),
                    );
                selectRows.push(currentSelect)
            }
            const pages = selectRows;
            buttonPages(interaction, pages, count)
        }
        else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected on page')
                        .addOptions(optionsList),
                );
            return await interaction.reply({ content: `Select from the dropdown to see the media for each ${count} name.`, ephemeral: true, components: [row] })
        }

    },

};