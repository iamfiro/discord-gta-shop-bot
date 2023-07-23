import * as net from 'net'
import { client } from './bot'

const server = net.createServer(socket => {
    socket.on('data', async data => {
        const id = data.toString()
        console.log(id)
        await client.login(process.env.BOT_TOKEN)
        const guild = client.guilds.cache.get('1081835298473922560')
        const member = await guild.members.fetch(id)
        await member.roles.add('1131491531904254043')
    })
})

export default server
