import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema(
    {
        title: {
            type: String, 
            required: true,
        },
        content: {
            type: String, 
            required: true,
        },
        tags: {
            type: [String], 
            default: [],
        },
        isPinned: {
            type: Boolean, 
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true 
        }
    },
    {
        timestamps: true 
    }
);

export const Note = mongoose.model("Note", noteSchema);
