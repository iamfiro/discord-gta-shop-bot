import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { client } from "../lib/bot";

async function handler(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle("✅ 인증 하기 위해 아래 버튼을 눌러주세요")
        .setColor(0x57F287)
    const button = new ButtonBuilder()
        .setLabel("🔒 인증하기")
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.js.org')

    const row = new ActionRowBuilder()
    .addComponents(button);
    await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
        .then((message) => message.delete())
        .catch(console.error);
}

export default {
    info: new SlashCommandBuilder().setName("인증").setDescription("Replies with Pong!"),
    handler
}