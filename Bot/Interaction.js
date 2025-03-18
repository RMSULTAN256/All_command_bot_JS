import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { translate } from '@vitalets/google-translate-api';
import config from '../data/config.json' assert { type: "json" };import { getReadableAsTypedArray } from 'puppeteer';
 const { token } = config;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ]
});

export async function CaclLevel() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      if (interaction.commandName === 'level') {
        const MinLv = interaction.options.getInteger('min-level')
        const MaxLv = interaction.options.getInteger('max-level')
        let grandTotal = 0;
          
        await interaction.deferReply();
          
        const Greef_Fish = 3500;
        let Greef_Fish_Clever = Greef_Fish * 2.25;
        let Greef_Fish_Pass = Greef_Fish * 2;
        let Greef_Fish_Double = Greef_Fish * 2.25 * 2;
        let perfect_greef = Greef_Fish * 2.25 * 2 * 1.5;
        let Double_exp = Greef_Fish * 2.25 * 2 * 1.5 * 2;

        let Count1 = 0;
        let Count2 = 0;
        let Count3 = 0;
        let Count4 = 0;
        let Count5 = 0;
        let Count6 = 0;

        const range = MaxLv - MinLv - 1;
        for ( let i=0; i<=range; i++) {
            const level = MinLv + i;
            grandTotal += (level - 1) * 190;
        }

        Count1 = Math.ceil(grandTotal / Greef_Fish);
        Count2 = Math.ceil(grandTotal / Greef_Fish_Clever);
        Count3 = Math.ceil(grandTotal / Greef_Fish_Pass);
        Count4 = Math.ceil(grandTotal / Greef_Fish_Double);
        Count5 = Math.ceil(grandTotal / perfect_greef);
        Count6 = Math.ceil(grandTotal / Double_exp);

        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('Calculate EXP')
            .setDescription(`From Level ${MinLv} -> ${MaxLv}\nNeed ${formatter.format(grandTotal)} XP`)
            .setThumbnail('https://i.pinimg.com/originals/c0/09/10/c00910e4b80844c9234300c8abf395d7.gif')
            .addFields([
              { name: `1 Grand Reef Guardian Fish`, value: `**${Greef_Fish} XP**` },
              { name: `Without Clever & Gamepass`, value: `🐟 **${formatter.format(Count1)}** Grand Reef Guardian.` },
              { name: `With Clever`, value: `🐟 **${formatter.format(Count2)}** Grand Reef Guardian.` },
              { name: `With Gamepass`, value: `🐟 **${formatter.format(Count3)}** Grand Reef Guardian.` },
              { name: `With Clever & Gamepass`, value: `🐟 **${formatter.format(Count4)}** Grand Reef Guardian.` },
              { name: `With Perfect Catch`, value: `🐟 **${formatter.format(Count5)}** Grand Reef Guardian.`},
              { name: `With Double EXP Weekend`, value: `🐟 **${formatter.format(Count6)}** Grand Reef Guardian.`},
            ])
            .setFooter({ text: 'Keep grinding! 🚀' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed]});
      }

      if (interaction.commandName === 'translate') {
        const lang = interaction.options.getString('lang');
        const message = interaction.options.getString('message');

        if (message) {
          try {
            const res = await translate(message, { to: lang });
            await interaction.reply(`Translated to ${lang.toUpperCase()}: ${res.text}`);
          } catch (error) {
            console.log(error);
            await interaction.reply('An error occurred while trying to fetch the message');
        }
        } else {
          await interaction.reply('You need to reply to a message to use this command');
        }
      }
    }
    });
  
  client.login(token)
}