import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiousstance'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/ToastMessages/Toast'
import EMptyCard from '../../components/Cards/EMptyCard'


const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [isSearch, setIsSearch] = useState(false);

  const updateIsPinned = async (notedata) => {
    const noteId = notedata._id;

    try {

      const response = await axiosInstance.put("/edit-note-pinned/" + noteId, {
       "isPinned":!notedata.noteId
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        
      }

    } catch (error) {
      
        console.log("Error");
      }
    }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }


  const onSearchNote = async (query) => {

    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error);
    }

  }

  const [showTostMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: ""
    });
  };

  const handlEdit = (noteDetail) => {
    setOpenAddEditModal({ isShown: true, data: noteDetail, type: "edit" });
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.note) {
        setAllNotes(response.data.note);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);

      if (response.data && response.data.note) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      if (error.message && error.response.data && error.response.data.message) {

        Console.log("Unexpected error occurred")
      }
    }
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar userInfo={userInfo} onSearchQuery={onSearchNote} handleClearSearch={handleClearSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handlEdit(item)}
                onDelete={() => {
                  deleteNote(item)
                }}
                onPinNote={() => { updateIsPinned(item)}}
              />
            ))}
          </div>
        ) : (
          <EMptyCard imgSrc="/note.jpg"></EMptyCard>
        )}

        {/* Floating Add Button */}
        <button
          title="Add Note"
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl shadow-lg transition duration-300"
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-2xl" />
        </button>

        {/* Modal */}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
          contentLabel=""
          className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
          <AddEditNotes
            noteData={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }}
            type={openAddEditModal.type}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
          />
        </Modal>

        {/* Toast Message */}
        <Toast
          isShown={showTostMsg.isShown}
          message={showTostMsg.message}
          type={showTostMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </div>
  )
}

export default Home;
