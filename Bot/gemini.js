import axios from 'axios';
import { Client, GatewayIntentBits } from 'discord.js';
import config from '../data/config.json' with { type: 'json' };

const { token, tokengemini } = config;

const IGNORE_PREFIX = '!';
const ALLOWED_CHANNEL = '1339842706415030365';
const GEMINI_API_KEY = tokengemini;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

export async function app_ai() {
    client.once('ready', () => {
        console.log('Gemini Ai is READY');
    });

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (message.content.startsWith(IGNORE_PREFIX)) return;
        if (!message.mentions.users.has(client.user.id) && message.channel.id !== ALLOWED_CHANNEL) return;

        const userQuery = message.content;

        let loadingmess = await message.reply('Loading...🚀')
        try {
            // Call Google Gemini API
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: userQuery }] }],
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            await loadingmess.delete();

            const reply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";
            if (reply <= 2000) {
                message.reply(reply);
            } else {
                const chunks = reply.match(/[\s\S]{1,2000}/g); // Split text into parts of max 2000 characters
                for (const chunk of chunks) {
                    await message.channel.send(chunk);
            }
        }
            
        } catch (error) {
            console.error('Error with Gemini API:', error.response?.data || error.message);
            message.reply("I'm sorry, something went wrong with Gemini AI.");
        }
    }); 

    client.login(token);
}