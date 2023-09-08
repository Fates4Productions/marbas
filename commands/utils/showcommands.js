const { SlashCommandBuilder, Client, GatewayIntentBits} = require("discord.js");
const {BOT_OWNER_ID, BOT_TOKEN} = require('../../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds]});


module.exports = {
    data: new SlashCommandBuilder()
    .setName('showcommands')
    .setDescription('Show commands in current channel'),
    async execute(interaction) {
        client.login(BOT_TOKEN);
        var fs = require('fs');
        fs.readFile("showChannels.json",  function(err,content){
            if(err) throw err;
            var data = JSON.parse(content);
            if (JSON.stringify(data).includes(interaction.channelId)){
                return;
            }
            if (JSON.stringify(data).includes(interaction.guildId)){
                var obj = {channelId: interaction.channelId}
                for (i = 0; i < data.guilds.length; i++){
                    if (data.guilds[i].guildId === interaction.guildId){
                        data.guilds[i].channels.push(interaction.channelId);
                        break;
                    }
                }
            } else {
                var obj = {
                    guildId: interaction.guildId,
                    channels: [interaction.channelId]
                }
                data.guilds.push(obj)
            }
            
            fs.writeFileSync ("showChannels.json", JSON.stringify(data), function(err) {
            if (err) throw err;

            })
            
        });

        

        
        try{
            await interaction.editReply('Commands shown in this channel');
        } catch(err) {
            console.log(err);
            return;
        }        
        return;
        
    },
};
