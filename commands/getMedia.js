const { SlashCommandBuilder } = require('discord.js');
const { queryData } = require("../db/dbCommands");
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName('getmedia')
			.setDescription('Get media in library by name')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('Name of the media')
					.setRequired(true)
					.setAutocomplete(true)
			),
	async execute(interaction) {
		let id = "id" + interaction.guild.id

		if (!(await tableExists(id))) {
			return await interaction.reply("A media library does not exist.");
		}
		
		request = await queryData(id, interaction.options.getString('name'))

		if (!(request)) {
			return await interaction.reply("That name does not exist")
		}

		return await interaction.reply(request)
	},
};