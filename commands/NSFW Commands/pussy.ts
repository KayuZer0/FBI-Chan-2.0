import { Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed}  from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import fetch from "node-fetch";

export default {
    category: "NSFW",
    description:"View some nice hentai.",

    callback: async ({ channel, message, args }) => {
        const hmtai = require("hmtai");
        const whatType = hmtai.nsfw.vagina()

        if (channel.nsfw)
        {
            const tempEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Here, take some lewds :)')
            .setURL(whatType)
            .setImage(whatType)
    
            await channel.send({embeds: [tempEmbed]})
        }
        else
        {
            const tempEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hol\' up! No NSFW allowed here!')
            .setImage('https://i.imgur.com/oe4iK5i.gif')
    
            await channel.send({embeds: [tempEmbed]})
        }
    }
} as ICommand