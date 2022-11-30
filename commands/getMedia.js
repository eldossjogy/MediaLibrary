const { SlashCommandBuilder } = require('discord.js');
const { queryData } = require("../db/dbCommands");
const { isAttachable } = require('../util/isAttachable');

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
		let id = interaction.guild.id.toString()

		request = await queryData(id, interaction.options.getString('name'))

		if (!(request)) {
			return await interaction.reply("That name does not exist")
		}

		let res = await isAttachable(request)
		if (res[0]) {
			await interaction.deferReply()
			return await interaction.followUp({
				files: [{
					attachment: request,
					name: 'media' + res[1]
				}],
			})
		}
		return await interaction.reply(request)
	},
};