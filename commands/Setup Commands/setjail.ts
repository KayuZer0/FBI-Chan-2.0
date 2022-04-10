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
        english: "**Incorrect usage! Use** `{PREFIX}setjail {ARGUMENTS}`"
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

                if (guild_db.default_role == roleID)
                {
                    message.reply("**The Jail role cannot be the same as the Default role.**")
                }
                else
                {
                    await serverValues.findOneAndUpdate(
                        {server_id: guild?.id},
                        {jail_role: roleArg},
                    )
                    
                    message.reply("**Jail role set to **" + "<@&" + roleArg + ">")
                }

            }
            else
            {
                message.reply("**Please mention a valid role to set as Jail role.**")
            }

        }
        else
        {
            message.reply("**Use**" + " " + "\'setup\'" + " " + "**first.**")
        }
    }
} as ICommand