import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <div className='w-40 sm:w-80  flex items-center px-4 bg-slate-100 rounded-md'>
            <input
                type='text'
                placeholder='Search Notes'
                className='w-full  text-xs bg-transparent py-1 outline-none'
                value={value}
                onChange={onChange}
            />
            {value && (
                <IoMdClose
                    className='text-slate-500 text-xl cursor-pointer hover:text-black'
                    onClick={onClearSearch}
                />
            )}
            <FaSearch
                className='text-slate-400 cursor-pointer hover:text-black ml-2'
                onClick={handleSearch}
            />
        </div>
    );
};

export default SearchBar;
