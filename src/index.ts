import { client, rest } from './lib/bot';
import ping from './commands/ping';
import { Routes } from 'discord.js';
import buyLog from './commands/buyLog';

client.on('ready', async() => {
    await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: [
            ping.info.toJSON(), 
            buyLog.info.toJSON(),
        ]
    })
    console.log(`✅ Logged in as ${client.user?.tag}!`)
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'ping': ping.handler(interaction); break;
            case '구매로그등록': buyLog.handler(interaction); break;
        }
    }
})

;(async () => {
    client.login(process.env.BOT_TOKEN)
})()