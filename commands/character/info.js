const { SlashCommandBuilder, discordSort } = require("discord.js");
const {API_KEY} = require('../../config.json');
const fetch = require('node-fetch');
const { request } = require('undici');
const { URLSearchParams } = require("url");

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
        fetch(`https://api.dfoneople.com/df/servers/${server}/characters?&apikey=${API_KEY}&characterName=${ign}&wordType=match`)
            .then(res => res.json())
            .then(data => {
                if(!data.rows[0]) return interaction.editReply("That character doesn't exist... yet.");
                characterId = data.rows[0].characterId,
                characterName = data.rows[0].characterName,
                level = data.rows[0].level,
                jobGrowName = data.rows[0].jobGrowName,
                fame = data.rows[0].fame,
                fetch(`https://api.dfoneople.com/df/servers/${server}/characters/${characterId}?apikey=${API_KEY}`)
                .then (res2=> res2.json())
                .then (async data2 => {
                    adventureName = data2.adventureName,
                    guildName = data2.guildName,
                    embed = {
                        "description": "asd",
                        /*"components": [
                            {
                            "type": 1,
                            "components": [
                                {
                                    "style": 4,
                                    "label": `❌`,
                                    "custom_id": `remove`,
                                    "disabled": false,
                                    "type": 2
                                }
                            ]
                            }
                        ],*/
                        "embeds": [
                            {
                            "type": "rich",
                            "title": `Explorer Club\n<${adventureName}>`,
                            "description": "",
                            "color": 0x00FFFF,
                            "fields": [
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
                                }
                                ],
                                "footer": {
                                  "text": `Character id: ${characterId}\nBot by @shadepopping`
                                }
                              }
                            ]
                          }
                          try{
                            //await interaction.deferReply();
                            //await wait(3000);

                            await interaction.editReply(embed);
                          } catch(err) {
                            console.log(err);
                            return;
                          }
                });
            });


        
        return;
    },
};