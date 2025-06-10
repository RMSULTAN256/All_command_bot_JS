import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import config from './data/config.json' assert { type: 'json' };
import { channel } from 'diagnostics_channel';
const { token, channel3: channelID } = config;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', async () => {
    console.log(`Ready`);
    try {
        const channel = await client.channels.fetch(channelID);
        if (!channel.isTextBased()) {
            console.log('The specified channel is not text-based');
            return;
        } else {
            console.log(`Fetching success from channel`);
            GetDataStock(channel);
        }
    } catch (error) {
        console.error('Error fetching channel:', error);
    }
});

export async function GetDataStock(channel) {
    
    fs.readFile('./stocks.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Failed to read the file', err)
            return;
        }

        const StockData = JSON.parse(data);

        const embed = new EmbedBuilder()
            .setTitle('Stock')
            .setColor('Blue')
            .setThumbnail('https://i.pinimg.com/originals/a5/a8/31/a5a8318c9abc50a09f836028a41c6985.gif')
            .setTimestamp()

            for (const [category, items] of Object.entries(StockData)) {
                if (items.length > 0) {
                    const itemlist = items.map(item=> {
                        let emoji  = '';
                        if (category === 'gearStock') {
                            emoji = '🛠️';
                        } else if (category === 'eggStock') {
                            emoji = '🥚';
                        } else if (category === 'seedStock') {
                            emoji = '🌱';
                        }

                        if (item.name.includes('Watering Can')) emoji = '🚿';
                        if (item.name.includes('Carrot')) emoji = '🥕';

                        return `${emoji} ${item.name}`;

                    }).join('\n');
                    
                    embed.addFields({
                        name: category,
                        value: itemlist,
                        inline: false
                    });
                }
            }

            channel.send({ embeds: [embed]});
   
    })
}
client.login(token)