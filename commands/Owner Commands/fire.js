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
    description: "Make a user a police officer.",
    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}recruit {ARGUMENTS}`"
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
            message.reply("**You must mention a valid user to fire.**");
            return;
        }
        if (message.author.id != '415241379866869771') {
            message.reply("**Only Kayu can use that command.**");
            return;
        }
        if (guild_db && defaultRole != undefined && jailRole != undefined) {
            if (men_user) {
                if (men_user.is_officer) {
                    await userschema_1.default.findOneAndUpdate({ user_id: userID }, { is_officer: false });
                    message.reply("**Alrighty" + " " + men_member?.username.toString() + ", you're fired.**");
                }
                else {
                    message.reply("**That user is not a police officer.**");
                }
            }
            else {
                message.reply("**Database error.**");
            }
        }
        else {
            message.reply("**Server setup is not completed. Use the**" + " " + "`setup`" + " " + "**command for more info.**");
        }
    }
};
