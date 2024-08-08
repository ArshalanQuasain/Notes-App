import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Note } from '../models/note.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

const addNote = asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user._id; // Fetching the user ID from the authenticated user

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const note = await Note.create({
        title,
        content,
        tags: tags || [],
        owner: userId // Assigning the user ID to the note's owner field
    });

    if (!note) {
        throw new ApiError(500, "Failed to create note");
    }

    const createdNote = await Note.findById(note._id);
    if (!createdNote) {
        throw new ApiError(500, "Failed to fetch created note");
    }

    return res.status(201).json(new ApiResponse(201, createdNote, "Note created successfully"));
});

const editNote = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId; 
    const { title, content, tags, isPinned } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const note = await Note.findByIdAndUpdate(
        noteId,
        { $set: { title, content, tags, isPinned } },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Note deleted successfully"));
});

const getAllNotes = asyncHandler(async (req, res) => {
    const user = req.user;

    try {
        const notes = await Note.find({ owner: user._id }).sort({ isPinned: -1 });
        return res.status(200).json(new ApiResponse(200, notes, "All notes retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
});

const updatePinNote = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId; 
    const { isPinned } = req.body;
    if (isPinned === undefined) {
        throw new ApiError(400, "isPinned is required");
    }
    const note = await Note.findByIdAndUpdate(
        noteId,
        { $set: { isPinned } },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
});

const getSearchNotes = asyncHandler(async (req, res) => {
    const user = req.user;
    const query = req.query.q;

    if (!query) {
        throw new ApiError(400, "Query parameter 'q' must be provided");
    }
    try {
        const matchingNotes = await Note.find({
            owner: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
                { tags: { $elemMatch: { $regex: new RegExp(query, "i") } } },
            ],
        }).sort({ isPinned: -1 });

        return res.status(200).json(new ApiResponse(200, matchingNotes, "All matched notes retrieved successfully"));

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            console.error('Error searching notes:', error);
            throw new ApiError(500, "Internal server error");
        }
    }
});




export { addNote, editNote, deleteNote, getAllNotes, updatePinNote , getSearchNotes };
