const { SlashCommandBuilder, Client, GatewayIntentBits} = require("discord.js");
const {BOT_OWNER_ID, BOT_TOKEN} = require('../../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
var removed = false;


module.exports = {
    data: new SlashCommandBuilder()
    .setName('hide')
    .setDescription('Hide commands in current channel'),
    async execute(interaction) {
        client.login(BOT_TOKEN);
        //console.log(interaction.guildId, interaction.channelId);
        //client.users.send(BOT_OWNER_ID,`Feedback from ${interaction.user.username}: ${interaction.options.getString('feedback')}`);
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
                        removed = true;
                        break;
                    }
                }
            }
            
            fs.writeFileSync ("showChannels.json", JSON.stringify(data), function(err) {
            if (err) throw err;

            })
            
        });

        

        try{
            if (removed)
                await interaction.editReply('Commands now hidden from this channel');
            else
                await interaction.editReply('Commands already hidden in current channel');
            } catch(err) {
            console.log(err);
            return;
        }        
        return;
    },
};
