import { GuildMember, Message } from "discord.js";
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from '../../schemas/userschema'
import { ChannelTypes } from "discord.js/typings/enums";
import { client } from "../../index";
import { Permissions } from "discord.js";
import serverValues from '../../schemas/serverValues';

export default {
    category: "Wanted",
    description: "Make a user a police officer.",

    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}recruit {ARGUMENTS}`"
    },

    callback: async ({ channel, message, args, guild, member }) => {
        const reg = new RegExp(/[\\<>@#&!]/g)
        const userID = (args[0].toString().replace(reg, ""))

        const author = await userschema.findOne({'user_id': message.author.id})
        const men_user = await userschema.findOne({'user_id': userID})

        const men_member = await client.users.cache.find((user: any) => user.id === userID)

        const guild_db = await serverValues.findOne({'server_id': guild?.id})

        const defaultRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.default_role)
        const jailRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role)

        const currentGuild = client.guilds.cache.get(guild?.id!)
            
        if (currentGuild?.members.cache.get(userID) == undefined || men_member?.bot)
        {
            message.reply("**You must mention a valid user to recruit.**")
            return
        }

        if (message.author.id != '415241379866869771')
        {
            message.reply("**Only Kayu can use that command.**")
            return
        }

        if (guild_db && defaultRole != undefined && jailRole != undefined)
        {
            if (men_user) 
            {
                if (!men_user.is_officer)
                {
                    await userschema.findOneAndUpdate(
                        {user_id: userID},
                        {is_officer: true},
                    )

                    message.reply("**Alrighty," + " " + men_member?.username.toString() + " " + "is now a police officer.**")
                }
                else
                {
                    message.reply("**That user is already a police officer.**")
                }
            }
            else
            {
                message.reply("**Database error.**")
            }
        }
        else
        {
            message.reply("**Server setup is not completed. Use the**" + " " + "`setup`" + " " + "**command for more info.**")
        }

    }

} as ICommand