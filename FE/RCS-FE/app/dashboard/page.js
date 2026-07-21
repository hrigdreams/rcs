'use client'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import Header from '../../components/Header'
import UserSidebar from '../../components/UserSidebar';
import UserBookings from '../../components/UserBookings'

const UserDashboard = () => {
  const { user } = useAuth();
  const userId = user?.data?.id  
  const [profile, setProfile] = useState({
    name: user?.data?.username || 'User',
    email: user?.data?.email || 'user@test.com',
    role: user?.data?.role || 'test-user',
  })

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <UserSidebar />
        <div className="flex-1 p-6 text-black">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>

          {userId && <UserBookings userId={userId} userRole={user?.data?.role || user?.role} />}
        </div>
      </div>
    </>
  )
}

export default UserDashboard