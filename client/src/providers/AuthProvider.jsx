// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const response = await fetch('/api/auth/me', {
//                     method: 'GET',
//                     credentials: 'include',
//                 });

//                 const contentType = response.headers.get('content-type');
//                 if (contentType && contentType.includes('application/json')) {
//                     const data = await response.json();
//                     if (response.ok) {
//                         setUser(data.user);
//                     } else {
//                         setUser(null);
//                     }
//                 } else {
//                     console.error('Expected JSON, received:', contentType);
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error('Error checking authentication:', error);
//                 setUser(null);
//             }
//         };


//         checkAuth();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
