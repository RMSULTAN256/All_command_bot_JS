import { Client, IntentsBitField } from 'discord.js';
import config from '../data/config.json' assert {type: 'json'}; const { token, channel: channelId } = config;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ],
  });
  


  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    try {
      const channel = await client.channels.fetch(channelId);
  
      if (!channel.isTextBased()) {
        console.error('The specified channel is not text-based.');
        return;
      }
  
      let fetchedMessages;
      do {
        fetchedMessages = await channel.messages.fetch({ limit: 100 }); // Fetch up to 100 messages
        await channel.bulkDelete(fetchedMessages, true); // Bulk delete messages
      } while (fetchedMessages.size > 0); // Continue until no messages are left
  
      console.log('All messages deleted successfully.');
    } catch (error) {
      console.error('Error deleting messages:', error.message);
    }
  });
  
  client.login(token);