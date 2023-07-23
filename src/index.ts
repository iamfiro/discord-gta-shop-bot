import { client, rest } from './lib/bot';
import ping from './commands/ping';
import server from './lib/tcp';
import { Routes } from 'discord.js';
import verficationEmbed from './commands/verficationEmbed';

client.on('ready', async() => {
    await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: [
            ping.info.toJSON(), 
            verficationEmbed.info.toJSON()
        ]
    })
    console.log(`✅ Logged in as ${client.user?.tag}!`)
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'ping': ping.handler(interaction); break;
            case '인증': verficationEmbed.handler(interaction); break;
        }
    } else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'verfication-button':
                
        }
    }
})

;(async () => {
    client.login(process.env.BOT_TOKEN)
    server.listen(4001, () => console.log('🚀 TCP Server is running on port 4001'))
})()