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
const serverValues_1 = __importDefault(require("../../schemas/serverValues"));
const __1 = require("../..");
exports.default = {
    category: "Setup",
    description: "Set the jail role.",
    permissions: ['ADMINISTRATOR'],
    expectedArgs: '<@Role>',
    minArgs: 1,
    syntaxError: {
        english: "**Incorrect usage! Use** `{PREFIX}setdefault {ARGUMENTS}`"
    },
    callback: ({ channel, message, guild, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const reg = new RegExp(/[\\<>@#&!]/g);
        const roleID = (args[0].toString().replace(reg, ""));
        const guild_db = yield serverValues_1.default.findOne({ 'server_id': guild === null || guild === void 0 ? void 0 : guild.id });
        const roleArg = guild === null || guild === void 0 ? void 0 : guild.roles.cache.find(role => role.id === roleID);
        if (guild_db) {
            const currentGuild = __1.client.guilds.cache.get(guild === null || guild === void 0 ? void 0 : guild.id);
            if ((currentGuild === null || currentGuild === void 0 ? void 0 : currentGuild.roles.cache.get(roleArg === null || roleArg === void 0 ? void 0 : roleArg.id)) != undefined && !((_a = currentGuild === null || currentGuild === void 0 ? void 0 : currentGuild.roles.cache.get(roleArg === null || roleArg === void 0 ? void 0 : roleArg.id)) === null || _a === void 0 ? void 0 : _a.managed) && !((_b = currentGuild === null || currentGuild === void 0 ? void 0 : currentGuild.roles.cache.get(roleArg === null || roleArg === void 0 ? void 0 : roleArg.id)) === null || _b === void 0 ? void 0 : _b.permissions.has('ADMINISTRATOR'))) {
                if (guild_db.jail_role == roleID) {
                    message.reply("**The Default role cannot be the same as the Jail role.**");
                }
                else {
                    yield serverValues_1.default.findOneAndUpdate({ server_id: guild === null || guild === void 0 ? void 0 : guild.id }, { default_role: roleArg });
                    message.reply("**Default role set to **" + "<@&" + roleArg + ">");
                }
            }
            else {
                message.reply("**Please mention a valid role to set as Default role.**");
            }
        }
        else {
            message.reply("**Use**" + " " + "`setup`" + " " + "**first.**");
        }
    })
};
