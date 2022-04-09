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
    description: "Give a user a wanted level.",
    expectedArgs: '<@User> <WantedLevel> <Reason>',
    minArgs: 3,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}wanted {ARGUMENTS}`"
    },
    callback: async ({ channel, message, args, guild }) => {
        const reg = new RegExp(/[\\<>@#&!]/g);
        const userID = (args[0].toString().replace(reg, ""));
        var wantedLevel = parseInt(args[1]);
        var reason = args.slice(2).toString().replace(/,/g, ' ');
        const men_user = await userschema_1.default.findOne({ 'user_id': userID });
        const author = await userschema_1.default.findOne({ 'user_id': message.author.id });
        const men_member = index_1.client.users.cache.find((user) => user.id === userID);
        const guild_db = await serverValues_1.default.findOne({ 'server_id': guild?.id });
        const defaultRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.default_role);
        const jailRole = await message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role);
        // if (userID == '415241379866869771')
        // {
        //     message.reply("**I can't give Kayu himself a wanted level.**")
        //     return
        // }
        const currentGuild = index_1.client.guilds.cache.get(guild?.id);
        if (currentGuild?.members.cache.get(userID) == undefined || men_member?.bot) {
            message.reply("**You must mention a valid user to give wanted to.**");
            return;
        }
        var mem = await guild?.members.fetch(userID);
        if (guild_db && defaultRole != undefined && jailRole != undefined) {
            if (author.is_officer) {
                if (author.wanted_lvl < 1 && !mem?.roles.cache.some((role) => role.id === guild_db?.jail_role)) {
                    if (men_user) {
                        if (men_user.wanted_lvl > 0) {
                            message.reply("**That user is already wanted!**");
                        }
                        else {
                            if (wantedLevel.toString() == 'NaN') {
                                message.reply("**Wanted level must be a valid number.**");
                            }
                            else if (wantedLevel > 5 || wantedLevel < 1) {
                                message.reply('**Wanted level must be between 1-5**');
                            }
                            else {
                                await userschema_1.default.findOneAndUpdate({ user_id: userID }, { wanted_lvl: wantedLevel });
                                reason = reason.charAt(0).toUpperCase() + reason.slice(1);
                                await userschema_1.default.findOneAndUpdate({ user_id: userID }, { wanted_reason: reason });
                                message.reply("**On the lookout for suspect:**" + " " + men_member?.username.toString() + "\n" +
                                    "**Wanted level:**" + " " + wantedLevel.toString() + "\n" +
                                    "**Wanted for:**" + " " + reason);
                            }
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
