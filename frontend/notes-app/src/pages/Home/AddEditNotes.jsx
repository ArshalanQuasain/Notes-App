import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstances from '../../utils/axiosinstance';

function AddEditNotes({ noteData, getAllNotes, type, onClose, showToastMsg }) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState("");

  const addNewNote = async () => {
    try {
      const response = await axiosInstances.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.data) {
        showToastMsg("Note Added Successfully", "edit");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error('Error object:', error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.message) {
          setError(responseData.message);
        } else if (responseData.errors && responseData.errors.length > 0) {
          setError(responseData.errors.join(', '));
        } else {
          setError("An unexpected error occurred");
        }
      } else if (error.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstances.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.data) {
        showToastMsg("Note Updated Successfully", "edit");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error('Error object:', error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.message) {
          setError(responseData.message);
        } else if (responseData.errors && responseData.errors.length > 0) {
          setError(responseData.errors.join(', '));
        } else {
          setError("An unexpected error occurred");
        }
      } else if (error.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");
    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative'>
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-300' onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go To Gym at 5'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          className='text-xs text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}

export default AddEditNotes;
