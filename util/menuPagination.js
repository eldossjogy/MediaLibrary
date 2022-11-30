const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

async function buttonPages(interaction, pages, count) {
    time = 60000
    if (!interaction) throw new Error("Not a valid Interaction")
    if (!pages) throw new Error("Not a valid Page")
    if (!Array.isArray(pages)) throw new Error("Not an Array")
    if (typeof time !== "number") throw new Error("Invalid time")
    if (parseInt(time) < 30000) {
        throw new Error("Time 30 sec")
    }


    await interaction.deferReply({ ephemeral: true })

    if (pages.length === 1) {
        const page = await interaction.editReply({
            components: [pages],
            ephemeral: true,
            fetchReply: true,
        })
        return page
    }


    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setEmoji('⏮')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)


    const next = new ButtonBuilder()
        .setCustomId('next')
        .setEmoji('⏭')
        .setStyle(ButtonStyle.Primary)



    const buttonRows = new ActionRowBuilder().addComponents(prev, next)

    let index = 0;

    const currentPage = await interaction.editReply({
        content: `Select from the dropdown to see the content for each ${count} name.`,
        components: [pages[index], buttonRows],
        ephemeral: true,
        fetchReply: true,
    })

    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
    })


    collector.on("collect", async (i) => {
        if (i.customId === "send") {
            return
        }

        await i.deferUpdate()

        if (i.customId === "prev") {
            if (index > 0) index--;
        }
        if (i.customId === "next") {
            if (index < pages.length - 1) index++;
        }


        if (index === 0) prev.setDisabled(true);
        else prev.setDisabled(false);

        if (index === pages.length - 1) next.setDisabled(true);
        else next.setDisabled(false);
        if (i.customId === "next" || i.customId === "prev") {
            await interaction.editReply({
                content: "Select from the dropdown to see the content for each name on Page " + (index + 1)+ ".",
                components: [pages[index], buttonRows],
                ephemeral: true,
            });
        }

        collector.resetTimer();
    })

    collector.on("end", async (i) => {
        await interaction.editReply({
            components: [pages[index]],
        })
    })
    return currentPage
}

module.exports = buttonPages