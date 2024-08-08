import React from 'react';
import { initials } from '../../utils/helper';

function ProfileInfo({ userInfo, onLogout }) {
   
    if (!userInfo) {
        return <div></div>;
    }

    return (
        <div className="flex items-center gap-3">
            <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
                {initials(userInfo.fullName)}
            </div>

            <div>
                <div className="hidden sm:block text-sm font-medium">{userInfo.fullName}</div>
                <button className='text-sm text-slate-700 underline hover:text-slate-950' onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default ProfileInfo;
