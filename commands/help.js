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
        const tempEmbed = new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Here\'s a list of commands:')
            .addField('Meme Commands:', 'ㅤecksdee - View your XD counter.', false)
            .addField('Wanted System Commands:', 'ㅤwanted <@User> <Level> <Reason> - Give a user a wanted level. \n ㅤarrest <@User> - Directly arrest a user. \n ㅤmdc <@User> - Check a user\'s wanted level. \n ㅤclear <@User> - Clear a user\'s wanted level. \n ㅤfree <@User> - Free a user from jail.', false)
            .addField('NSFW API Commands:', 'ㅤhentai - Sends a random vanilla hentai imageURL. \n ㅤhentaigif - Basically an animated image, so yes :3 \n ㅤblowjob - 	Basically an image of a girl sucking! \n ㅤboobjob - So soft, round ... gentle ... love it! \n ㅤneko - NSFW Neko Girls (Cat Girls) \n ㅤpussy - The genitals of a female. \n ㅤsolo - You like lewd solo? \n ㅤyuri - What about cute Les?~', false)
            .addField('Setup Commands [Admins]:', 'ㅤsetup - Perform the server setup. \n ㅤsetjail <@Role> - Set the server Jail role. \n ㅤsetdefault <@Role> - Set the server Default role.', false)
            .setFooter({ text: 'ㅤUse /prefix to view/set your server\'s prefix.' });
        yield channel.send({ embeds: [tempEmbed] });
    })
};
