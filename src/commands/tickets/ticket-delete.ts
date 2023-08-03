import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { client } from "../../lib/bot";
import { getTicketData } from "../../db/ticket";

async function handler(interaction: ChatInputCommandInteraction) {
    getTicketData(interaction).then(async function(result) {
        const messageChannel = client.channels.cache.get(result.channelId) as TextChannel;
        if(messageChannel.name.startsWith("티켓")) {
            console.log('sadsd')
            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("티켓을 삭제 하시겠습니까")
                .setDescription('삭제하면 채널과 채널 메시지는 영구적으로 삭제 됩니다')
            await interaction.reply({ embeds: [embed] })
        }
    })
}

export default {
    info: new SlashCommandBuilder().setName("닫기").setDescription("티켓을 종료 합니다"),
    handler
}