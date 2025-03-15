import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import fs from 'fs';
import prompt from 'prompt-sync';
import config from './data/config.json' assert { type: 'json' };


const { token, channel2: channelID2 } = config;
const FishData = JSON.parse(fs.readFileSync('./data/fish.json', 'utf-8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Required to track role updates
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

export async function fish() {
    const paginations = new Map();

    client.on('messageCreate', async (message) => {
        const channel2 = await client.channels.fetch(channelID2);
        if (!channel2.isTextBased()) return;

        if (message.content.startsWith('!bes')) {
            const args = message.content.slice(5).split(/\s+/);
            const nameisland = args.join(" ");
            const searchisland = FishData[nameisland];

            if (!searchisland) {
                await message.channel.send('Island is not found or please add Uppercase.');
            } else if (searchisland.length === 0) {
                await message.channel.send('Put name island to search the bestiary')
            };

            let page = 0;
            try {
                const embed = CreateFishEmbed(searchisland[page], page, searchisland.length);
                const button = CreateFishButton(page, searchisland.length);

                const msg = await message.channel.send({embeds: [embed], components: [button]});

                paginations.set(msg.id, {searchisland, page, msg})
            
            } catch (error) {
                console.error("Here your error: " + error)    
            };
            
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const pagination = paginations.get(interaction.message.id);
        if (!pagination) return;

        const { searchisland, msg } = pagination;
        let page = pagination.page;
        
        if (interaction.customId === 'prev' && page > 0) {
            page--;
        } else if (interaction.customId === 'next' && page < searchisland.length - 1) {
            page++;
        }

        const embed = CreateFishEmbed(searchisland[page], page, searchisland.length);
        const button = CreateFishButton(page, searchisland.length);

        await interaction.update({embeds: [embed], components: [button]});

        paginations.set(msg.id, {searchisland, page, msg});
    });

    client.login(token);
};

function CreateFishEmbed(fish, page, total) {
    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(fish.Name)
        .setFields(
            {name: `Rarity`, value: `${fish.Rarity}`},
            {name: `Weather`, value: `${fish.Weather}`},
            {name: `Time`, value: `${fish.Time}`},
            {name: `Season`, value: `${fish.Season}`},
            {name: `Bait`, value: `${fish.Bait}`},
            {name: `Radar`, value: `${fish.Radar}`},
            {name: `C$/KG`, value: `${fish.ValuePerKg}`},
            {name: `Avarage KG`, value: `${fish.AvgKg}`},
            {name: `Avarage C$`, value: `${fish.AvgPrice}`}
        )
        .setFooter({text: `Fish ${page + 1} of total ${total}`});
}

function CreateFishButton(page, total) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('⬅️ prev')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('➡️ next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === total - 1)
    );
}

fish();