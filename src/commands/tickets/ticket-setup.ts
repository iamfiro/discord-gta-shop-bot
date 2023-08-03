import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, ComponentType, EmbedBuilder, Events, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputStyle, channelMention, userMention } from "discord.js";
import { client } from "../../lib/bot";
import { addTicket, checkTicketDuplicate, editTicketData, editTicketMessageIdAndChannelId, editTicketTypeToClose, getTicketData } from "../../db/ticket";
import { OrderType } from "@prisma/client";
import { onlyNumberRegex } from "../../lib/regex";

function orderTypeToName(type: string) {
    switch(type) {
        case 'Set_5000': return '🔴 5,000 세트 | 💲8억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯'
        case 'Set_10000': return '🟠 10,000 세트 | 💲17억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯'
        case 'Set_20000': return '🟡 20,000 세트 | 💲25억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯'
        case 'Set_30000': return '🟢 30,000 세트 | 💲45억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯'
        case 'Set_50000': return '🔵 50,000 세트 | 💲110억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯'
        case 'Only_3Money': return '💲 3억 추가 | 5,000원'
        case 'Only_office': return '💵 오피스 바닥 돈 추가 | 5,000원'
        case 'Only_level': return '🌐 0 ~ 8000레벨 설정 | 5,000원'
        case 'Only_unlock': return '🌌 올언락 | 5,000원'
    }
}

async function handler(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setColor(0x7F8C8D)
        .setTitle("구매 문의")
        .setDescription('문의 하시려면 아래 버튼을 눌러주세요 📩')

    const ticketButton = new ButtonBuilder()
        .setLabel('📩 티켓 생성하기')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('buttonCreateTicket')
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(ticketButton);

    await interaction.reply({ embeds: [embed], components: [buttonRow]})
}

export default {
    info: new SlashCommandBuilder().setName("티켓").setDescription("Replies with Pong!"),
    handler
}

const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};


