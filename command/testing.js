import { AttachmentBuilder, Client, IntentsBitField, SlashCommandBuilder } from "discord.js";
import config from "../data/config.json" assert { type: 'json' }; const { token, channel: channelId } = config;

export default  {
    data: new SlashCommandBuilder()
        .setName('testing')
        .setDescription('Testing the bot'),
    async execute(interaction) {
        await interaction.reply('Testing the bot');
    },
};
