import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import config from '../data/config.json' assert { type: 'json' };

const { token, channel: channelId, channel2: channelId2 } = config; // Rename channel to channelId to avoid confusion

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

export async function GetDataSeasons() {
    let intervalID;
    let lastMessage = null;

    client.once('ready', async () => {

        try {
            // Fetch and initialize the channel
            const channel = await client.channels.fetch(channelId);
            const channel2 = await client.channels.fetch(channelId2);
            if (!channel.isTextBased()) {
                console.error('The specified channel is not text-based.');
                return;
            } else if (!channel2.isTextBased()) {
                console.error('The specified channel is not text-based.')
                return;
            };

            intervalID = setInterval(async () => {
                try {
                    // Read the JSON file
                    const data = JSON.parse(fs.readFileSync('./data/seasoninfo.json', 'utf-8'));

                    const embed = new EmbedBuilder()
                        .setTitle('────୨Season Informationৎ────')
                        .setColor('#00FF00')
                        .setThumbnail('https://i.pinimg.com/736x/2b/d4/cc/2bd4cc51609ad9fcf3955f7955d54025.jpg')
                        .setTimestamp();

                    data.forEach((season) => {
                        const current = season.isCurrent ? '🟢 ' : '⚪ ';
                        embed.addFields({
                            name: `${current} ` + `${season.seasonName ? (season.seasonName == 'Summer') ? `🌞 ${season.seasonName}` 
                            : (season.seasonName == 'Winter') ? `❄️ ${season.seasonName}` 
                            : (season.seasonName == 'Spring') ? `🌸 ${season.seasonName}`
                            : (season.seasonName == 'Autumn') ? `🍁 ${season.seasonName}`
                            : 'Unknown'
                            : 'Unknown'}`,
                            value: `**Time:** ${season.time}\n**Countdown:** ${season.countdown}`,
                            inline: false,
                        });
                    });

                    if (lastMessage) {
                        for (const msg of lastMessage) {
                            await msg.edit({ embeds: [embed] });
                        }
                    } else {
                        lastMessage = [
                            await channel.send({ embeds: [embed] }),
                            await channel2.send({ embeds: [embed] })
                        ]
                    }
                } catch (error) {
                    console.error('Error during interval execution:', error.message);
                    clearInterval(intervalID);
                }
            }, 7000);
        } catch (error) {
            console.error('Failed to fetch the channel:', error.message);
        }
    });

    client.on('messageDelete', (deletedMessage) => {
        if (lastMessage && deletedMessage.id === lastMessage.id) {
            lastMessage = null;
        }
    });

    client.login(token);
    
}