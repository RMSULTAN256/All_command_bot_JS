import { Client, IntentsBitField, MessageFlags, EmbedBuilder } from 'discord.js';
import config from '../data/config.json' assert { type: "json" }; const { token } = config;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
  ]
});

export async function CaclLevel() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });

  function Greef(total, ) {

  }

  client.once("ready", () => {
      console.log('The bot Ready.')
    });
    
    client.on("interactionCreate", async (interaction) => {
      if (interaction.isCommand()) {
        if (interaction.commandName === 'level') {
          const MinLv = interaction.options.getInteger('min-level')
          const MaxLv = interaction.options.getInteger('max-level')
          let grandTotal = 0;

          await interaction.deferReply();
          
          let Greef_Fish = 3500;
          let Greef_Fish_Clever = 7875;
          let Greef_Fish_Pass = 7000;
          let Greef_Fish_Double = Greef_Fish_Clever + Greef_Fish_Pass;
          
          let Count1 = 0;
          let Count2 = 0;
          let Count3 = 0;
          let Count4 = 0;

          const range = MaxLv - MinLv - 1;
          for ( let i=0; i<=range; i++) {
              const level = MinLv + i;
              grandTotal += (level - 1) * 190;
          }

          Count1 = Math.ceil(grandTotal / Greef_Fish);
          Count2 = Math.ceil(grandTotal / Greef_Fish_Clever);
          Count3 = Math.ceil(grandTotal / Greef_Fish_Pass);
          Count4 = Math.ceil(grandTotal / Greef_Fish_Double);

          const embed = new EmbedBuilder()
              .setColor('Aqua')
              .setTitle('Calculate EXP')
              .setDescription(`From Level ${MinLv} -> ${MaxLv}`)
              .setThumbnail('https://i.pinimg.com/originals/c0/09/10/c00910e4b80844c9234300c8abf395d7.gif')
              .addFields([
                { name: `XP`, value: `**${formatter.format(grandTotal)}**` },
                { name: `1 Grand Reef Guardian Fish`, value: `**${Greef_Fish} XP**` },
                { name: `Without Clever & Gamepass`, value: `🐟 **${formatter.format(Count1)}** Grand Reef Guardian.` },
                { name: `With Clever`, value: `🐟 **${formatter.format(Count2)}** Grand Reef Guardian.` },
                { name: `With Gamepass`, value: `🐟 **${formatter.format(Count3)}** Grand Reef Guardian.` },
                { name: `With Clever & Gamepass`, value: `🐟 **${formatter.format(Count4)}** Grand Reef Guardian.` },
              ])
              .setFooter({ text: 'Keep grinding! 🚀' })
              .setTimestamp();

          await interaction.editReply({ embeds: [embed]});
        }
      }
    });
  
  client.login(token)
}
