import { SlashCommandBuilder, REST, Routes } from 'discord.js';
import config from './data/config.json' assert { type: 'json'}; const { token } = config;

const BotID = '1301080710609768459';
const ServerID = '1297850950601670657';
const ServerID2 = '1236809092362666017';

const rest = new REST().setToken(token);
const slashRegister = async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(BotID, ServerID2), {
            body: [
                new SlashCommandBuilder()
                .setName('level')
                .setDescription('Let`s see how much exp you need.')
                .addIntegerOption(option => {
                    return option
                    .setName('min-level')
                    .setDescription('Put your level now or min level')
                    .setRequired(true)
                    .setMaxValue(9999)
                })
                .addIntegerOption(option => {
                    return option
                    .setName('max-level')
                    .setDescription('Put your target level to know how much exp you need.')
                    .setRequired(true)
                    .setMaxValue(9999)
                }),
                new SlashCommandBuilder()
                .setName('translate')
                .setDescription('Translate the message to the language that you want.')
                .addStringOption(option => {
                    return option
                    .setName('lang')
                    .setDescription('The language that you want to translate. (ex: en, es, jp, etc.)')
                    .setRequired(true)
                })
                .addStringOption(option => {
                    return option
                    .setName('message')
                    .setDescription('The message that you want to translate.')
                    .setRequired(true)
                })
            ]
        });
    } catch (error) {
        console.log('There`s a error:', error);
    }
}

slashRegister();