client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isButton()) {
        if(interaction.customId === 'buttonCreateTicket') {
            checkTicketDuplicate(interaction.user.id, interaction.guild.id.toString()).then(async function(result) {
                if(result.isDuplicate) {
                    const { customId } = interaction;
                    if(customId === 'buttonCreateTicket') {
                        const embed = new EmbedBuilder()
                        .setColor(0x7F8C8D)
                        .setTitle("구매 문의")
                        .setDescription('문의 하시려면 아래 버튼을 눌러주세요 📩')
            
                        const menu = new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('ticketSelect')
                                .setMaxValues(1)
                                .setPlaceholder('패키지를 선택하세요...')
                                .addOptions(
                                    {
                                        label: '🔴 5,000 세트 | 💲8억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯',
                                        value: OrderType.Set_5000
                                    },
                                    {
                                        label: '🟠 10,000 세트 | 💲17억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯',
                                        value: OrderType.Set_10000
                                    },
                                    {
                                        label: '🟡 20,000 세트 | 💲25억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯',
                                        value: OrderType.Set_20000
                                    },
                                    {
                                        label: '🟢 30,000 세트 | 💲45억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯',
                                        value: OrderType.Set_30000
                                    },
                                    {
                                        label: '🔵 50,000 세트 | 💲110억 🌐0 ~ 8000레벨 🌌올언락 🔋올스탯',
                                        value: OrderType.Set_50000
                                    },
                                    {
                                        label: '💲 3억 추가 | 5,000원',
                                        value: OrderType.Only_3Money
                                    },
                                    {
                                        label: '💵 오피스 바닥 돈 추가 | 5,000원',
                                        value: OrderType.Only_office
                                    },
                                    {
                                        label: '🌐 0 ~ 8000레벨 설정 | 5,000원',
                                        value: OrderType.Only_level
                                    },
                                    {
                                        label: '🌌 올언락 | 5,000원',
                                        value: OrderType.Only_unlock
                                    },
                                )
                        )
                        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true})
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(0x7F8C8D)
                        .setTitle("❌ 티켓 생성중 오류가 발생했습니다")
                        .setDescription('이미 진행 중인 티켓이 있습니다')
                    await interaction.reply({ embeds: [embed], ephemeral: true})
                }
            })
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isStringSelectMenu()) {
        checkTicketDuplicate(interaction.user.id, interaction.guild.id.toString()).then(async function(result) {
            if(result.isDuplicate) {
                addTicket(interaction.user.id, interaction.guild.id, interaction.values[0]).then(async function(results) {
                    console.log(interaction.user.id)
                    const guild = await client.guilds.fetch('1131616938150346873');
                    const channel = await interaction.guild.channels.create({
                        name: `티켓-${results}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [{
                            id: await guild.roles.fetch('1132156770643607553'),
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },{
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }]
                    }).then(async r => {
                        const embed = new EmbedBuilder()
                            .setColor(0x7F8C8D)
                            .setTitle("📩 티켓이 생성 되었습니다")
                            .setDescription(`채널: ${r}`)
                        await interaction.reply({ embeds: [embed], ephemeral: true});

                        await r.send(`환영합니다 <@${interaction.user.id}>`)
                        const channelEmbed = new EmbedBuilder()
                            .setColor(0x7F8C8D)
                            .setTitle(r.name)
                            .setDescription(`\`\`\`\n1️⃣ 선택하신 패키지\n> ${orderTypeToName(interaction.values[0])}\n\n2️⃣ 계정 플랫폼(ex Steam. Rockstar Launcher)\n> [비어 있음]\n\n3️⃣ 계정 이메일 혹은 아이디\n> [비어 있음]\n\n4️⃣ 계정 비밀번호\n> [비어 있음]\n\n5️⃣ 원하는 레벨(1 ~ 8000) 세트 메뉴 혹은 레벨 단품에만 해당\n> [비어 있음]\`\`\`\n패키지 수정시 티켓 닫지 말고 여기다 적어주세요`)

                        const editdataButton = new ButtonBuilder()
                            .setLabel('✏️ 정보 수정하기')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('buttonEditTicketData')
                        const deleteTicketButton = new ButtonBuilder()
                            .setLabel("티켓 삭제하기")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("buttonDeleteTicket")
                        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(editdataButton);
                        const buttonRows = new ActionRowBuilder<ButtonBuilder>().addComponents(deleteTicketButton);
                        return await r.send({ embeds: [channelEmbed], components: [buttonRow, buttonRows] }).then(sent => {
                            editTicketMessageIdAndChannelId(interaction, sent.id, r.id)
                        })
                    });
                })
            } else {
                const embed = new EmbedBuilder()
                    .setColor(0x7F8C8D)
                    .setTitle("❌ 티켓 생성중 오류가 발생했습니다")
                    .setDescription('이미 진행 중인 티켓이 있습니다')
            }
            
        })
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isButton()) {
        if(interaction.customId === 'buttonDeleteTicket') {
            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("티켓을 삭제 하시겠습니까")
                .setDescription('삭제하면 채널과 채널 메시지는 영구적으로 삭제 됩니다')
            const deleteTicketButton = new ButtonBuilder()
                .setLabel("티켓 삭제하기")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("buttonDeleteTicketConfirm")
            const buttonRows = new ActionRowBuilder<ButtonBuilder>().addComponents(deleteTicketButton);
            await interaction.reply({ embeds: [embed], ephemeral: true, components: [buttonRows]})
        } else if(interaction.customId === 'buttonDeleteTicketConfirm') {
            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("티켓이 10초 뒤에 삭제 됩니다")
                .setDescription('삭제하면 채널과 채널 메시지는 영구적으로 삭제 됩니다')
            await interaction.reply({ embeds: [embed] })
            await sleep(10000);
            getTicketData(interaction).then(async function(results) {
                editTicketTypeToClose(interaction);
                (await interaction.guild.channels.fetch(results.channelId)).delete()
            })
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isButton()) {
        if(interaction.customId === 'buttonEditTicketData') {
            const TicketSendModal = new ModalBuilder()
                .setTitle('📩 티켓 생성')
                .setCustomId(`ticketSendEmbed-${interaction.user.id}`)
            const AccountType = new TextInputBuilder({
                custom_id: 'ticketAccountPlatform',
                label: '계정 플랫폼(ex Steam. Rockstar Launcher)',
                style: TextInputStyle.Short,
            })
            const AccountEmail = new TextInputBuilder({
                custom_id: 'ticketAccountEmailOrId',
                label: '계정 이메일 혹은 아이디',
                style: TextInputStyle.Short,
            })
            const AccountPassword = new TextInputBuilder({
                custom_id: 'ticketAccountPassword',
                label: '계정 비밀번호',
                style: TextInputStyle.Short,
            })
            const AccountLevel = new TextInputBuilder({
                custom_id: 'ticketAccountLevel',
                label: '원하는 레벨(1 ~ 8000) 세트 메뉴, 레벨 단품에만 해당',
                style: TextInputStyle.Short
            })
            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AccountType)
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AccountEmail)
            const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AccountPassword)
            const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AccountLevel)

            TicketSendModal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
            await interaction.showModal(TicketSendModal);
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === `ticketSendEmbed-${interaction.user.id}`) {
        const accountPlatform = interaction.fields.getTextInputValue('ticketAccountPlatform'); 
        const accountEmail = interaction.fields.getTextInputValue('ticketAccountEmailOrId'); 
        const accountPassword = interaction.fields.getTextInputValue('ticketAccountPassword'); 
        const accountLevel = onlyNumberRegex.test(interaction.fields.getTextInputValue('ticketAccountLevel')) ? interaction.fields.getTextInputValue('ticketAccountLevel') : '0';
        const datas = await editTicketData(interaction, { accountPlatform, accountEmail, accountPassword, accountLevel: accountLevel });
        const messageChannel = client.channels.cache.get(datas.channelId) as TextChannel;

        const editChannelEmbed = new EmbedBuilder()
            .setColor(0x7F8C8D)
            .setTitle(messageChannel.name)
            .setDescription(`\`\`\`\n1️⃣ 선택하신 패키지\n> ${orderTypeToName(datas.data.orderType)}\n\n2️⃣ 계정 플랫폼(ex Steam. Rockstar Launcher)\n> ${accountPlatform}\n\n3️⃣ 계정 이메일 혹은 아이디\n> ${accountEmail}\n\n4️⃣ 계정 비밀번호\n> ${accountPassword}\n\n5️⃣ 원하는 레벨(1 ~ 8000) 세트 메뉴 혹은 레벨 단품에만 해당\n> ${datas.level}\`\`\`\n패키지 수정시 티켓 닫지 말고 여기다 적어주세요`);
        (await messageChannel.messages.fetch(datas.id)).edit({embeds: [editChannelEmbed]});
		await interaction.reply({ content: '✅ 수정 되었습니다' });
	}
});