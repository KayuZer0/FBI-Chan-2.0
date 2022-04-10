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
    description: "Make a user a police officer.",
    expectedArgs: '<@User>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}recruit {ARGUMENTS}`"
    },
    callback: ({ channel, message, args, guild, member }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const reg = new RegExp(/[\\<>@#&!]/g);
        const userID = (args[0].toString().replace(reg, ""));
        const author = yield userschema_1.default.findOne({ 'user_id': message.author.id });
        const men_user = yield userschema_1.default.findOne({ 'user_id': userID });
        const men_member = yield index_1.client.users.cache.find((user) => user.id === userID);
        const guild_db = yield serverValues_1.default.findOne({ 'server_id': guild === null || guild === void 0 ? void 0 : guild.id });
        const defaultRole = yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.default_role)));
        const jailRole = yield ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.jail_role)));
        const currentGuild = index_1.client.guilds.cache.get(guild === null || guild === void 0 ? void 0 : guild.id);
        if ((currentGuild === null || currentGuild === void 0 ? void 0 : currentGuild.members.cache.get(userID)) == undefined || (men_member === null || men_member === void 0 ? void 0 : men_member.bot)) {
            message.reply("**You must mention a valid user to recruit.**");
            return;
        }
        if (message.author.id != '415241379866869771') {
            message.reply("**Only Kayu can use that command.**");
            return;
        }
        if (guild_db && defaultRole != undefined && jailRole != undefined) {
            if (men_user) {
                if (!men_user.is_officer) {
                    yield userschema_1.default.findOneAndUpdate({ user_id: userID }, { is_officer: true });
                    message.reply("**Alrighty," + " " + (men_member === null || men_member === void 0 ? void 0 : men_member.username.toString()) + " " + "is now a police officer.**");
                }
                else {
                    message.reply("**That user is already a police officer.**");
                }
            }
            else {
                message.reply("**Database error.**");
            }
        }
        else {
            message.reply("**Server setup is not completed. Use the**" + " " + "`setup`" + " " + "**command for more info.**");
        }
    })
};
