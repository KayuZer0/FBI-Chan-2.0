"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    category: "NSFW",
    description: "View some nice hentai.",
    callback: async ({ channel, message, args }) => {
        const hmtai = require("hmtai");
        const whatType = hmtai.nsfw.gif();
        if (channel.nsfw) {
            const tempEmbed = new discord_js_1.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Here, take some lewds :)')
                .setURL(whatType)
                .setImage(whatType);
            await channel.send({ embeds: [tempEmbed] });
        }
        else {
            const tempEmbed = new discord_js_1.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Hol\' up! No NSFW allowed here!')
                .setImage('https://i.imgur.com/oe4iK5i.gif');
            await channel.send({ embeds: [tempEmbed] });
        }
    }
};
