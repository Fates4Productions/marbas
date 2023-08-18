const { SlashCommandBuilder, Client, GatewayIntentBits } = require("discord.js");
const {BOT_OWNER_ID, BOT_TOKEN} = require('../../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Send feedback about the bot')
    .addStringOption(option => option.setName('feedback')
        .setDescription('Feedback')
        .setRequired(true)),
    async execute(interaction) {
        client.login(BOT_TOKEN);
        client.users.send(BOT_OWNER_ID,`Feedback from ${interaction.user.username}: ${interaction.options.getString('feedback')}`);
        
        try{
            await interaction.editReply('Feedback sent!');
            } catch(err) {
            console.log(err);
            return;
        }        
        return;
    },
};
