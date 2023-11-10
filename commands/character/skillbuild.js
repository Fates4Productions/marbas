const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skillbuild')
    .setDescription('Check a character\' skill build')
    .addStringOption(option => option.setName('ign')
        .setDescription('Character to look up.')
        .setRequired(true))
    .addStringOption(option => option.setName('server')
        .setDescription('Search Server')
        .setRequired(true)
        .addChoices(
            {name: 'Cain', value: 'cain'},
            {name: 'Sirocco', value: 'siroco'},
        )),
    async execute(interaction) {
        const ign = interaction.options.getString('ign');
        const server = interaction.options.getString('server');
        let adventureName = '';
        let characterId = '';
        let characterName = '';
        let jobGrowName = '';
        let fame = 0;
        let activeSkills = '';
        let passiveSkills = '';
        let embed = {};
        fetch(`https://api.dfoneople.com/df/servers/${server}/characters?&apikey=${API_KEY}&characterName=${ign}&wordType=match`)
        .then(res => res.json())
            .then(data => {
                if(data.error){
                    throw Error(`${data.error.status} - ${data.error.code} [${data.error.message}]`)
                }
                if(!data.rows[0]) return interaction.editReply("That character doesn't exist... yet.");
                characterId = data.rows[0].characterId,
                characterName = data.rows[0].characterName,
                jobGrowName = data.rows[0].jobGrowName,
                fame = data.rows[0].fame,
                fetch(`https://api.dfoneople.com/df/servers/${server}/characters/${characterId}/skill/style?apikey=${API_KEY}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    if(data2.error){
                        throw Error(`${data2.error.status} - ${data2.error.code} [${data2.error.message}]`)
                    }
                    for (i=0; i<data2.skill.style.active.length; i++){
                        activeSkills = activeSkills.concat(data2.skill.style.active[i].name + ": " + data2.skill.style.active[i].level + "\n");
                    }
                    for (i=0; i<data2.skill.style.passive.length; i++){
                        passiveSkills = passiveSkills.concat(data2.skill.style.passive[i].name + ": " + data2.skill.style.passive[i].level + "\n");
                    }

                    adventureName = data2.adventureName;

                    embed = new EmbedBuilder()
                        .setColor(0x00FFFF)
                        .addFields([
                            {
                                "name": `Explorer Club:`,
                                "value": `[<${adventureName}>](https://dfo.gg/explorer-club/${adventureName})`,
                                "inline": true
                            },
                            {
                                "name": `Character:`,
                                "value": `[${characterName}](https://dfo.gg/character/${server}/${characterName})`,
                                "inline": true
                            },
                            {
                                "name": `Server:`,
                                "value": `${server==='cain' ? 'Cain' : 'Sirocco' }`,
                                "inline": true
                            },
                            {
                                "name": `Active Skills:`,
                                "value": `${activeSkills}`,
                                "inline": true
                            },
                            {
                                "name": `Passive Skills:`,
                                "value": `${passiveSkills}`,
                                "inline": true
                            }
                        ])
                        .setFooter({
                            "text": `NOTE: Skill enhancements through items and equipment are excluded.\nCharacter id: ${characterId}\nJoin discord.me/marbas for support\nPowered by Neople OpenAPI`
                        })
                        
                    

                         try{
                            await interaction.editReply({embeds: [embed]});
                         }
                         catch(err){
                         console.log(err);
                         return;
                         }
                         
                })
                .catch(async err => {
                    embed = new EmbedBuilder()
                        .setTitle(`${err}`)
                        .setColor(0xFF0000)
                    await interaction.editReply({embeds: [embed]});
                    return;
                });
            })
            .catch(async err => {
                embed = new EmbedBuilder()
                    .setTitle(`${err}`)
                    .setColor(0xFF0000)
                await interaction.editReply({embeds: [embed]});
                return;
            });


        
        return;
    },
};