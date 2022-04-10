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
const discord_js_1 = require("discord.js");
const serverValues_1 = __importDefault(require("../../schemas/serverValues"));
exports.default = {
    category: "Setup",
    description: "The server setup command.",
    permissions: ['ADMINISTRATOR'],
    callback: ({ channel, message, guild }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const server = yield serverValues_1.default.findOne({ 'server_id': guild === null || guild === void 0 ? void 0 : guild.id });
        if (!server) {
            new serverValues_1.default({
                server_id: guild === null || guild === void 0 ? void 0 : guild.id,
                jail_role: "None",
                default_role: "None",
            }).save();
            message.reply("**Server added to database. Run setup again.**");
        }
        else {
            const guild_db = yield serverValues_1.default.findOne({ 'server_id': guild === null || guild === void 0 ? void 0 : guild.id });
            const defaultRole = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.default_role));
            const jailRole = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(x => x.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.jail_role));
            var jRole;
            var dRole;
            if (jailRole == undefined) {
                jRole = "Not set";
                yield serverValues_1.default.findOneAndUpdate({ server_id: guild === null || guild === void 0 ? void 0 : guild.id }, { jail_role: "None" });
            }
            else {
                jRole = "<@&" + (server === null || server === void 0 ? void 0 : server.jail_role) + ">";
            }
            if (defaultRole == undefined) {
                dRole = "Not set";
                yield serverValues_1.default.findOneAndUpdate({ server_id: guild === null || guild === void 0 ? void 0 : guild.id }, { default_role: "None" });
            }
            else {
                dRole = "<@&" + (server === null || server === void 0 ? void 0 : server.default_role) + ">";
            }
            const tempEmbed = new discord_js_1.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Here\'s your server\'s setup::')
                .addField('Jail Role:', jRole, false)
                .addField('Default Role:', dRole, false)
                .addField('The Jail role is the role given to users that are sent to jail.', 'Set it using the \'setjail\' command', false)
                .addField('The Default role is the role given to users after leaving jail.', 'Set it using the \'sedefault\' command', false);
            message.reply({ embeds: [tempEmbed] });
        }
    })
};
