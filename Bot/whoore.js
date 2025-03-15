import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import config from '../data/config.json' assert { type: 'json' };

const { token, channel: channelId, channel2: channelId2 } = config;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
export async function GetDataEvents() {
    let intervalID;
    let lastMessage = null;

    client.once('ready', async () => {

        try {
            const channel = await client.channels.fetch(channelId);
            const channel2 = await client.channels.fetch(channelId2);
            if (!channel.isTextBased()) {
                console.error('The specified channel is not text-based.');
                return;
            }

            intervalID = setInterval(async () => {
                try {
                    const data = JSON.parse(fs.readFileSync('./data/eventMeg.json', 'utf-8'));

                    const embed = new EmbedBuilder()
                        .setTitle('────୨Events Informationৎ────')
                        .setColor('#00FF00')
                        .setThumbnail('https://i.pinimg.com/736x/2b/d4/cc/2bd4cc51609ad9fcf3955f7955d54025.jpg')
                        .setTimestamp();
                    data.forEach((events) => {
                        embed.addFields({
                            name: `${events.Event ?  (events.Event === 'Phantom Megalodon') ? `🦈 ${events.Event}` 
                            : `${events.Event}` : null}`,
                            value: `**Countdown:** ${events.countdown}`,
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
                            await channel2.send({ embeds: [embed] }),
                        ]
                    }
                } catch (error) {
                    console.error('Error during interval execution:', error.message);
                    clearInterval(intervalID);
                }
            }, 7000); // Every 5 seconds
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