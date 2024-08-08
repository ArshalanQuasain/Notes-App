import { Router } from 'express';
import {
    changeCurrentUserPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails
} from '../controller/user.controller.js';

import { addNote, editNote, deleteNote, getAllNotes, getSearchNotes, updatePinNote } from '../controller/note.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// User routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Note routes
router.route('/add-note').post(verifyJWT, addNote);
router.route('/all-notes').get(verifyJWT, getAllNotes);
router.route('/edit-note/:noteId').put(verifyJWT, editNote);
router.route('/delete-note/:noteId').delete(verifyJWT, deleteNote);
router.route('/update-pin-note/:noteId').put(verifyJWT, updatePinNote); // Assuming update-pin-note should be a PUT request

// Search notes route
router.route('/search-notes').get(verifyJWT, getSearchNotes);

export default router;
