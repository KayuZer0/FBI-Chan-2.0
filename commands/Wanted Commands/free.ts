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
    description: "Free a user from jail.",

    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}free {ARGUMENTS}`"
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
            message.reply("**You must mention a valid user to free from jail.**")
            return
        }

        var mem = await guild?.members.fetch(userID)

        try
        {
            const currentGuild = client.guilds.cache.get(guild?.id!)
            currentGuild?.members.cache.get(userID)
        }
        catch
        {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa")
        }

        if (guild_db && defaultRole != undefined && jailRole != undefined)
        {
        
            if (author.is_officer)
            {

                if (author.wanted_lvl < 1 && !mem?.roles.cache.some((role:any) => role.id === guild_db?.jail_role))
                {
                    
                    if (men_user) 
                    {

                        if (mem?.roles.cache.some((role:any) => role.id === guild_db?.jail_role))
                        {
                            message.reply("**Alrighty,**" + " " + men_member?.username.toString() + " " + "**was released from punishment.**")

                            await userschema.findOneAndUpdate(
                                {user_id: userID},
                                {release_time: 0},
                            )
                
                            mem?.roles.remove(guild_db.jail_role)
                            mem?.roles.add(guild_db.default_role)

                        }
                        else
                        {
                            message.reply("**That user is not in jail.**")
                        }
                    }
                    else
                    {
                        message.reply('**Database error. Contact developer.**')
                    }
                }

            }
            else
            {
                message.reply("**Hmph! You're not a cop. You can't tell me what to do!**")
            }
        }
        else 
        {
            message.reply("**Server setup is not completed. Use the \'setup\' command for more info.**")
        }

    }

} as ICommand