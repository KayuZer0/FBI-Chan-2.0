import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    server_id: {type: String, required: true, unique: true},
    default_role: {type: String, required: true, default: 'None'},
    jail_role: {type: String, required: true, default: 'None'},
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('serverValues', schema, 'serverValues')