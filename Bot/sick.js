import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
import config from '../data/config.json' assert { type: 'json' }; const { token } = config;
import fs from 'fs';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.once('ready', async () => {
    sendFish();
});

async function sendFish() {
    fs.readFile('./data/Fisch.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Failed to read the file', err);
            return;
        }

        const fishData = JSON.parse(data);

        const embed = new EmbedBuilder()
            .setTitle('────୨Fish Informationৎ────')
            .setColor('#00FF00')
            .setThumbnail('https://i.pinimg.com/736x/66/85/77/6685772a19453128fc0dc24f3d584d3e.jpg')
            .setTimestamp();

        fishData.forEach((fish) => {
            embed.addFields({
                name: `${fish.Name}`,
                value: `**Rarity:** ${fish.Rarity}\n**Weather:** ${fish.Weather}\n**Time:** ${fish.Time}\n**Season:** ${fish.Season}\n**Bait:** ${fish.Bait}\n**Radar:** ${fish.Radar}\n**Value Per Kg:** ${fish.ValuePerKg}\n**Avg Kg:** ${fish.AvgKg}\n**Avg Price:** ${fish.AvgPrice}\n**Island:** ${fish.Island}`,
                inline: false,
            });
        });

        client.channels.cache.get('channelID').send({ embeds: [embed] });
    });
    
}