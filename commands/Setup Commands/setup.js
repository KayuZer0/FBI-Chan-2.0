"use strict";
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
    callback: async ({ channel, message, guild }) => {
        const server = await serverValues_1.default.findOne({ 'server_id': guild?.id });
        if (!server) {
            new serverValues_1.default({
                server_id: guild?.id,
                jail_role: "None",
                default_role: "None",
            }).save();
            message.reply("**Server added to database. Run setup again.**");
        }
        else {
            const guild_db = await serverValues_1.default.findOne({ 'server_id': guild?.id });
            const defaultRole = message.guild?.roles.cache.find(x => x.id === guild_db?.default_role);
            const jailRole = message.guild?.roles.cache.find(x => x.id === guild_db?.jail_role);
            var jRole;
            var dRole;
            if (jailRole == undefined) {
                jRole = "Not set";
                await serverValues_1.default.findOneAndUpdate({ server_id: guild?.id }, { jail_role: "None" });
            }
            else {
                jRole = "<@&" + server?.jail_role + ">";
            }
            if (defaultRole == undefined) {
                dRole = "Not set";
                await serverValues_1.default.findOneAndUpdate({ server_id: guild?.id }, { default_role: "None" });
            }
            else {
                dRole = "<@&" + server?.default_role + ">";
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
    }
};
