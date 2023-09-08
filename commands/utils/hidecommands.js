const { SlashCommandBuilder, Client, GatewayIntentBits, PermissionsBitField} = require("discord.js");
const {BOT_TOKEN} = require('../../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hidecommands')
    .setDescription('Hide commands in current channel'),
    async execute(interaction) {
        client.login(BOT_TOKEN);
        if(!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)){
            await interaction.editReply('Administrator only command.');
            return;
        }
        var fs = require('fs');
        fs.readFile("showChannels.json",  async function(err,content){
            if(err) throw err;
            var removed = false;
            var data = JSON.parse(content);
            if (!JSON.stringify(data).includes(interaction.channelId)){
                interaction.editReply('Commands already hidden in this channel');
                return;
            }
            if (JSON.stringify(data).includes(interaction.guildId)){
                var obj = {channelId: interaction.channelId}
                for (i = 0; i < data.guilds.length; i++){
                    if (data.guilds[i].guildId === interaction.guildId){
                        data.guilds[i].channels.push(interaction.channelId);
                        removed = true;
                        break;
                    }
                }
            }
            
            fs.writeFileSync ("showChannels.json", JSON.stringify(data), function(err) {
            if (err) throw err;

            })
            try{
                if (removed)
                    await interaction.editReply('Commands now hidden in this channel');
                else 
                    await interaction.editReply('Commands already hidden in this channel');
            } catch(err) {
                console.log(err);
                return;
            }        
        });
        
        
        return;
        
    },
};
