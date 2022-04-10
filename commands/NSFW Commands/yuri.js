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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    category: "NSFW",
    description: "View some nice hentai.",
    callback: ({ channel, message, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const hmtai = require("hmtai");
        const whatType = hmtai.nsfw.yuri();
        if (channel.nsfw) {
            const tempEmbed = new discord_js_1.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Here, take some lewds :)')
                .setURL(whatType)
                .setImage(whatType);
            yield channel.send({ embeds: [tempEmbed] });
        }
        else {
            const tempEmbed = new discord_js_1.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Hol\' up! No NSFW allowed here!')
                .setImage('https://i.imgur.com/oe4iK5i.gif');
            yield channel.send({ embeds: [tempEmbed] });
        }
    })
};
