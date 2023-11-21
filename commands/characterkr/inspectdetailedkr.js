const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const {API_KEY_KR} = require('../../config.json');
const fetch = require('node-fetch');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inspectdetailedkr')
    .setDescription('Check gear details on a character')
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
        const characterCanvas = Canvas.createCanvas(200,230);
        const characterCtx = characterCanvas.getContext('2d');
        let adventureImg = new Canvas.Image();
        let characterAttachment = new AttachmentBuilder();
        let adventureName = '';
        let characterId = '';
        let characterName = '';
        let jobGrowName = '';
        let fame = 0;
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
                fame = data.rows[0].fame,
                fetch(`https://api.neople.co.kr/df/servers/${server}/characters/${characterId}/equip/equipment?apikey=${API_KEY_KR}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    if(data2.error){
                        throw Error(`${data2.error.status} - ${data2.error.code} [${data2.error.message}]`)
                    }
                    if(data2.equipment.length<13) return interaction.editReply("Missing equipment in slots");
                    if(!((data2.equipment[0].customOption != null || data2.equipment[0].fixedOption != null) && (data2.equipment[2].customOption != null || data2.equipment[2].fixedOption != null) && (data2.equipment[3].customOption != null || data2.equipment[3].fixedOption != null) && (data2.equipment[6].customOption != null || data2.equipment[6].fixedOption != null) && (data2.equipment[4].customOption != null || data2.equipment[4].fixedOption != null) && (data2.equipment[5].customOption != null || data2.equipment[5].fixedOption != null) && (data2.equipment[8].customOption != null || data2.equipment[8].fixedOption != null) && (data2.equipment[7].customOption != null || data2.equipment[7].fixedOption != null) && (data2.equipment[9].customOption != null || data2.equipment[9].fixedOption != null) && (data2.equipment[10].customOption != null || data2.equipment[10].fixedOption != null) && (data2.equipment[11].customOption != null || data2.equipment[11].fixedOption != null) && (data2.equipment[12].customOption != null || data2.equipment[12].fixedOption != null))) return interaction.editReply("Level 105 Epic/Legendary equipment missing in some slots");
                    adventureName = data2.adventureName;
                    if(data2.equipment[0].upgradeInfo != null) 
                        wepImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[0].upgradeInfo.itemId}`);
                    else
                        wepImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[0].itemId}`);
                    if(data2.equipment[2].upgradeInfo != null)
                        topImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[2].upgradeInfo.itemId}`);
                    else
                        topImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[2].itemId}`);
                    if(data2.equipment[3].upgradeInfo != null)
                        shoulderImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[3].upgradeInfo.itemId}`);
                    else
                        shoulderImg = await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[3].itemId}`);
                    if(data2.equipment[6].upgradeInfo != null)
                        beltImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[6].upgradeInfo.itemId}`);
                    else
                        beltImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[6].itemId}`);
                    if(data2.equipment[4].upgradeInfo != null)
                        pantsImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[4].upgradeInfo.itemId}`);
                    else
                        pantsImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[4].itemId}`);
                    if(data2.equipment[5].upgradeInfo != null)
                        shoesImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[5].upgradeInfo.itemId}`);
                    else
                        shoesImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[5].itemId}`);
                    if(data2.equipment[8].upgradeInfo != null)
                    braceImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[8].upgradeInfo.itemId}`);
                    else
                    braceImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[8].itemId}`);
                    if(data2.equipment[7].upgradeInfo != null)
                    neckImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[7].upgradeInfo.itemId}`);
                    else
                    neckImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[7].itemId}`);
                    if(data2.equipment[9].upgradeInfo != null)
                    ringImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[9].upgradeInfo.itemId}`);
                    else
                    ringImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[9].itemId}`);
                    if(data2.equipment[10].upgradeInfo != null)
                    subImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[10].upgradeInfo.itemId}`);
                    else
                    subImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[10].itemId}`);
                    if(data2.equipment[11].upgradeInfo != null)
                    stoneImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[11].upgradeInfo.itemId}`);
                    else
                    stoneImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[11].itemId}`);
                    if(data2.equipment[12].upgradeInfo != null)
                    earImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[12].upgradeInfo.itemId}`);
                    else
                    earImg= await Canvas.loadImage(`https://img-api.neople.co.kr/df/items/${data2.equipment[12].itemId}`);

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
                            },
                            {
                                "name": `Fame:`,
                                "value": `${fame}`,
                                "inline": true
                            },
                            {
                                "name": `Weapon:`,
                                "value": `+${data2.equipment[0].reinforce}${data2.equipment[0].amplificationName?'['+data2.equipment[0].amplificationName.slice(-3)+']':''}(${data2.equipment[0].refine}) ${data2.equipment[0].itemName} (Lv${data2.equipment[0].fixedOption?data2.equipment[0].fixedOption.level:data2.equipment[0].customOption.level} [${data2.equipment[0].fixedOption?data2.equipment[0].fixedOption.expRate:data2.equipment[0].customOption.expRate}%])`,
                                "inline": false
                            },
                            {
                                "name": `Armour:`,
                                "value": `${data2.equipment[2].slotName}: +${data2.equipment[2].reinforce}${data2.equipment[2].amplificationName?'['+data2.equipment[2].amplificationName.slice(-3)+']':''} ${data2.equipment[2].itemName} (Lv${data2.equipment[2].fixedOption?data2.equipment[2].fixedOption.level:data2.equipment[2].customOption.level} [${data2.equipment[2].fixedOption?data2.equipment[2].fixedOption.expRate:data2.equipment[2].customOption.expRate}%])\n${data2.equipment[4].slotName}: +${data2.equipment[4].reinforce}${data2.equipment[4].amplificationName?'['+data2.equipment[4].amplificationName.slice(-3)+']':''} ${data2.equipment[4].itemName} (Lv${data2.equipment[4].fixedOption?data2.equipment[4].fixedOption.level:data2.equipment[4].customOption.level} [${data2.equipment[4].fixedOption?data2.equipment[4].fixedOption.expRate:data2.equipment[4].customOption.expRate}%])\n${data2.equipment[3].slotName}: +${data2.equipment[3].reinforce}${data2.equipment[3].amplificationName?'['+data2.equipment[3].amplificationName.slice(-3)+']':''} ${data2.equipment[3].itemName} (Lv${data2.equipment[3].fixedOption?data2.equipment[3].fixedOption.level:data2.equipment[3].customOption.level} [${data2.equipment[3].fixedOption?data2.equipment[3].fixedOption.expRate:data2.equipment[3].customOption.expRate}%])\n${data2.equipment[6].slotName}: +${data2.equipment[6].reinforce}${data2.equipment[6].amplificationName?'['+data2.equipment[6].amplificationName.slice(-3)+']':''} ${data2.equipment[6].itemName} (Lv${data2.equipment[6].fixedOption?data2.equipment[6].fixedOption.level:data2.equipment[6].customOption.level} [${data2.equipment[6].fixedOption?data2.equipment[6].fixedOption.expRate:data2.equipment[6].customOption.expRate}%])\n${data2.equipment[5].slotName}: +${data2.equipment[5].reinforce}${data2.equipment[5].amplificationName?'['+data2.equipment[5].amplificationName.slice(-3)+']':''} ${data2.equipment[5].itemName} (Lv${data2.equipment[5].fixedOption?data2.equipment[5].fixedOption.level:data2.equipment[5].customOption.level} [${data2.equipment[5].fixedOption?data2.equipment[5].fixedOption.expRate:data2.equipment[5].customOption.expRate}%])`,                                "inline": false
                            },
                            {
                                "name": `Accessory:`,
                                "value": `${data2.equipment[7].slotName}: +${data2.equipment[7].reinforce}${data2.equipment[7].amplificationName?'['+data2.equipment[7].amplificationName.slice(-3)+']':''} ${data2.equipment[7].itemName} (Lv${data2.equipment[7].fixedOption?data2.equipment[7].fixedOption.level:data2.equipment[7].customOption.level} [${data2.equipment[7].fixedOption?data2.equipment[7].fixedOption.expRate:data2.equipment[7].customOption.expRate}%])\n${data2.equipment[8].slotName}: +${data2.equipment[8].reinforce}${data2.equipment[8].amplificationName?'['+data2.equipment[8].amplificationName.slice(-3)+']':''} ${data2.equipment[8].itemName} (Lv${data2.equipment[8].fixedOption?data2.equipment[8].fixedOption.level:data2.equipment[8].customOption.level} [${data2.equipment[8].fixedOption?data2.equipment[8].fixedOption.expRate:data2.equipment[8].customOption.expRate}%])\n${data2.equipment[9].slotName}: +${data2.equipment[9].reinforce}${data2.equipment[9].amplificationName?'['+data2.equipment[9].amplificationName.slice(-3)+']':''} ${data2.equipment[9].itemName} (Lv${data2.equipment[9].fixedOption?data2.equipment[9].fixedOption.level:data2.equipment[9].customOption.level} [${data2.equipment[9].fixedOption?data2.equipment[9].fixedOption.expRate:data2.equipment[9].customOption.expRate}%])`,                                "inline": false
                            },
                            {
                                "name": `Special Equipment:`,
                                "value": `${data2.equipment[10].slotName}: +${data2.equipment[10].reinforce}${data2.equipment[10].amplificationName?'['+data2.equipment[10].amplificationName.slice(-3)+']':''} ${data2.equipment[10].itemName} (Lv${data2.equipment[10].fixedOption?data2.equipment[10].fixedOption.level:data2.equipment[10].customOption.level} [${data2.equipment[10].fixedOption?data2.equipment[10].fixedOption.expRate:data2.equipment[10].customOption.expRate}%])\n${data2.equipment[12].slotName}: +${data2.equipment[12].reinforce}${data2.equipment[12].amplificationName?'['+data2.equipment[12].amplificationName.slice(-3)+']':''} ${data2.equipment[12].itemName} (Lv${data2.equipment[12].fixedOption?data2.equipment[12].fixedOption.level:data2.equipment[12].customOption.level} [${data2.equipment[12].fixedOption?data2.equipment[12].fixedOption.expRate:data2.equipment[12].customOption.expRate}%])\n${data2.equipment[11].slotName}: +${data2.equipment[11].reinforce}${data2.equipment[11].amplificationName?'['+data2.equipment[11].amplificationName.slice(-3)+']':''} ${data2.equipment[11].itemName} (Lv${data2.equipment[11].fixedOption?data2.equipment[11].fixedOption.level:data2.equipment[11].customOption.level} [${data2.equipment[11].fixedOption?data2.equipment[11].fixedOption.expRate:data2.equipment[11].customOption.expRate}%])`,
                                "inline": false
                            }
                        ])
                        .setFooter({
                            "text": `Character id: ${characterId}\nJoin discord.me/marbas for support\nPowered by Neople OpenAPI`
                        })
                        
                    

                         try{
                            await interaction.editReply({embeds: [embed], files: [characterAttachment, attachment] });
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