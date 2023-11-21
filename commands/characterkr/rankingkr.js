const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY_KR} = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rankingkr')
    .setDescription('Get top fame rankings')
    .addStringOption(option => option.setName('server')
        .setDescription('Search Server')
        .setRequired(true)
        .addChoices(
            {name: 'All', value: 'all'},
            {name: '카인/Cain', value: 'cain'},
            {name: '디레지에/Diregie', value: 'diregie'},
            {name: '시로코/Sirocco', value: 'siroco'},
            {name: '프레이/Prey', value: 'prey'},
            {name: '카시야스/Casillas', value: 'casillas'},
            {name: '힐더/Hilder', value: 'hilder'},
            {name: '안톤/Anton', value: 'anton'},
            {name: '바칼/Bakal', value: 'bakal'}
        ))
    .addIntegerOption(option => option.setName('top')
        .setDescription('Show top n characters, max 60')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(60)
        )
    .addStringOption(option => option.setName('class')
        .setDescription('Search Base Class')
        .addChoices(
            {name: 'Slayer (M)', value: '41f1cdc2ff58bb5fdc287be0db2a8df3'},
            {name: 'Slayer (F)', value: '1645c45aabb008c98406b3a16447040d'},
            {name: 'Fighter (M)', value: 'ca0f0e0e9e1d55b5f9955b03d9dd213c'},
            {name: 'Fighter (F)', value: 'a7a059ebe9e6054c0644b40ef316d6e9'},
            {name: 'Gunner (M)', value: 'afdf3b989339de478e85b614d274d1ef'},
            {name: 'Gunner (F)', value: '944b9aab492c15a8474f96947ceeb9e4'},
            {name: 'Mage (M)', value: 'a5ccbaf5538981c6ef99b236c0a60b73'},
            {name: 'Mage (F)', value: '3909d0b188e9c95311399f776e331da5'},
            {name: 'Priest (M)', value: 'f6a4ad30555b99b499c07835f87ce522'},
            {name: 'Priest (F)', value: '0c1b401bb09241570d364420b3ba3fd7'},
            {name: 'Thief', value: 'ddc49e9ad1ff72a00b53c6cff5b1e920'},
            {name: 'Knight', value: '0ee8fa5dc525c1a1f23fc6911e921e4a'},
            {name: 'Demonic Lancer', value: '3deb7be5f01953ac8b1ecaa1e25e0420'},
            {name: 'Agent', value: '986c2b3d72ee0e4a0b7fcfbe786d4e02'},
            {name: 'Archer', value: 'b9cb48777665de22c006fabaf9a560b3'},
            {name: 'Neo: Dark Knight', value: '17e417b31686389eebff6d754c3401ea'},
            {name: 'Neo: Creator', value: 'b522a95d819a5559b775deb9a490e49a'}
        ))
    .addIntegerOption(option => option.setName('subclass')
        .setDescription('Search Subclass #')
        .addChoices(
            {name: '1 (Blade Master/Sword Master/Nen Master/Ranger/Elemental Bomber/etc.)', value: 1},
            {name: '2 (Soul Bender/Dark Templar/Striker/Launcher/Glacial Master/etc.)', value: 2},
            {name: '3 (Berserker/Demon Slayer/Brawler/Mechanic/Blood Mage/etc.)', value: 3},
            {name: '4 (Asura/Vagabond/Grappler/Spitfire/Swift Master/etc.)', value: 4},
            {name: '5 (Ghostblade/Spectre/Blitz/Dimension Walker/Enchantress)', value: 5},
            {name: '6 (Base)', value: 6}
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
        if (['41f1cdc2ff58bb5fdc287be0db2a8df3','08cf6465c8dfcdbf5a896b40a2811007','374f82bfb1c054cde79431cf4420a35c','3c67a7b71273c8452c9f68adb4004215','fc067d0781f1d01ef8f0b215440bac6d'].indexOf(jobId) >= 0){
        switch (jobGrowID){
            case 1:
                jobGrowID = '37495b941da3b1661bc900e68ef3b2c6';
                break;
            case 2:
                jobGrowID = '618326026de1a1f1cfba5dbd0b8396e7';
                break;
            case 3:
                jobGrowID = '6d459bc74ba73ee4fe5cdc4655400193';
                break;
            case 4:
                jobGrowID = 'c9b492038ee3ca8d27d7004cf58d59f3';
                break;
            case 5:
                jobGrowID = '92da05ec93fb43406e193ffb9a2a629b';
                break;
            case 6:
                jobGrowID = '1ea40db11ff66e70bcb0add7fae44cdb';
                break;
            default:
                jobGrowID = '';
                break;
            }
        } else if(jobId==='dbbdf2dd28072b26f22b77454d665f21'){
            switch (jobGrowID){
                case 1:
                    jobGrowID = '37495b941da3b1661bc900e68ef3b2c6';
                    break;
                case 2:
                    jobGrowID = '618326026de1a1f1cfba5dbd0b8396e7';
                    break;
                default:
                    jobGrowID = '';
                    break;
            }            
        } else {
            switch (jobGrowID){
                case 1:
                    jobGrowID = '37495b941da3b1661bc900e68ef3b2c6';
                    break;
                case 2:
                    jobGrowID = '618326026de1a1f1cfba5dbd0b8396e7';
                    break;
                case 3:
                    jobGrowID = '6d459bc74ba73ee4fe5cdc4655400193';
                    break;
                case 4:
                    jobGrowID = 'c9b492038ee3ca8d27d7004cf58d59f3';
                    break;
                case 6:
                    jobGrowID = '1ea40db11ff66e70bcb0add7fae44cdb';
                    break;
                default:
                    jobGrowID = '';
                    break;
                }
        }
        if (['17e417b31686389eebff6d754c3401ea','b522a95d819a5559b775deb9a490e49a'].indexOf(jobId) >= 0 ){
            jobGrowID = '0a49d9c8b5e1358efff324e5cb11d41e';
        }
        let embed = {};
        fetch(`https://api.neople.co.kr/df/servers/${server}/characters-fame?${jobId?'jobId='+jobId+'&':''}${jobGrowID?'jobGrowId='+jobGrowID+'&':''}isBuff=${isbuff}&limit=${num}&apikey=${API_KEY_KR}`)
            .then(res => res.json())
            .then(async data => {
                if(data.error){
                    throw Error(`${data.error.status} - ${data.error.code} [${data.error.message}]`)
                }
                    embed = new EmbedBuilder()
                    .setTitle(`Top ${num} ${jobGrowID?data.rows[0].jobGrowName:jobId?data.rows[0].jobName:'Characters'} by Fame`)
                    .setColor(0x00FFFF)
                    .setFooter({
                        "text": `Join discord.me/marbas for support\nPowered by Neople OpenAPI`
                    })
                    
                    for(i=0; i<Math.ceil(data.rows.length/10); i++){
                        let rows="";
                        for(j=0; j<Math.min(10,data.rows.length-i*10); j++){
                            let character = `${data.rows[i*10+j].fame}: [${data.rows[i*10+j].characterName}](https://dundam.xyz/character?server=${data.rows[i*10+j].serverId}&key=${data.rows[i*10+j].characterId})\n`
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