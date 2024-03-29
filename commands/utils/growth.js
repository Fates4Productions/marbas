const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('growth')
    .setDescription('Check option level growth results')
    .addNumberOption(option => option.setName('level')
        .setDescription('Gear option level.  Include % as decimal (ie. Lv 79 64.31% ➡ 79.6431)')
        .setRequired(true))
    .addBooleanOption(option => option.setName('seon')
        .setDescription('Seon prefix')
        .setRequired(true))
    .addNumberOption(option => option.setName('feedlevel')
        .setDescription('Fodder option level.  Include % as decimal (ie. Lv 79 64.31% ➡ 79.6431)')
        .setRequired(false))
    .addBooleanOption(option => option.setName('feedseon')
        .setDescription('Seon prefix on fodder')
        .setRequired(false)),
    async execute(interaction) {
        const level = Math.floor(interaction.options.getNumber('level'));
        const percent = interaction.options.getNumber('level') - level;
        const seon = interaction.options.getBoolean('seon');

        const feedLevel = Math.floor(interaction.options.getNumber('feedlevel'));
        const feedPercent = interaction.options.getNumber('feedlevel') - feedLevel;
        const feedSeon = interaction.options.getBoolean('feedseon');

        const expTable = [300,400,500,600,700,800,900,1000,1100,1300,
            1400,1500,1600,1700,1900,2100,2300,2500,2700,3300,
            3700,4100,4600,5200,5800,6500,7300,8200,9200,11600,
            13300,15300,17600,20200,23200,26700,30700,35300,40600,52700,
            62200,73400,86600,102200,120600,142300,167900,198100,233800,311200,
            376500,455600,551300,666800,806700,976200,1182300,1431700,1733500,2363500,
            2929900,3631700,4501900,5580900,6918900,8577900,10635100,13186100,16349300,22849300,
            29019800,36856300,46808700,59443200,75500400,95886700,121777300,154658400,196417400,280876900];
        const seonTable = [280876900,308964590,337052280,365139970,393227660,421315350,449403040,477490730,505578420,533666110,
            589841490,646016870,702192250,758367630,814543010,870718390,926893770,983069150,1039244530,1095419910,
            1179682980,1263946050,1348209120,1432472190,1516735260,1657173710,1797612160,1938050610,2078489060,2218927510,
            2415541340,2612155170,2808769000,3005382830,3201996660,3482873560,3763750460,4044627360,4325504260,4606381160];
        let embed = {};
        
        if((seon && level > 40) || (feedSeon && feedLevel > 40))
        {
            embed = new EmbedBuilder()
                .setTitle(`ERROR`)
                .setColor(0xFF0000)
            await interaction.editReply(`Level can't be greater than 40 for Seon gear`);
            return;
        }
        if((!seon && level == 80) || (seon && level == 40))
        {
            embed = new EmbedBuilder()
                .setTitle(`ERROR`)
                .setColor(0xFF0000)
            await interaction.editReply(`Gear is capped`);
            return;
        }
        if(feedSeon && feedLevel == null)
        {
            embed = new EmbedBuilder()
                .setTitle(`ERROR`)
                .setColor(0xFF0000)
            await interaction.editReply(`Missing fodder level`);
            return;
        }

        let gearExp = 0;
        if(seon)
        {
            gearExp = seonTable[level-1] + (seonTable[level]-seonTable[level-1])*percent;
        } else {
            gearExp = expTable[level-1] + (expTable[level]-expTable[level-1])*percent;
        }

        
        if(feedLevel){
            let fodderExp = 0;


            if(feedSeon)
            {
                if (feedLevel == 40){
                    fodderExp = seonTable[feedLevel-1];
                } else
                {
                    fodderExp = seonTable[feedLevel-1] + (seonTable[feedLevel]-seonTable[feedLevel-1])*feedPercent;
                }
            } else if(feedLevel)
            {
                if (feedLevel == 80){
                    fodderExp = expTable[feedLevel-1];
                } else
                {
                    fodderExp = expTable[feedLevel-1] + (expTable[feedLevel]-expTable[feedLevel-1])*feedPercent;
                }
            }
            let resultExp = 0;
            let greatExp = 0;
            let resultLevel = 0;
            let greatLevel = 0;

            console.log(fodderExp);
            if(fodderExp > 0)
            {
                resultExp = gearExp + fodderExp;
                greatExp = gearExp + fodderExp*2;
                if(seon)
                {
                    if (resultExp >= seonTable[39])
                    {
                        resultLevel = 40;
                    } else
                    {
                        for(let i=0; i<=39; ++i)
                        {
                            if (seonTable[i]>=resultExp)
                            {
                                resultLevel = Math.floor((i+(resultExp-seonTable[i-1])/(seonTable[i]-seonTable[i-1]))*10000)/10000;
                                break;
                            }
                        }
                    }
                    if (greatExp >= seonTable[39])
                    {
                        greatLevel = 40;
                    } else
                    {
                        for(let i=0; i<=39; ++i)
                        {
                            if (seonTable[i]>=greatExp)
                            {
                                greatLevel = Math.floor((i+(greatExp-seonTable[i-1])/(seonTable[i]-seonTable[i-1]))*10000)/10000;
                                break;
                            }
                        }
                    }
                } else
                {
                    if (resultExp >= expTable[79])
                    {
                        resultLevel = 80;
                    } else
                    {
                        for(let i=0; i<=79; ++i)
                        {
                            if (expTable[i]>=resultExp)
                            {
                                resultLevel = Math.floor((i+(resultExp-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                                break;
                            }
                        }
                    }
                    if (greatExp >= expTable[79])
                    {
                        greatLevel = 80;
                    } else
                    {
                        for(let i=0; i<=79; ++i)
                        {
                            if (expTable[i]>=greatExp)
                            {
                                greatLevel = Math.floor((i+(greatExp-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                                break;
                            }
                        }
                    }
                }
            }
            embed = new EmbedBuilder()
                .setColor(0x00FFFF)
                .addFields([
                    {
                        "name": `Gear Level:`,
                        "value": `${interaction.options.getBoolean('seon')?`Seon `:``}${interaction.options.getNumber('level')}`,
                        "inline": true
                    },
                    {
                        "name": `Fodder Level:`,
                        "value": `${interaction.options.getBoolean('feedseon')?`Seon `:``}${interaction.options.getNumber('feedlevel')}`,
                        "inline": true
                    },
                    {
                        "name": `Regular Growth:`,
                        "value": `${interaction.options.getBoolean('seon')?`Seon `:``}${resultLevel}`,
                        "inline": false
                    },
                    {
                        "name": `Great Success:`,
                        "value": `${interaction.options.getBoolean('seon')?`Seon `:``}${greatLevel}`,
                        "inline": false
                    }
                ])
                .setFooter({
                    "text": `Join discord.me/marbas for support`
                })
        } else {
            let nextRegular = 0;
            let nextGreat = 0;
            if(seon)
            {
                for(let i=0; i<=79; ++i)
                {
                    if (expTable[i]>=seonTable[level]-gearExp)
                    {
                        nextRegular = Math.floor((i+((seonTable[level]-gearExp)-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                        break;
                    }
                }
                for(let i=0; i<=79; ++i)
                {
                    if (expTable[i]>=((seonTable[level]-gearExp)/2))
                    {
                        nextGreat = Math.floor((i+((seonTable[level]-gearExp)/2-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                        break;
                    }
                }
            } else 
            {
                for(let i=0; i<=79; ++i)
                {
                    if (expTable[i]>=expTable[level]-gearExp)
                    {
                        nextRegular = Math.floor((i+((expTable[level]-gearExp)-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                        break;
                    }
                }
                for(let i=0; i<=79; ++i)
                {
                    if (expTable[i]>=((expTable[level]-gearExp)/2))
                    {
                        nextGreat = Math.floor((i+((expTable[level]-gearExp)/2-expTable[i-1])/(expTable[i]-expTable[i-1]))*10000)/10000;
                        break;
                    }
                }
            }


            embed = new EmbedBuilder()
            .setColor(0x00FFFF)
            .addFields([
                {
                    "name": `Gear Level:`,
                    "value": `${interaction.options.getBoolean('seon')?`Seon `:``}${interaction.options.getNumber('level')}`,
                    "inline": true
                },
                {
                    "name": `Regular Growth Next Level:`,
                    "value": `${nextRegular}`,
                    "inline": false
                },
                {
                    "name": `Great Success Next Level:`,
                    "value": `${nextGreat}`,
                    "inline": false
                }
            ])
            .setFooter({
                "text": `Join discord.me/marbas for support`
            })
        }
        try{
            await interaction.editReply({embeds: [embed]});
        }
            catch(err){
            console.log(err);
            return;
        }
        return;
    },
};