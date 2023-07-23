import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, TextChannel, WebhookClient, userMention } from "discord.js";
import { client } from "../lib/bot";

async function handler(interaction: ChatInputCommandInteraction) {
    const buyType = interaction.options.get('구매항목').value.toString();
    const user = interaction.options.get('구매유저').value.toString();
    const webhookClient = new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/1132214866799775835/QcjYvZ-Wp46RvLV_CCTb2LkWaQ_fDArALWsnztfwwYyzBTLByYFrP4cS0FtdAe572j-j'})

    const embed = new EmbedBuilder()
        .setDescription(`✅ ${userMention(user)}님 \`${buyType}\` 구매 감사합니다!`)
        .setColor(0x7AAF57)
    webhookClient.send({
        content: null,
        embeds: [embed]
    });
    const endEmbed = new EmbedBuilder()
        .setDescription(`✅ <@&1132156524710600704> 구매로그가 등록되었습니다.`)
        .setColor(0x7AAF57)
    await interaction.reply({ embeds: [endEmbed], ephemeral: true})
}

export default {
    info: new SlashCommandBuilder().setName("구매로그등록").setDescription("Replies with Pong!")
        .addStringOption(options =>
            options.setName('구매항목')
            .setDescription('구매항목')
            .addChoices(
                { name: '5,000 패키지', value: '🔴 5,000 세트', name_localizations: { ko: '5,000원  💲 8억  |  🌐 0 ~ 8000레벨  |  🌌 올언락  |  🔋 올스탯' } },
                { name: '10,000 패키지', value: '🟠 10,000 세트', name_localizations: { ko: '10,000원  💲 17억  |  🌐 0 ~ 8000레벨  |  🌌 올언락  |  🔋 올스탯' } },
                { name: '20,000 패키지', value: '🟡 20,000 세트', name_localizations: { ko: '20,000원  💲 25억  |  🌐 0 ~ 8000레벨  |  🌌 올언락  |  🔋 올스탯' } },
                { name: '30,000 패키지', value: '🟢 30,000 세트', name_localizations: { ko: '30,000원  💲 45억  |  🌐 0 ~ 8000레벨  |  🌌 올언락  |  🔋 올스탯' } },
                { name: '50,000 패키지', value: '🔵 50,000 세트', name_localizations: { ko: '50,000원  💲 110억  |  🌐 0 ~ 8000레벨  |  🌌 올언락  |  🔋 올스탯' } },
                { name: '5,000 단품 3억', value: '🔴 3억 단품', name_localizations: { ko: '5,000원  단품 💲 3억 추가' } },
                { name: '5,000 단품 오피스', value: '🟠 오피스 단품', name_localizations: { ko: '5,000원  단품 💵 오피스 바닥 돈 추가' } },
                { name: '5,000 단품 레벨', value: '🟡 레벨 단품', name_localizations: { ko: '5,000원  단품 🌐 0 ~ 8000레벨 설정' } },
                { name: '5,000 단품 올언락', value: '🟢 올언락 단품', name_localizations: { ko: '5,000원  단품 🌌 올언락' } },
            )
            .setRequired(true)
        )
        .addUserOption(options =>
            options.setName('구매유저')
            .setDescription('👤 구매한 유저를 선택해주세요')
            .setRequired(true)
    )
    ,handler
}