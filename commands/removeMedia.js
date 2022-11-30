const { SlashCommandBuilder } = require('discord.js');
const { deleteData } = require('../db/dbCommands');
const { hasMedia } = require('../util/hasMedia');
const { hasManager } = require('../util/hasRole');
const { isAuthor } = require('../util/isAuthor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemedia')
		.setDescription('Delete a media for the library by name')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the media')
				.setRequired(true)
				.setAutocomplete(true)
		),	
	async execute(interaction) {
		let id = interaction.guild.id.toString()
        let userId = interaction.member.id

        if (!(hasManager(interaction.member) || isAuthor(id, interaction.options.getString('name'),userId))) {
            return await interaction.reply( { content: "You are not authorized to use this command. Only users with the 'Manage Messages' permission or higher can use this command.", ephemeral: true })
        }

        if (!(await hasMedia(id, interaction.options.getString('name')))) {
            return await interaction.reply( `There is no media with the name ${interaction.options.getString('name')}.`)
        }
 
        if (!(await deleteData(id, interaction.options.getString('name')))) {
            return await interaction.reply( "Something went wrong with the database.")
        }

        return await interaction.reply(`The media ${interaction.options.getString('name')} has been removed from the library.`)
	},
};