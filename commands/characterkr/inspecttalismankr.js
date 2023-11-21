const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY_KR} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inspecttalismankr')
    .setDescription('Check talismans on a character')
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
        const canvas = Canvas.createCanvas(120,90);
        const ctx = canvas.getContext('2d');
        let talis = new Canvas.Image();
        let rune = new Canvas.Image();
        let attachment = new AttachmentBuilder();
        const characterCanvas = Canvas.createCanvas(200,230);
        const characterCtx = characterCanvas.getContext('2d');
        let adventureImg = new Canvas.Image();
        let characterAttachment = new AttachmentBuilder();
        let adventureName = '';
        let characterId = '';
        let characterName = '';
        let jobGrowName = '';
        let embed = {};
        fetch(`https://api.neople.co.kr/df/servers/${server}/characters?&apikey=${API_KEY_KR}&characterName=${ign}&wordType=match`)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    throw Error(`${data.error.status} - ${data.error.code} [${data.error.message}]`)
                }
                if(!data.rows[0]) return interaction.editReply("That character doesn't exist... yet.");
                characterId = data.rows[0].characterId,
                characterName = data.rows[0].characterName,
                jobGrowName = data.rows[0].jobGrowName,
                fetch(`https://api.neople.co.kr/df/servers/${server}/characters/${characterId}/equip/talisman?apikey=${API_KEY_KR}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    if(data2.error){
                        throw Error(`${data2.error.status} - ${data2.error.code} [${data2.error.message}]`)
                    }
                    if(data2.talismans === null) return interaction.editReply("No talismans equipped");
                    adventureName = data2.adventureName;
                    for(i = 0; i < data2.talismans.length; i++){
                        talis = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.talismans[i].talisman.itemId}`);
                        ctx.drawImage(talis,0,i*30);
                        for (j = 0; j < data2.talismans[i].runes.length; j++){
                            rune = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.talismans[i].runes[j].itemId}`);
                            ctx.drawImage(rune,j*30+30,i*30);
                        }
                    }

                    //attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'inspect-talisman.png' }),
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
                                "name": `Advancement:`,
                                "value": `${jobGrowName}`,
                                "inline": true
                            }
                        ])
                        .setFooter({
                            "text": `Character id: ${characterId}\nJoin discord.me/marbas for support\nPowered by Neople OpenAPI`
                        })
                    
                    for (i = 0; i < data2.talismans.length; i++){
                    embed.addFields([
                        {
                            "name": `${data2.talismans[i].talisman.itemName}`,
                            "value": `${data2.talismans[i].runes[0]?data2.talismans[i].runes[0].itemName+'\n':'No runes.'}${data2.talismans[i].runes[1]?data2.talismans[i].runes[1].itemName+'\n':''}${data2.talismans[i].runes[2]?data2.talismans[i].runes[2].itemName:''}`,
                            "inline": false
                        }
                    ])}
                    

                         try{
                            await interaction.editReply({embeds: [embed], files: [characterAttachment] });
                            //await interaction.editReply({embeds: [embed]});
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