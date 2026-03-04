export const getSchoolld = () => {
  const userRaw = localStorage.getItem('user');
  
  if (!userRaw) return null;

  try {
    const userData = JSON.parse(userRaw);
    // Log diletakkan SEBELUM return
    console.log('User Data:', userData); 
    return userData;
  } catch (error) {
    console.error("Gagal parse user data dari localStorage", error);
    return null;
  }
};