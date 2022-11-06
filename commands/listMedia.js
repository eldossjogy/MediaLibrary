const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { queryAll } = require("../db/dbCommands");
const buttonPages = require("../util/menuPagination");
const { tableExists, tableNotEmpty } = require("../util/tableCheck");

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
        selectRows = []
        if (optionsList.length > 25) {
            let numList = (Math.ceil(optionsList.length / 25))
            for (let i = 0; i < numList; i++) {
                optList = optionsList.slice(i * 25, 25 + (25 * i))
                const currentSelect = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Nothing selected on Page ' + (i + 1).toString())
                            .addOptions(optList),
                    );
                selectRows.push(currentSelect)
            }
        }

        const pages = selectRows;
        buttonPages(interaction, pages)
    },

};