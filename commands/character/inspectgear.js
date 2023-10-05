const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inspectgear')
    .setDescription('Quick check gear equipped on a character')
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
        const canvas = Canvas.createCanvas(120,90);
        const ctx = canvas.getContext('2d');
        let wepImg = new Canvas.Image();
        let topImg = new Canvas.Image();
        let shoulderImg = new Canvas.Image();
        let beltImg = new Canvas.Image();
        let pantsImg = new Canvas.Image();
        let shoesImg = new Canvas.Image();
        let braceImg = new Canvas.Image();
        let neckImg =new Canvas.Image();
        let ringImg = new Canvas.Image();
        let subImg =new Canvas.Image();
        let stoneImg =new Canvas.Image();
        let earImg = new Canvas.Image();
        let attachment = new AttachmentBuilder();
        let adventureName = '';
        let characterId = '';
        let characterName = '';
        let jobGrowName = '';
        let fame = 0;
        let embed = {};
        fetch(`https://api.dfoneople.com/df/servers/${server}/characters?&apikey=${API_KEY}&characterName=${ign}&wordType=match`)
            .then(res => {
                if (res.ok){
                    return res.json();
                } else {
                    console.error(res.status, res.statusText);
                    throw Error(`${res.status} - ${res.statusText}`);
                }
            })
            .then(data => {
                if(!data.rows[0]) return interaction.editReply("That character doesn't exist... yet.");
                characterId = data.rows[0].characterId,
                characterName = data.rows[0].characterName,
                jobGrowName = data.rows[0].jobGrowName,
                fame = data.rows[0].fame,
                fetch(`https://api.dfoneople.com/df/servers/${server}/characters/${characterId}/equip/equipment?apikey=${API_KEY}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    if(data2.equipment.length<13) return interaction.editReply("Missing equipment in slots");
                    adventureName = data2.adventureName,
                    wepImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[0].itemId}`),
                    topImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[2].itemId}`),
                    shoulderImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[3].itemId}`),
                    beltImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[6].itemId}`),
                    pantsImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[4].itemId}`),
                    shoesImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[5].itemId}`),
                    braceImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[8].itemId}`),
                    neckImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[7].itemId}`),
                    ringImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[9].itemId}`),
                    subImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[10].itemId}`),
                    stoneImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[11].itemId}`),
                    earImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[12].itemId}`),
                    ctx.drawImage(shoulderImg, 0, 0),
                    ctx.drawImage(topImg, 30, 0),
                    ctx.drawImage(wepImg,90,0),
                    ctx.drawImage(beltImg,30,30),
                    ctx.drawImage(pantsImg,0,30),
                    ctx.drawImage(shoesImg,0,60),
                    ctx.drawImage(braceImg,60,0),
                    ctx.drawImage(neckImg,60,30),
                    ctx.drawImage(ringImg,90,30),
                    ctx.drawImage(subImg,30,60),
                    ctx.drawImage(stoneImg,60,60),
                    ctx.drawImage(earImg,90,60),
                    attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'inspect-gear.png' }),
                    embed = new EmbedBuilder()
                        .setTitle(`Explorer Club\n<${adventureName}>`)
                        .setColor(0x00FFFF)
                        .addFields([
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
                                "name": `Advancement:`,
                                "value": `${jobGrowName}`,
                                "inline": true
                            },
                            {
                                "name": `Fame:`,
                                "value": `${fame}`,
                                "inline": true
                            }
                        ])
                        .setFooter({
                            "text": `Character id: ${characterId}\nJoin discord.me/marbas for support\nPowered by Neople OpenAPI`
                        })
                    


                         try{
                            await interaction.editReply({embeds: [embed], files: [attachment] });
                         }
                         catch(err){
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