import { CacheType, ChatInputCommandInteraction, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import prisma from "../lib/prisma";
import { OrderType, TicketType } from "@prisma/client";
import { onlyNumberRegex } from "../lib/regex";

export const checkTicketDuplicate = async (userId: string, guildId: string): Promise<{isDuplicate: boolean, data: any | null}> => {
    const exists = await prisma.ticket.findMany({ where: { userId, guildId, ticketType: TicketType.Open } });
    if (exists.length === 0) return { isDuplicate: true, data: null };
    return { isDuplicate: false, data: exists };
}

function StringToOrderType(type: string) {
    switch(type) {
        case 'Set_5000': return OrderType.Set_5000
        case 'Set_10000': return OrderType.Set_10000
        case 'Set_20000': return OrderType.Set_20000
        case 'Set_30000': return OrderType.Set_30000
        case 'Set_50000': return OrderType.Set_50000
        case 'Only_3Money': return OrderType.Only_3Money
        case 'Only_office': return OrderType.Only_office
        case 'Only_level': return OrderType.Only_level
        case 'Only_unlock': return OrderType.Only_unlock
    }
}

export const addTicket = async (userId: string, guildId: string, orderType: string, ): Promise<number> => {
    const data = await prisma.ticket.create({
        data: {
            userId,
            guildId,
            orderType: StringToOrderType(orderType),
            ticketType: TicketType.Open
        }
    });
    return data.id
}

export const getTicketId = async (interaction: any) => {
    const data = await prisma.ticket.findFirst({
        where: {
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            ticketType: TicketType.Open
        }
    });
    return data.id
}

export const editTicketMessageIdAndChannelId = async (interaction: StringSelectMenuInteraction<CacheType>, messageId: string, channelId: string) => {
    getTicketId(interaction).then(async function(result) {
        const editMsgId = await prisma.ticket.update({
            where: {
                id: result,
            },
            data: {
                embedMessageId: messageId,
                channelId
            }
        })
    })
}

export const getTicketEmbedId = async (interaction: any, datas: any) => {
    const data = await prisma.ticket.findFirst({
        where: {
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            ticketType: TicketType.Open
        }
    });
    return { id: data.embedMessageId, channelId: data.channelId, data, level: datas.accountLevel }
}

export const editTicketData = async (interaction: ModalSubmitInteraction<CacheType>, data: any) => {
    getTicketId(interaction).then(async function(result) {
        const editMsgId = await prisma.ticket.update({
            where: {
                id: result,
            },
            data
        })
    })

    return await getTicketEmbedId(interaction, data)
}
