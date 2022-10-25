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
			),
	async execute(interaction) {
		let id = "id" + interaction.guild.id
		if (await tableExists(id)) {
			request = await queryData(id, interaction.options.getString('name'))
			if (request) {
				res = request
			}
			else {
				res = "That name does not exist"
			}
		}
		else {
			res = "A media library does not exist.";
		}
		await interaction.reply(res);
	},
};