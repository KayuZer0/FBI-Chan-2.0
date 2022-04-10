import { Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed}  from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import fetch from "node-fetch";
import userschema from "../../schemas/userschema";

export default {
    category: "Meme",
    description:"View your XD Counter.",

    callback: async ({ channel, message, args }) => {

        var user = await userschema.findOne({'user_id': message.author.id})
        var sgpl = ""

        
        if (user)
        {
            if (user.xd_counter == 1)
            {
                sgpl = "** time.**"
            }
            else
            {
                sgpl = "** times.**"
            }

            message.reply("**You have said XD a total of **" + user.xd_counter.toString() + sgpl)
        }
        else
        {
            message.reply("**Database error. Contact developer.**")
        }

    }
} as ICommand