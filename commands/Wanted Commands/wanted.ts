import { Message } from "discord.js";
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from '../../schemas/userschema'
import { ChannelTypes } from "discord.js/typings/enums";
import { client } from "../../index";
import { Permissions } from "discord.js";
import serverValues from '../../schemas/serverValues';

export default {
    category: "Wanted",
    description: "Give a user a wanted level.",

    expectedArgs: '<@User> <WantedLevel> <Reason>',
    minArgs: 3,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}wanted {ARGUMENTS}`"
    },

    callback: async ({ channel, message, args, guild }) => {
        const reg = new RegExp(/[\\<>@#&!]/g)
        const userID = (args[0].toString().replace(reg, ""))
        var wantedLevel = parseInt(args[1])
        var reason = args.slice(2).toString().replace(/,/g, ' ')

        const men_user = await userschema.findOne({'user_id': userID})
        const author = await userschema.findOne({'user_id': message.author.id})

        const men_member = client.users.cache.find((user: any) => user.id === userID)

        const guild_db = await serverValues.findOne({'server_id': guild?.id})

        const defaultRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.default_role)
        const jailRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role)

        if (userID == '415241379866869771')
        {
            message.reply("**I can't give Kayu himself a wanted level.**")
            return
        }
            
        const currentGuild = client.guilds.cache.get(guild?.id!)
            
        if (currentGuild?.members.cache.get(userID) == undefined || men_member?.bot)
        {
            message.reply("**You must mention a valid user to give wanted to.**")
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
                            message.reply("**That user is already wanted!**")
                        }
                        else
                        { 
                            if (wantedLevel.toString() == 'NaN')
                            {
                                message.reply("**Wanted level must be a valid number.**")
                            } 
                            else if (wantedLevel > 5 || wantedLevel < 1) 
                            {
                                message.reply('**Wanted level must be between 1-5**')
                            }
                            else 
                            {
                                await userschema.findOneAndUpdate(
                                    {user_id: userID},
                                    {wanted_lvl: wantedLevel},
                                )
        
                                reason = reason.charAt(0).toUpperCase() + reason.slice(1)
        
                                await userschema.findOneAndUpdate(
                                    {user_id: userID},
                                    {wanted_reason: reason},
                                )
        
                                message.reply(
                                    "**On the lookout for suspect:**" + " " + men_member?.username.toString() + "\n" +
                                    "**Wanted level:**" + " " + wantedLevel.toString() + "\n" +
                                    "**Wanted for:**" + " " + reason
                                )
                            }
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