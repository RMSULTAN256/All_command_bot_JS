import { Client, GatewayIntentBits } from 'discord.js';
import config from '../data/config.json' assert { type: 'json' };

const { token, channel2: channelID2 } = config;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Required to track role updates
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

export async function CheckRole() {
    client.once("ready", () => {
        console.log(`✅ Bot is online as ${client.user.tag}`);
    });
    
    // Event: When a user’s roles change
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        const guild = newMember.guild;
    
        // Fetch the logging channel
        const channel2 = await client.channels.fetch(channelID2).catch(err => {
            console.error("❌ Failed to fetch channel:", err);
            return null;
        });
    
        if (!channel2 || !channel2.isTextBased()) {
            console.error("❌ The specified channel is not text-based or could not be fetched.");
            return;
        }
    
        const roleBoyID = '1336207147020718080';
        const roleGirlID = '1336207229367615569';
        
        const roleBoy = guild.roles.cache.get(roleBoyID);
        const roleGirl = guild.roles.cache.get(roleGirlID);
    
        if (!roleBoy || !roleGirl) {
            console.error("❌ One or both of the specified roles do not exist in this server.");
            return;
        }
    
        const hasBoy = newMember.roles.cache.has(roleBoyID);
        const hasGirl = newMember.roles.cache.has(roleGirlID);
    
        if (hasBoy && hasGirl) {
            const addedRole = oldMember.roles.cache.has(roleBoyID) ? roleGirl : roleBoy;
    
            await newMember.roles.remove(addedRole);
            console.log(`❌ Removed ${addedRole.name} from ${newMember.user.username} to keep only one role.`);
    
            try {
                await newMember.send(`⚠️ You can only have one role. The role **${addedRole.name}** was removed.`);
            } catch (err) {
                console.warn(`⚠️ Could not send DM to ${newMember.user.tag}.`);
            }
    
            await channel2.send(`🚨 **User Alert:** ${newMember.user.tag} tried to take both roles! Removed **${addedRole.name}**.`);
        }
    });
    
    // Start the bot
    client.login(token);
    
}