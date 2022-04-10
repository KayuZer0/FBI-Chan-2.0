import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    user_id: {type: String, required: true, unique: true},
    is_officer: {type: Boolean, required: true, default: false},
    wanted_lvl: {type: Number, required: true, default: 0},
    wanted_reason: {type: String, required: true, default: ' '},
    release_time: {type: Number, required: true, default: 0},
    xd_counter: {type: Number, default: 0}
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('users', schema, 'users')