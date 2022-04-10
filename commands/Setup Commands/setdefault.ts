import { Message } from "discord.js";
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from '../../schemas/userschema'
import serverValues from "../../schemas/serverValues";
import { client } from "../..";

export default {
    category: "Setup",
    description:"Set the jail role.",

    permissions: ['ADMINISTRATOR'],

    expectedArgs: '<@Role>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}setdefault {ARGUMENTS}`"
    },

    callback: async ({ channel, message, guild, args }) => {
        const reg = new RegExp(/[\\<>@#&!]/g)
        const roleID = (args[0].toString().replace(reg, ""))

        const guild_db = await serverValues.findOne({'server_id': guild?.id})

        const roleArg = guild?.roles.cache.find(role => role.id === roleID);

        if (guild_db) 
        {
            const currentGuild = client.guilds.cache.get(guild?.id!)

            if (currentGuild?.roles.cache.get(roleArg?.id!) != undefined && !currentGuild?.roles.cache.get(roleArg?.id!)?.managed && !currentGuild?.roles.cache.get(roleArg?.id!)?.permissions.has('ADMINISTRATOR'))
            {
                if (guild_db.jail_role == roleID)
                {
                    message.reply("**The Default role cannot be the same as the Jail role.**")
                }
                else
                {
                    await serverValues.findOneAndUpdate(
                        {server_id: guild?.id},
                        {default_role: roleArg},
                    )
                    
                    message.reply("**Default role set to **" + "<@&" + roleArg + ">")
                }

            }
            else
            {
                message.reply("**Please mention a valid role to set as Default role.**")
            }

        }
        else
        {
            message.reply("**Use**" + " " + "`setup`" + " " + "**first.**")
        }
    }
} as ICommand