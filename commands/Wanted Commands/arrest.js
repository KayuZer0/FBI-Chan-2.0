"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const index_1 = require("../../index");
const serverValues_1 = __importDefault(require("../../schemas/serverValues"));
exports.default = {
    category: "Wanted",
    description: "Clear a user's wanted level.",
    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}free {ARGUMENTS}`"
    },
    callback: async ({ channel, message, args, guild, member }) => {
        const reg = new RegExp(/[\\<>@#&!]/g);
        const userID = (args[0].toString().replace(reg, ""));
        const author = await userschema_1.default.findOne({ 'user_id': message.author.id });
        const men_user = await userschema_1.default.findOne({ 'user_id': userID });
        const men_member = await index_1.client.users.cache.find((user) => user.id === userID);
        const guild_db = await serverValues_1.default.findOne({ 'server_id': guild?.id });
        const defaultRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.default_role);
        const jailRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role);
        const currentGuild = index_1.client.guilds.cache.get(guild?.id);
        if (currentGuild?.members.cache.get(userID) == undefined || men_member?.bot) {
            message.reply("**You must mention a valid user to arrest.**");
            return;
        }
        var mem = await guild?.members.fetch(userID);
        if (guild_db && defaultRole != undefined && jailRole != undefined) {
            if (author.is_officer) {
                if (author.wanted_lvl < 1 && !mem?.roles.cache.some((role) => role.id === guild_db?.jail_role)) {
                    if (men_user) {
                        var mem = await guild?.members.fetch(userID);
                        if (!mem?.roles.cache.some((role) => role.id === guild_db?.jail_role)) {
                            message.reply("**Alrighty,**" + " " + men_member?.username.toString() + " " + "**was sent to jail.**");
                            await userschema_1.default.findOneAndUpdate({ user_id: userID }, { wanted_level: 0 });
                            mem?.roles.remove(mem.roles.cache);
                            mem?.roles.add(guild_db.jail_role);
                        }
                        else {
                            message.reply("**That user is already serving time.**");
                        }
                    }
                    else {
                        message.reply('**Database error. Contact developer.**');
                    }
                }
            }
            else {
                message.reply("**Hmph! You're not a cop. You can't tell me what to do!**");
            }
        }
        else {
            message.reply("**Server setup is not completed. Use the \'setup\' command for more info.**");
        }
    }
};
