const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inspectdetailed')
    .setDescription('Check gear details on a character')
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
            .then(res => res.json())
            .catch(err=>{console.log(err)})
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
                    if(data2.equipment[0].growInfo == null || data2.equipment[2].growInfo == null || data2.equipment[3].growInfo == null || data2.equipment[6].growInfo == null || data2.equipment[4].growInfo == null || data2.equipment[5].growInfo == null || data2.equipment[8].growInfo == null || data2.equipment[7].growInfo == null || data2.equipment[9].growInfo == null || data2.equipment[10].growInfo == null || data2.equipment[11].growInfo == null || data2.equipment[12].growInfo == null) return interaction.editReply("Level 105 Epic/Legendary equipment missing in some slots");
                    adventureName = data2.adventureName;
                    if(data2.equipment[0].upgradeInfo != null) 
                        wepImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[0].upgradeInfo.itemId}`);
                    else
                        wepImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[0].itemId}`);
                    if(data2.equipment[2].upgradeInfo != null)
                        topImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[2].upgradeInfo.itemId}`);
                    else
                        topImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[2].itemId}`);
                    if(data2.equipment[3].upgradeInfo != null)
                        shoulderImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[3].upgradeInfo.itemId}`);
                    else
                        shoulderImg = await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[3].itemId}`);
                    if(data2.equipment[6].upgradeInfo != null)
                        beltImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[6].upgradeInfo.itemId}`);
                    else
                        beltImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[6].itemId}`);
                    if(data2.equipment[4].upgradeInfo != null)
                        pantsImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[4].upgradeInfo.itemId}`);
                    else
                        pantsImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[4].itemId}`);
                    if(data2.equipment[5].upgradeInfo != null)
                        shoesImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[5].upgradeInfo.itemId}`);
                    else
                        shoesImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[5].itemId}`);
                    if(data2.equipment[8].upgradeInfo != null)
                    braceImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[8].upgradeInfo.itemId}`);
                    else
                    braceImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[8].itemId}`);
                    if(data2.equipment[7].upgradeInfo != null)
                    neckImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[7].upgradeInfo.itemId}`);
                    else
                    neckImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[7].itemId}`);
                    if(data2.equipment[9].upgradeInfo != null)
                    ringImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[9].upgradeInfo.itemId}`);
                    else
                    ringImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[9].itemId}`);
                    if(data2.equipment[10].upgradeInfo != null)
                    subImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[10].upgradeInfo.itemId}`);
                    else
                    subImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[10].itemId}`);
                    if(data2.equipment[11].upgradeInfo != null)
                    stoneImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[11].upgradeInfo.itemId}`);
                    else
                    stoneImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[11].itemId}`);
                    if(data2.equipment[12].upgradeInfo != null)
                    earImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[12].upgradeInfo.itemId}`);
                    else
                    earImg= await Canvas.loadImage(`https://img-api.dfoneople.com/df/items/${data2.equipment[12].itemId}`);

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

                    //console.log(data2.equipment),

                    attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'inspect-gear.png' }),
                    embed = new EmbedBuilder()
                        .setTitle(`Explorer Club\n<${adventureName}>`)
                        .setColor(0x00FFFF)
                        .addFields([
                            {
                                "name": `Character:`,
                                "value": `${characterName}`,
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
                            },
                            {
                                "name": `Weapon:`,
                                "value": `+${data2.equipment[0].reinforce}${data2.equipment[0].amplificationName?'['+data2.equipment[0].amplificationName.slice(-3)+']':''}(${data2.equipment[0].refine}) ${data2.equipment[0].itemName} (${data2.equipment[0].growInfo.options[0].level}/${data2.equipment[0].growInfo.options[1].level}/${data2.equipment[0].growInfo.options[2].level}/${data2.equipment[0].growInfo.options[3].level}=${data2.equipment[0].growInfo.total.level})`,
                                "inline": false
                            },
                            {
                                "name": `Armour:`,
                                "value": `${data2.equipment[2].slotName}: +${data2.equipment[2].reinforce}${data2.equipment[2].amplificationName?'['+data2.equipment[2].amplificationName.slice(-3)+']':''} ${data2.equipment[2].itemName} (${data2.equipment[2].growInfo.options[0].level}/${data2.equipment[2].growInfo.options[1].level}/${data2.equipment[2].growInfo.options[2].level}/${data2.equipment[2].growInfo.options[3].level}=${data2.equipment[2].growInfo.total.level})\n${data2.equipment[4].slotName}: +${data2.equipment[4].reinforce}${data2.equipment[4].amplificationName?'['+data2.equipment[4].amplificationName.slice(-3)+']':''} ${data2.equipment[4].itemName} (${data2.equipment[4].growInfo.options[0].level}/${data2.equipment[4].growInfo.options[1].level}/${data2.equipment[4].growInfo.options[2].level}/${data2.equipment[4].growInfo.options[3].level}=${data2.equipment[4].growInfo.total.level})\n${data2.equipment[3].slotName}: +${data2.equipment[3].reinforce}${data2.equipment[3].amplificationName?'['+data2.equipment[3].amplificationName.slice(-3)+']':''} ${data2.equipment[3].itemName} (${data2.equipment[3].growInfo.options[0].level}/${data2.equipment[3].growInfo.options[1].level}/${data2.equipment[3].growInfo.options[2].level}/${data2.equipment[3].growInfo.options[3].level}=${data2.equipment[3].growInfo.total.level})\n${data2.equipment[6].slotName}: +${data2.equipment[6].reinforce}${data2.equipment[6].amplificationName?'['+data2.equipment[6].amplificationName.slice(-3)+']':''} ${data2.equipment[6].itemName} (${data2.equipment[6].growInfo.options[0].level}/${data2.equipment[6].growInfo.options[1].level}/${data2.equipment[6].growInfo.options[2].level}/${data2.equipment[6].growInfo.options[3].level}=${data2.equipment[6].growInfo.total.level})\n${data2.equipment[5].slotName}: +${data2.equipment[5].reinforce}${data2.equipment[5].amplificationName?'['+data2.equipment[5].amplificationName.slice(-3)+']':''} ${data2.equipment[5].itemName} (${data2.equipment[5].growInfo.options[0].level}/${data2.equipment[5].growInfo.options[1].level}/${data2.equipment[5].growInfo.options[2].level}/${data2.equipment[5].growInfo.options[3].level}=${data2.equipment[5].growInfo.total.level})`,
                                "inline": false
                            },
                            {
                                "name": `Accessory:`,
                                "value": `${data2.equipment[7].slotName}: +${data2.equipment[7].reinforce}${data2.equipment[7].amplificationName?'['+data2.equipment[7].amplificationName.slice(-3)+']':''} ${data2.equipment[7].itemName} (${data2.equipment[7].growInfo.options[0].level}/${data2.equipment[7].growInfo.options[1].level}/${data2.equipment[7].growInfo.options[2].level}/${data2.equipment[7].growInfo.options[3].level}=${data2.equipment[7].growInfo.total.level})\n${data2.equipment[8].slotName}: +${data2.equipment[8].reinforce}${data2.equipment[8].amplificationName?'['+data2.equipment[8].amplificationName.slice(-3)+']':''} ${data2.equipment[8].itemName} (${data2.equipment[8].growInfo.options[0].level}/${data2.equipment[8].growInfo.options[1].level}/${data2.equipment[8].growInfo.options[2].level}/${data2.equipment[8].growInfo.options[3].level}=${data2.equipment[8].growInfo.total.level})\n${data2.equipment[9].slotName}: +${data2.equipment[9].reinforce}${data2.equipment[9].amplificationName?'['+data2.equipment[9].amplificationName.slice(-3)+']':''} ${data2.equipment[9].itemName} (${data2.equipment[9].growInfo.options[0].level}/${data2.equipment[9].growInfo.options[1].level}/${data2.equipment[9].growInfo.options[2].level}/${data2.equipment[9].growInfo.options[3].level}=${data2.equipment[9].growInfo.total.level})`,
                                "inline": false
                            },
                            {
                                "name": `Special Equipment:`,
                                "value": `${data2.equipment[10].slotName}: +${data2.equipment[10].reinforce}${data2.equipment[10].amplificationName?'['+data2.equipment[10].amplificationName.slice(-3)+']':''} ${data2.equipment[10].itemName} (${data2.equipment[10].growInfo.options[0].level}/${data2.equipment[10].growInfo.options[1].level}/${data2.equipment[10].growInfo.options[2].level}/${data2.equipment[10].growInfo.options[3].level}=${data2.equipment[10].growInfo.total.level})\n${data2.equipment[12].slotName}: +${data2.equipment[12].reinforce}${data2.equipment[12].amplificationName?'['+data2.equipment[12].amplificationName.slice(-3)+']':''} ${data2.equipment[12].itemName} (${data2.equipment[12].growInfo.options[0].level}/${data2.equipment[12].growInfo.options[1].level}/${data2.equipment[12].growInfo.options[2].level}/${data2.equipment[12].growInfo.options[3].level}=${data2.equipment[12].growInfo.total.level})\n${data2.equipment[11].slotName}: +${data2.equipment[11].reinforce}${data2.equipment[11].amplificationName?'['+data2.equipment[11].amplificationName.slice(-3)+']':''} ${data2.equipment[11].itemName} (${data2.equipment[11].growInfo.options[0].level}/${data2.equipment[11].growInfo.options[1].level}/${data2.equipment[11].growInfo.options[2].level}/${data2.equipment[11].growInfo.options[3].level}=${data2.equipment[11].growInfo.total.level})`,
                                "inline": false
                            }
                        ])
                        .setFooter({
                            "text": `Character id: ${characterId}\nBot by @shadepopping`
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
            .catch(err => {
                if(data===undefined) return interaction.editReply("API request failed.");
                if(data.error.status===503) return interaction.editReply("System maintenance.");
                console.log(err);
            });


        
        return;
    },
};