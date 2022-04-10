import { Message } from "discord.js";
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from '../../schemas/userschema'
import { ChannelTypes } from "discord.js/typings/enums";
import { client } from "../../index";
import { Permissions } from "discord.js";
import serverValues from "../../schemas/serverValues";

export default {
    category: "Wanted",
    description:"Clear a user's wanted level.",

    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}clear {ARGUMENTS}`"
    },

    callback: async ({ channel, message, args, guild }) => {
        const reg = new RegExp(/[\\<>@#&!]/g)
        const userID = (args[0].toString().replace(reg, ""))

        const men_user = await userschema.findOne({'user_id': userID})
        const author = await userschema.findOne({'user_id': message.author.id})

        const men_member = client.users.cache.find((user: any) => user.id === userID)

        const guild_db = await serverValues.findOne({'server_id': guild?.id})

        const defaultRole = message.guild?.roles.cache.find(x => x.id === guild_db?.default_role)
        const jailRole = message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role)

        const currentGuild = client.guilds.cache.get(guild?.id!)
    
        if (currentGuild?.members.cache.get(userID) == undefined)
        {
            message.reply("**You must mention a valid user to clear wanted.**")
            return
        }

        var mem = await guild?.members.fetch(userID)
        var auth = await guild?.members.fetch(message.author.id)
        
        if (guild_db && defaultRole != undefined && jailRole != undefined)
        {
        
            if (author.is_officer)
            {
                if (author.wanted_lvl < 1 && !auth?.roles.cache.some((role:any) => role.id === guild_db?.jail_role))
                {
    
                    if (men_user)
                    {
                        if (men_user.wanted_lvl > 0)
                        {
                            await userschema.findOneAndUpdate(
                                {user_id: userID},
                                {wanted_lvl: 0},
                            )
    
                            await userschema.findOneAndUpdate(
                                {user_id: userID},
                                {wanted_reason: ' '},
                            )
                            
                            message.reply("**Whaa~? Bummer! Ok,**" + " " + men_member?.username.toString() + " " + "**was cleared of wanted.**")
                        }
                        else
                        {
                            message.reply("**That user is not wanted.**")
                        }
                    }
                    else
                    {
                        message.reply('**Database error. Contact developer.**')
                    }
                }
            }
        }
        else 
        {
            message.reply("**Server setup is not completed. Use the \'setup\' command for more info.**")
        }
    }
} as ICommand