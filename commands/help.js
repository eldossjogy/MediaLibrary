const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('help'),

    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Help')
            .setDescription('This bot allows you to save a media links with a name. This allows users to lookup for saved media, and reduces time to send commonly sent media.')
            .addFields(
                { name: '**createlibrary**', value: 'Creates a media library for the server.' },
                { name: '**deletelibrary**', value: 'Delete the media library for the server.' },
                { name: '**purgelibrary**', value: "Removes all media in the server's media library." },
                { name: '**setmedia**', value: 'Sets a media in the media library.' },
                { name: '**getmedia**', value: 'Gets a media from the media library.' },
                { name: '**renamelibrary**', value: 'Rename a media in media library.' },
                { name: '**listmedia**', value: 'List all media in media library.' },
            )
            .setFooter({ text: 'MediaLibrary', iconURL: 'https://i.imgur.com/JTtOUTG.png' });

    await interaction.reply({ embeds: [helpEmbed] ,  ephemeral: true });
}
};