'use client'
import React, { useState } from 'react'
import AdminAuth from '../../../components/AdminAuth'
import { useAuth } from '@/context/AuthContext';
import Header from '../../../components/Header'
import AdminSidebar from '../../../components/AdminSidebar'


const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.data?.username || 'Admin User',
    email: user?.data?.email || 'admin@example.com',
    role: user?.data?.role || 'admin',
  })

  return (
    <>
      <AdminAuth>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-6 text-black">
          <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
        </div>
      </div>
      </AdminAuth>
    </>
  )
}

export default AdminProfile