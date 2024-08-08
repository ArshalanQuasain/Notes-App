import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Notecard from '../../components/cards/Notecard';
import moment from 'moment';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstances from '../../utils/axiosinstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/emptyCard/EmptyCard';
import listGif from "../../assets/Images/notasks.png";
import noData from "../../assets/Images/noData.jpeg";

function Home() {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShow: false,
    type: 'add',
    data: null
  });

  const [showToastMessage, setToastMessage] = useState({
    isShow: false,
    message: "",
    type: "add"
  });

  const handleEdit = (noteDetail) => {
    setOpenAddEditModel({
      isShow: true,
      data: noteDetail,
      type: "edit",
    });
  };

  const showToastMsg = (message, type) => {
    setToastMessage({
      isShow: true,
      message,
      type
    });
  };

  const handleCloseToast = () => {
    setToastMessage({
      isShow: false,
      message: "",
      type: "add"
    });
  };

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false); 
  const [islogin , setislogin] = useState(false);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstances.get('/current-user');
      if (response.data && response.data.data && response.data.data._id) {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstances.get('/all-notes');
      if (response.data && response.data.data) {
        setAllNotes(response.data.data);
      }
    } catch (error) {
      console.log("An unexpected error occurred while fetching data. Please try again.");
    }
  };

  const deleteNotes = async (data) => {
    const noteId = data._id; 
    try {
      const response = await axiosInstances.delete(`/delete-note/${noteId}`);
      if (response.status === 200) {
        showToastMsg("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.error('Error object:', error);
      if (error.response && error.response.message) { 
        console.log(error.response.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstances.get('/search-notes', {
        params: {
          q: query  
        }
      });
      if (response.data && response.data.data ) {
        setIsSearch(true);
        setAllNotes(response.data.data); 
      }
    } catch (error) {
      console.error('Error object:', error);
      if (error.response && error.response.message) { 
        console.log(error.response.message); 
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstances.put(`/update-pin-note/${noteId}`, {
        isPinned: !noteData.isPinned
      });
  
      if (response.data && response.data.data) {
        const toastType = noteData.isPinned ? "error" : "edit";
        const toastMsg = noteData.isPinned ? "UNPINNED" : "PINNED";
        showToastMsg(toastMsg , toastType); 
        getAllNotes();
      } else {
        showToastMsg("Failed to update pin status", "delete");
      }
    } catch (error) {
      console.error('Error updating pin status:', error);
      showToastMsg("An error occurred while updating pin status", "delete");
    }
  };
  
  const handleClearSearch = () => {
    setIsSearch(false) ;
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} showToastMsg={showToastMsg}/>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item) => (
              <Notecard
                key={item._id}
                title={item.title}
                date={moment(item.createdAt).format('Do MMM YYYY')}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNotes(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
            imgSrc={isSearch? noData : listGif} 
            message={isSearch? `Oops no notes Found with your query` :`Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`}
          />
        )}
      </div>
      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModel({
            isShow: true,
            type: 'add',
            data: null
          });
        }}
      >
        <MdAdd className='text-2xl text-white' />
      </button>

      <Modal
        isOpen={openAddEditModel.isShow}
        onRequestClose={() => setOpenAddEditModel({
          isShow: false,
          type: 'add',
          data: null
        })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,.2)'
          },
        }}
        contentLabel=""
        className="w-full max-w-4xl bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({
              isShow: false,
              type: 'add',
              data: null
            });
          }}
          getAllNotes={getAllNotes}
          showToastMsg={showToastMsg}
        />
      </Modal>
      <Toast
        isShow={showToastMessage.isShow}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
