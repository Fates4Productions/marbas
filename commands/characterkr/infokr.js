const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY_KR} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('infokr')
    .setDescription('Get information about a character')
    .addStringOption(option => option.setName('ign')
        .setDescription('Character to look up.')
        .setRequired(true))
    .addStringOption(option => option.setName('server')
        .setDescription('Search Server')
        .setRequired(true)
        .addChoices(
            {name: '카인/Cain', value: 'cain'},
            {name: '디레지에/Diregie', value: 'diregie'},
            {name: '시로코/Sirocco', value: 'siroco'},
            {name: '프레이/Prey', value: 'prey'},
            {name: '카시야스/Casillas', value: 'casillas'},
            {name: '힐더/Hilder', value: 'hilder'},
            {name: '안톤/Anton', value: 'anton'},
            {name: '바칼/Bakal', value: 'bakal'}
        )),
    async execute(interaction) {
        const ign = interaction.options.getString('ign');
        const server = interaction.options.getString('server');
        const characterCanvas = Canvas.createCanvas(200,230);
        const characterCtx = characterCanvas.getContext('2d');
        let adventureImg = new Canvas.Image();
        let adventureName = '';
        let characterId = '';
        let characterName = '';
        let level = 0;
        let jobGrowName = '';
        let fame = 0;
        let guildName = '';
        let embed = {};
        let rank = 0;
        let maxFame = 999999;
        let found = false;
        let allRank = 0;
        let allMaxFame = 999999;
        let allFound = false;
        fetch(`https://api.neople.co.kr/df/servers/${server}/characters?&apikey=${API_KEY_KR}&characterName=${ign}&wordType=match`)
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
                    await fetch(`https://api.neople.co.kr/df/servers/${server}/characters-fame?maxFame=${maxFame}&jobId=${data.rows[0].jobId}&jobGrowId=${data.rows[0].jobGrowId}&limit=200&apikey=${API_KEY_KR}`)
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
                        if (fame < data2.rows[199].fame){
                            rank+=200;
                            maxFame = data2.rows[199].fame;
                        } else {
                        for(i=0;i<data2.rows.length;i++){
                            rank++;
                            if(data2.rows[i].characterId == characterId){
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            maxFame = data2.rows[199].fame;
                            rank--;
                        }
                    }
                    })
                }

                while (!allFound) {
                    await fetch(`https://api.neople.co.kr/df/servers/${server}/characters-fame?maxFame=${allMaxFame}&limit=200&apikey=${API_KEY_KR}`)
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
                        if (fame < data2.rows[199].fame){
                            allRank+=200;
                            allMaxFame = data2.rows[199].fame;
                            if (allRank >= 3000){
                                allFound = true;
                                allRank = ">3000"
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
                            allMaxFame = data2.rows[199].fame;
                            allRank--;
                        }
                    }
                    })
                }

                
                fetch(`https://api.neople.co.kr/df/servers/${server}/characters/${characterId}?apikey=${API_KEY_KR}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    adventureName = data2.adventureName,
                    guildName = data2.guildName,
                    adventureImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/servers/${server}/characters/${characterId}`);
                    characterCtx.drawImage(adventureImg, 0, 0),
                    characterAttachment = new AttachmentBuilder(await characterCanvas.encode('png'), { name: 'character.png' }),

                    embed = new EmbedBuilder()
                        .setColor(0x00FFFF)
                        .addFields([
                                {
                                "name": `Explorer Club:`,
                                "value": `[<${adventureName}>](https://dundam.xyz/search?server=adven&name=${adventureName})`,
                                "inline": true
                                },
                                {
                                    "name": `Character:`,
                                    "value": `[${characterName}](https://dundam.xyz/character?server=${server}&key=${characterId})`,
                                    "inline": true
                                },
                                {
                                    "name": `Server:`,
                                    "value": `${server==='cain' ? '카인/Cain' : server==='diregie' ? '디레지에/Diregie' : server==='siroco' ? '시로코/Sirocco' : server==='prey' ? '프레이/Prey' : server==='casillas' ? '카시야스/Casillas' : server==='hilder' ? '힐더/Hilder' : server==='anton' ? '안톤/Anton' : '바칼/Bakal'}`,
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
                            await interaction.editReply({embeds: [embed], files: [characterAttachment] });
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