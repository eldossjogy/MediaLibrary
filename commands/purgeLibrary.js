const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { hasAdmin } = require('../util/hasRole');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wipelibrary')
		.setDescription('Empty the library removing all media (Confirmation Required)'),
	async execute(interaction) {
		if (!(hasAdmin(interaction.member))) {
			return await interaction.reply({ content: "You are not authorized to use this command. Only users with the 'Ban Members' or server admins can use this command.", ephemeral: true })
		}
		const confirm = new ButtonBuilder()
			.setCustomId('confirmWipe')
			.setLabel('Confirm wiping library')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancelWipe')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		await interaction.reply({
			content: `Are you sure you want to wipe this servers media library?`,
			components: [row],
		});
	},
};