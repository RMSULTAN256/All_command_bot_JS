import { Client, GatewayIntentBits } from 'discord.js';
import config from './data/config.json' assert { type: 'json' }; const { token } = config;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!userinfo")) {
        const member = message.mentions.members.first() || message.member;
        if (!member) return message.reply("User not found!");

        // Get member data
        const userInfo = `👤 **Username:** ${member.user.tag}\n📅 **Joined:** ${member.joinedAt}\n🔷 **Roles:** ${member.roles.cache.map(r => r.name).join(", ")}`;
        message.reply(userInfo);
    }
});

client.login(token);
