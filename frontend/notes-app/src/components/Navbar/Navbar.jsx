import React, { useState } from 'react'
import ProfileInfo from '../cards/ProfileInfo'
import {  useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';
import axiosInstances from '../../utils/axiosinstance';

function Navbar({userInfo , onSearchNote , handleClearSearch , showToastMsg}) {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
        showToastMsg("You are logged out", "error");
        await axiosInstances.post("/logout"); 
        localStorage.removeItem("accessToken");
        navigate('/login');
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
  const handleSearch = ()=> {
    if (searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = ()=>{
    setSearchQuery("")
    handleClearSearch();
  }
  return (
    <div className="bg-white flex item-cener justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2"> Notes</h2>
      {userInfo &&<SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value)
        }}
        handleSearch= {handleSearch}
        onClearSearch = {onClearSearch}
      />}
      <ProfileInfo userInfo= {userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar
