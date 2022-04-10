"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const index_1 = require("../../index");
const serverValues_1 = __importDefault(require("../../schemas/serverValues"));
exports.default = {
    category: "Wanted",
    description: "Check a user's wanted level",
    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}mdc {ARGUMENTS}`"
    },
    callback: ({ channel, message, args, guild }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const reg = new RegExp(/[\\<>@#&!]/g);
        const userID = (args[0].toString().replace(reg, ""));
        const men_user = yield userschema_1.default.findOne({ 'user_id': userID });
        const author = yield userschema_1.default.findOne({ 'user_id': message.author.id });
        const men_member = index_1.client.users.cache.find((user) => user.id === userID);
        const guild_db = yield serverValues_1.default.findOne({ 'server_id': guild === null || guild === void 0 ? void 0 : guild.id });
        const defaultRole = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.default_role));
        const jailRole = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.jail_role));
        const currentGuild = index_1.client.guilds.cache.get(guild === null || guild === void 0 ? void 0 : guild.id);
        if ((currentGuild === null || currentGuild === void 0 ? void 0 : currentGuild.members.cache.get(userID)) == undefined) {
            message.reply("**You must mention a valid user to give wanted to.**");
            return;
        }
        var mem = yield (guild === null || guild === void 0 ? void 0 : guild.members.fetch(userID));
        var auth = yield (guild === null || guild === void 0 ? void 0 : guild.members.fetch(message.author.id));
        if (guild_db && defaultRole != undefined && jailRole != undefined) {
            if (author.is_officer) {
                if (author.wanted_lvl < 1 && !(auth === null || auth === void 0 ? void 0 : auth.roles.cache.some((role) => role.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.jail_role)))) {
                    if (men_user) {
                        const isOfficerRaw = men_user.is_officer.toString();
                        const isOfficer = isOfficerRaw.charAt(0).toUpperCase() + isOfficerRaw.slice(1);
                        var mess = "**Username:**" + " " + (men_member === null || men_member === void 0 ? void 0 : men_member.username) + "\n" + "**Is officer?:**" + " " + isOfficer + "\n" + "**Wanted Level:**" + " " + men_user.wanted_lvl.toString();
                        if (men_user.wanted_lvl > 0) {
                            mess += "\n" + "**Wanted for:**" + " " + men_user.wanted_reason.toString();
                        }
                        message.reply(mess);
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
    })
};
