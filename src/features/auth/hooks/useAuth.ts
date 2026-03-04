// import axios from 'axios';
// import { useState } from 'react';

// const API_AUTH = "http://localhost:5010/auth";

// export const useAuth = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (payload: any) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post(`${API_AUTH}/login`, payload);
//       return res.data; // Mengembalikan { success: true, token, user }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (formData: FormData) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post(`${API_AUTH}/register`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       return res.data;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { login, register, isLoading };
// };


// hooks/useAuth.ts
// hooks/useAuth.ts
import axios from 'axios';
import { useCallback, useState } from 'react';
import { getToken, saveToken } from '../utils'; // IMPORT INI WAJIB
import { storage } from "@itokun99/secure-storage"; // IMPORT INI WAJIB

// const API_AUTH = "http://localhost:5010/auth";
const API_AUTH = "https://be-school.kiraproject.id/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Gunakan getToken() bawaan agar sinkron dengan Vokadash
  const isAuthenticated = useCallback(() => Boolean(getToken()), []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_AUTH}/login`, data);
      
      // Sesuai respon login Anda: res.data.token
      const token = res.data.token;
      const user = res.data.user;
      console.log('res', res.data)

      if (token) {
        // GUNAKAN saveToken agar terbaca oleh Vokadash
        saveToken(String(token));
        
        // Simpan user ke localStorage jika Vokadash membutuhkannya
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_profile', JSON.stringify(user));
        // Opsional: duplikasi ke key 'token' biasa jika perlu
        localStorage.setItem('token', token);
      }
      
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Bersihkan semua tempat penyimpanan
    storage.delete("auth.token");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.location.href = '/auth/login';
  }, []);

  // Ambil data user yang tersimpan
  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  };

  return { 
    login, 
    isAuthenticated, 
    logout, 
    user: getUser(), // Gunakan key 'user' (bukan 'use')
    isLoading,
    verifyPin: async (email: string, pin: string) => axios.post(`${API_AUTH}/verify-pin`, { email, pin }),
    forgotPassword: async (email: string) => axios.post(`${API_AUTH}/forgot-password`, { email }),
    resetPassword: async (p: string, t: string) => axios.post(`${API_AUTH}/reset-password`, { token: t, newPassword: p }),
  };
};

// hooks/useSchoolCreation.ts
export const useSchoolCreation = () => {
  const register = async (payload: any) => {
    const formData = new FormData();
    
    formData.append('npsn', payload.npsn || "");
    formData.append('schoolName', payload.schoolName || "");
    formData.append('address', payload.address || "-");
    formData.append('email', payload.email || "");
    formData.append('password', payload.password || "");
    formData.append('adminName', payload.adminName || "");
    formData.append('latitude', payload.latitude?.toString() || "0");
    formData.append('longitude', payload.longitude?.toString() || "0");
    
    // UBAH DISINI: Sesuaikan dengan upload.single('logo') di backend
    if (payload.file) {
      formData.append('logo', payload.file); 
    }

    return await axios.post("https://be-school.kiraproject.id/auth/register", formData, {
    // return await axios.post("http://localhost:5005/auth/register", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  return { register };
};