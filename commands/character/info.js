const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about a character')
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
        let level = 0;
        let jobGrowName = '';
        let fame = 0;
        let guildName = '';
        let embed = {};
        let rank = 0;
        let maxFame = 90000;
        let found = false;
        let allRank = 0;
        let allMaxFame = 90000;
        let allFound = false;
        fetch(`https://api.dfoneople.com/df/servers/${server}/characters?&apikey=${API_KEY}&characterName=${ign}&wordType=match`)
            .then(res => res.json())
            .then(async data => {
                if(data.error){
                    throw Error(`${data.error.status} - ${data.error.code} [${data.error.message}]`)
                }
                if(!data.rows[0]) return interaction.editReply("That character doesn't exist... yet.");
                characterId = data.rows[0].characterId,
                characterName = data.rows[0].characterName,
                level = data.rows[0].level,
                jobGrowName = data.rows[0].jobGrowName,
                fame = data.rows[0].fame
                if(fame==null){
                    found = true;
                    allFound = true;
                    rank = 'N/A'
                    allRank = 'N/A'
                }

                while (!found) {
                    await fetch(`https://api.dfoneople.com/df/servers/${server}/characters-fame?maxFame=${maxFame}&jobId=${data.rows[0].jobId}&jobGrowId=${data.rows[0].jobGrowId}&limit=200&apikey=${API_KEY}`)
                    .then(res => {
                    if (res.ok){
                        //console.log(res);
                        return res.json();
                    } else {
                        console.error(res.status, res.statusText);
                        throw Error(`${res.status} - ${res.statusText}`);
                    }
                    })
                    .then(async data2 => {
                        console.log(data2);
                        if(data2.rows<1){
                            maxFame-=10000;
                        } else {
                            if (fame < data2.rows[data2.rows.length-1].fame){
                                rank+=data2.rows.length;
                                maxFame = data2.rows[data2.rows.length-1].fame;
                            } else {
                                for(i=0;i<data2.rows.length;i++){
                                    rank++;
                                    if(data2.rows[i].characterId == characterId){
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found){
                                    maxFame = data2.rows[data2.rows.length-1].fame;
                                    rank--;
                                }
                            }
                        }
                    })
                }

                while (!allFound) {
                    await fetch(`https://api.dfoneople.com/df/servers/${server}/characters-fame?maxFame=${allMaxFame}&limit=200&apikey=${API_KEY}`)
                    .then(res => {
                    if (res.ok){
                        //console.log(res);
                        return res.json();
                    } else {
                        console.error(res.status, res.statusText);
                        throw Error(`${res.status} - ${res.statusText}`);
                    }
                    })
                    .then(async data2 => {
                        if (fame < data2.rows[data2.rows.length-1].fame){
                            allRank+=data2.rows.length;
                            allMaxFame = data2.rows[data2.rows.length-1].fame;
                            if (allRank >= 10000){
                                allFound = true;
                                allRank = ">10000"
                            }
                        } else {
                        for(i=0;i<data2.rows.length;i++){
                            allRank++;
                            if(data2.rows[i].characterId == characterId){
                                allFound = true;
                                break;
                            }
                        }
                        if(!allFound){
                            allMaxFame = data2.rows[data2.rows.length-1].fame;
                            allRank--;
                        }
                    }
                    })
                }
                
                fetch(`https://api.dfoneople.com/df/servers/${server}/characters/${characterId}?apikey=${API_KEY}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    adventureName = data2.adventureName,
                    guildName = data2.guildName,
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
                                    "name": `Level:`,
                                    "value": `${level}`,
                                    "inline": true
                                },
                                {
                                    "name": `Advancement:`,
                                    "value": `${jobGrowName}`,
                                    "inline": true
                                },
                                {
                                    "name": `Fame:`,
                                    "value": `${fame}`,
                                    "inline": true
                                },
                                {
                                    "name": `Guild:`,
                                    "value": `${guildName}`,
                                    "inline": true
                                },
                                {
                                    "name": `Overall Ranking:`,
                                    "value": `${allRank}`,
                                    "inline": true
                                },
                                {
                                    "name": `Class Ranking:`,
                                    "value": `${rank}`,
                                    "inline": true
                                }])
                        .setFooter({
                            "text": `Character id: ${characterId}\nJoin discord.me/marbas for support\nPowered by Neople OpenAPI`
                        })
                          
                        try{
                            await interaction.editReply({embeds: [embed]});
                         } catch(err) {
                            console.log(err);
                            return;
                          }
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