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
exports.client.on('guildCreate', (guild) => __awaiter(void 0, void 0, void 0, function* () {
    guild.members.fetch().then((members) => __awaiter(void 0, void 0, void 0, function* () {
        members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
            if (!member.user.bot) {
                const user = yield userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
                if (!user) {
                    new userschema_1.default({
                        user_id: member.id,
                        is_officer: false,
                        wanted_lvl: 0,
                        wanted_reason: ' ',
                        release_time: 0,
                        xd_counter: 0
                    }).save();
                }
            }
        }));
    }));
}));
exports.client.on('guildMemberAdd', (member) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
    if (!user && !member.user.bot) {
        new userschema_1.default({
            user_id: member.id,
            is_officer: false,
            wanted_lvl: 0,
            wanted_reason: ' ',
            release_time: 0
        }).save();
    }
}));
exports.client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const Guilds = exports.client.guilds.cache.map(guild => guild.id);
    for (var i = 0; i < Guilds.length; i++) {
        const guild = exports.client.guilds.cache.get(Guilds[i]);
        guild === null || guild === void 0 ? void 0 : guild.members.fetch().then((members) => __awaiter(void 0, void 0, void 0, function* () {
            members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
                if (!member.user.bot) {
                    const user = yield userschema_1.default.findOne({ 'user_id': member.id }).select('user_id').lean();
                    if (user) {
                        const guild_db = yield serverValues_1.default.findOne({ 'server_id': guild.id });
                        if (guild_db) {
                            if (member === null || member === void 0 ? void 0 : member.roles.cache.some(role => role.id === (guild_db === null || guild_db === void 0 ? void 0 : guild_db.jail_role))) {
                                yield userschema_1.default.findOneAndUpdate({ user_id: member.id }, { release_time: 0 });
                                member === null || member === void 0 ? void 0 : member.roles.remove(guild_db.jail_role);
                                member === null || member === void 0 ? void 0 : member.roles.add(guild_db.default_role);
                            }
                        }
                    }
                }
            }));
        }));
    }
    (_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.setActivity("with myself", {
        type: "PLAYING",
    });
    new wokcommands_1.default(exports.client, {
        commandsDir: path_1.default.join(__dirname, 'commands'),
        mongoUri: process.env.MONGO_URI,
        botOwners: ['415241379866869771']
    })
        .setDefaultPrefix('-');
}));
exports.client.on('messageCreate', function (message) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userschema_1.default.findOne({ 'user_id': message.author.id });
        if (user) {
            if (message.content.toLowerCase().includes('xd')) {
                var newXD = user.xd_counter + 1;
                yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { xd_counter: newXD });
            }
        }
        if (user) {
            if (!message.author.bot) {
                const user = yield userschema_1.default.findOne({ 'user_id': message.author.id });
                if (user.wanted_lvl > 0) {
                    const guild_db = yield serverValues_1.default.findOne({ 'server_id': (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id });
                    const user = yield userschema_1.default.findOne({ 'user_id': message.author.id });
                    (_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.remove((_c = message.member) === null || _c === void 0 ? void 0 : _c.roles.cache); // Aici
                    (_d = message.member) === null || _d === void 0 ? void 0 : _d.roles.add(guild_db.jail_role);
                    var time = (user.wanted_lvl * 60000) - 5000;
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { wanted_lvl: 0 });
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { wanted_reason: 'None' });
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: time });
                    message.channel.send("**Apprehended suspect**" + " " + "**" + message.author.username + "**" + "\n" +
                        "**Sentece:**" + " " + ((time + 5000) / 1000) + " " + "seconds of jail.");
                    wait(message, time, user, guild_db);
                }
            }
        }
    });
});
function wait(message, time, user, guild_db) {
    return __awaiter(this, void 0, void 0, function* () {
        setTimeout(function () {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield userschema_1.default.findOne({ 'user_id': message.author.id });
                const guild_db = yield serverValues_1.default.findOne({ 'server_id': (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id });
                if (!((_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.cache.some(role => role.id === guild_db.jail_role))) {
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: 0 });
                    return;
                }
                if (user.release_time <= 0) {
                    (_c = message.member) === null || _c === void 0 ? void 0 : _c.roles.remove(guild_db.jail_role);
                    (_d = message.member) === null || _d === void 0 ? void 0 : _d.roles.add(guild_db.default_role);
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: 0 });
                }
                else {
                    const newTime = user.release_time - 5000;
                    yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { release_time: newTime });
                    wait(message, time, user, guild_db);
                }
            });
        }, 5000);
    });
}
exports.client.on('roleDelete', (role) => __awaiter(void 0, void 0, void 0, function* () {
    const guild_db = yield serverValues_1.default.findOne({ 'server_id': role.guild.id });
    if (guild_db) {
        if (role.id == guild_db.jail_role) {
            yield serverValues_1.default.findOneAndUpdate({ server_id: role.guild.id }, { jail_role: "None" });
        }
        if (role.id == guild_db.default_role) {
            yield serverValues_1.default.findOneAndUpdate({ server_id: role.guild.id }, { default_role: "None" });
        }
    }
}));
exports.client.login(process.env.TOKEN);
