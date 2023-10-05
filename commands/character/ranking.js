const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Get top fame rankings')
    .addStringOption(option => option.setName('server')
        .setDescription('Search Server')
        .setRequired(true)
        .addChoices(
            {name: 'All', value: 'all'},
            {name: 'Cain', value: 'cain'},
            {name: 'Sirocco', value: 'siroco'},
        ))
    .addIntegerOption(option => option.setName('top')
        .setDescription('Show top n characters, max 200')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(200)
        )
    .addStringOption(option => option.setName('class')
        .setDescription('Search Base Class')
        .addChoices(
            {name: 'Slayer (M)', value: '40132cbc8b2b5eedfe035e35c322472e'},
            {name: 'Slayer (F)', value: '08cf6465c8dfcdbf5a896b40a2811007'},
            {name: 'Fighter (M)', value: 'cb572073a5db60ca7f245363a79d1f22'},
            {name: 'Fighter (F)', value: '18ccc1f38ad764c77ec52dbaefce0c2e'},
            {name: 'Gunner (M)', value: '374f82bfb1c054cde79431cf4420a35c'},
            {name: 'Gunner (F)', value: '8b680595b273a488997441eee3f7176f'},
            {name: 'Mage (M)', value: '3c67a7b71273c8452c9f68adb4004215'},
            {name: 'Mage (F)', value: 'fc067d0781f1d01ef8f0b215440bac6d'},
            {name: 'Priest (M)', value: '92d1c40f5e486e3aa4fae8db283d1fd3'},
            {name: 'Priest (F)', value: '2ae47d662a9b18848c5e314966765bd7'},
            {name: 'Thief', value: '402e7bc8074a3dcd7797da85a9f7386e'},
            {name: 'Knight', value: 'c21b43973c6d3fd9f192e9b66925c9b9'},
            {name: 'Demonic Lancer', value: '0b2b0ac15e70d4fc9f4094b9a90937a6'},
            {name: 'Agent', value: '86c10841b1e4ddc6db7bd2fbe5e11519'},
            {name: 'Archer', value: 'dbbdf2dd28072b26f22b77454d665f21'},
            {name: 'Neo: Dark Knight', value: '4b3bc88bb6337d2e23ed3411b2435068'},
            {name: 'Neo: Creator', value: 'c95dfe0d42b6c71bc8019fcca0b3eccd'}
        ))
    .addIntegerOption(option => option.setName('subclass')
        .setDescription('Search Subclass #')
        .addChoices(
            {name: '1 (Blade Master/Sword Master/Nen Master/Ranger/Elemental Bomber/etc.)', value: 1},
            {name: '2 (Soul Bender/Dark Templar/Striker/Launcher/Glacial Master/etc.)', value: 2},
            {name: '3 (Berserker/Demon Slayer/Brawler/Mechanic/Blood Mage/etc.)', value: 3},
            {name: '4 (Asura/Vagabond/Grappler/Spitfire/Swift Master/etc.)', value: 4},
            {name: '5 (Ghostblade/Spectre/Blitz/Dimension Walker/Enchantress)', value: 5}
        ))
    .addBooleanOption(option => option.setName('isbuff')
        .setDescription('Search for Buffer only (true), Search for DPS only (false), Search for ALL (no input)')
        ),
    async execute(interaction) {
        const server = interaction.options.getString('server');
        const num = interaction.options.getInteger('top');
        const isbuff = interaction.options.getBoolean('isbuff');
        let jobId = interaction.options.getString('class') ? interaction.options.getString('class') : ``;
        let jobGrowID = interaction.options.getString('class') ? interaction.options.getInteger('subclass') ? interaction.options.getInteger('subclass') : `` : ``;
        if (['40132cbc8b2b5eedfe035e35c322472e','08cf6465c8dfcdbf5a896b40a2811007','374f82bfb1c054cde79431cf4420a35c','3c67a7b71273c8452c9f68adb4004215','fc067d0781f1d01ef8f0b215440bac6d'].indexOf(jobId) >= 0){
        switch (jobGrowID){
            case 1:
                jobGrowID = 'ba2ae3598c3af10c26562e073bc92060';
                break;
            case 2:
                jobGrowID = '53632e641719388657407af4f9c063ac';
                break;
            case 3:
                jobGrowID = '0f12d512a825d52e75d87120f39ba4cb';
                break;
            case 4:
                jobGrowID = 'ec6a93f4d14bb36ccc541183291197a7';
                break;
            case 5:
                jobGrowID = '5dff544828c42d8fc109f2f747d50c7f';
                break;
            default:
                jobGrowID = '';
                break;
            }
        } else if(jobId==='dbbdf2dd28072b26f22b77454d665f21'){
            switch (jobGrowID){
                case 1:
                    jobGrowID = 'ba2ae3598c3af10c26562e073bc92060';
                    break;
                case 2:
                    jobGrowID = '53632e641719388657407af4f9c063ac';
                    break;
                default:
                    jobGrowID = '';
                    break;
            }            
        } else {
            switch (jobGrowID){
                case 1:
                    jobGrowID = 'ba2ae3598c3af10c26562e073bc92060';
                    break;
                case 2:
                    jobGrowID = '53632e641719388657407af4f9c063ac';
                    break;
                case 3:
                    jobGrowID = '0f12d512a825d52e75d87120f39ba4cb';
                    break;
                case 4:
                    jobGrowID = 'ec6a93f4d14bb36ccc541183291197a7';
                    break;
                default:
                    jobGrowID = '';
                    break;
                }
        }
        if (['4b3bc88bb6337d2e23ed3411b2435068','c95dfe0d42b6c71bc8019fcca0b3eccd'].indexOf(jobId) >= 0 ){
            jobGrowID = '632b3965398c1c7526657cea3fd16bf5';
        }
        let embed = {};
        fetch(`https://api.dfoneople.com/df/servers/${server}/characters-fame?${jobId?'jobId='+jobId+'&':''}${jobGrowID?'jobGrowId='+jobGrowID+'&':''}isBuff=${isbuff}&limit=${num}&apikey=${API_KEY}`)
            .then(res => {
                if (res.ok){
                    return res.json();
                } else {
                    console.error(res.status, res.statusText);
                    throw Error(`${res.status} - ${res.statusText}`);
                }
            })
            .then(async data => {
                    embed = new EmbedBuilder()
                    .setTitle(`Top ${num} ${jobGrowID?data.rows[0].jobGrowName:jobId?data.rows[0].jobName:'Characters'}`)
                    .setColor(0x00FFFF)
                    .setFooter({
                        "text": `Join discord.me/marbas for support`
                    })
                    
                    for(i=0; i<Math.ceil(data.rows.length/10); i++){
                        let rows="";
                        for(j=0; j<Math.min(10,data.rows.length-i*10); j++){
                            let character = `${data.rows[i*10+j].fame} - [${data.rows[i*10+j].characterName}](https://dfo.gg/character/${data.rows[i*10+j].serverId}/${data.rows[i*10+j].characterName})\n`
                            rows = rows.concat(character);
                        }
                    embed.addFields([
                        {
                            "name": `#${1+i*10}-${Math.min(10,data.rows.length-i*10)+i*10}`,
                            "value": `${rows}`,
                            "inline": true
                        }
                    ])
                }
                

                          try{
                            await interaction.editReply({embeds: [embed]});
                          } catch(err) {
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


        
        return;
    },
};