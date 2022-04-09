"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    category: "NSFW",
    description: "View some nice hentai.",
    callback: async ({ channel, message, args }) => {
        const tempEmbed = new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Here\'s a list of commands:')
            .addField('Wanted System Commands:', 'ㅤwanted <@User> <Level> <Reason> - Give a user a wanted level. \n ㅤarrest <@User> - Directly arrest a user. \n ㅤmdc <@User> - Check a user\'s wanted level. \n ㅤclear <@User> - Clear a user\'s wanted level. \n ㅤfree <@User> - Free a user from jail.', false)
            .addField('Hentai API Commands:', 'ㅤhentai - Sends a random vanilla hentai imageURL. \n ㅤhentaigif - Basically an animated image, so yes :3 \n ㅤblowjob - 	Basically an image of a girl sucking! \n ㅤboobjob - So soft, round ... gentle ... love it! \n ㅤfeet - So you like smelly feet huh? \n ㅤneko - NSFW Neko Girls (Cat Girls) \n ㅤpussy - The genitals of a female. \n ㅤsolo - You like lewd solo? \n ㅤyuri - What about cute Les?~', false)
            .addField('Setup Commands [Admins]:', 'ㅤsetup - Perform the server setup. \n ㅤsetjail <@Role> - Set the server Jail role. \n ㅤsetdefault <@Role> - Set the server Default role.', false)
            .setFooter({ text: 'ㅤUse /prefix to view/set your server\'s prefix.' });
        await channel.send({ embeds: [tempEmbed] });
    }
};
