"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const wokcommands_1 = __importDefault(require("wokcommands"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const serverValues_1 = __importDefault(require("./schemas/serverValues"));
const userschema_1 = __importDefault(require("./schemas/userschema"));
dotenv_1.default.config();
exports.client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS
    ]
});
exports.client.on('guildCreate', async (guild) => {
    guild.members.fetch().then(async (members) => {
        members.forEach(async (member) => {
            if (!member.user.bot) {
                const user = await userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
                if (!user) {
                    new userschema_1.default({
                        user_id: member.id,
                        is_officer: false,
                        wanted_lvl: 0,
                        wanted_reason: ' ',
                        release_time: 0
                    }).save();
                }
            }
        });
    });
});
exports.client.on('guildMemberAdd', async (member) => {
    const user = await userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
    if (!user && !member.user.bot) {
        new userschema_1.default({
            user_id: member.id,
            is_officer: false,
            wanted_lvl: 0,
            wanted_reason: ' ',
            release_time: 0
        }).save();
    }
});
exports.client.on('ready', async () => {
    const Guilds = exports.client.guilds.cache.map(guild => guild.id);
    for (var i = 0; i < Guilds.length; i++) {
        const guild = exports.client.guilds.cache.get(Guilds[i]);
        guild?.members.fetch().then(async (members) => {
            members.forEach(async (member) => {
                if (!member.user.bot) {
                    const user = await userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
                    if (user) {
                        const guild_db = await serverValues_1.default.findOne({ 'server_id': guild.id });
                        if (guild_db) {
                            if (member?.roles.cache.some(role => role.id === guild_db?.jail_role)) {
                                await userschema_1.default.findOneAndUpdate({ user_id: member.id }, { release_time: 0 });
                                member?.roles.remove(guild_db.jail_role);
                                member?.roles.add(guild_db.default_role);
                            }
                        }
                    }
                }
            });
        });
    }
    exports.client.user?.setActivity("with myself", {
        type: "PLAYING",
    });
    new wokcommands_1.default(exports.client, {
        commandsDir: path_1.default.join(__dirname, 'commands'),
        mongoUri: process.env.MONGO_URI,
        botOwners: ['415241379866869771']
    })
        .setDefaultPrefix('-');
});
exports.client.on('messageCreate', async function (message) {
    if (!message.author.bot) {
        const user = await userschema_1.default.findOne({ 'user_id': message.author.id });
        if (user.wanted_lvl > 0) {
            const guild_db = await serverValues_1.default.findOne({ 'server_id': message.guild?.id });
            const user = await userschema_1.default.findOne({ 'user_id': message.author.id });
            message.member?.roles.remove(message.member?.roles.cache); // Aici
            message.member?.roles.add(guild_db.jail_role);
            var time = (user.wanted_lvl * 60000) - 5000;
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { wanted_lvl: 0 });
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { wanted_reason: 'None' });
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: time });
            message.channel.send("**Apprehended suspect**" + " " + "**" + message.author.username + "**" + "\n" +
                "**Sentece:**" + " " + ((time + 5000) / 1000) + " " + "seconds of jail.");
            wait(message, time, user, guild_db);
        }
    }
});
async function wait(message, time, user, guild_db) {
    setTimeout(async function () {
        const user = await userschema_1.default.findOne({ 'user_id': message.author.id });
        const guild_db = await serverValues_1.default.findOne({ 'server_id': message.guild?.id });
        if (!message.member?.roles.cache.some(role => role.id === guild_db.jail_role)) {
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: 0 });
            return;
        }
        if (user.release_time <= 0) {
            message.member?.roles.remove(guild_db.jail_role);
            message.member?.roles.add(guild_db.default_role);
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: 0 });
        }
        else {
            const newTime = user.release_time - 5000;
            await userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: newTime });
            wait(message, time, user, guild_db);
        }
    }, 5000);
}
exports.client.on('roleDelete', async (role) => {
    const guild_db = await serverValues_1.default.findOne({ 'server_id': role.guild.id });
    if (guild_db) {
        if (role.id == guild_db.jail_role) {
            await serverValues_1.default.findOneAndUpdate({ server_id: role.guild.id }, { jail_role: "None" });
        }
        if (role.id == guild_db.default_role) {
            await serverValues_1.default.findOneAndUpdate({ server_id: role.guild.id }, { default_role: "None" });
        }
    }
});
exports.client.login(process.env.TOKEN);
