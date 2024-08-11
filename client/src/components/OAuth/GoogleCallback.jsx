// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const GoogleCallback = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const handleOAuthCallback = async () => {
//             try {
//                 const response = await fetch(`/api/auth/google/callback${window.location.search}`, {
//                     method: 'GET',
//                     credentials: 'include'
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     navigate('/dashboard');
//                 } else {
//                     console.error('Login failed:', data.message);
//                     navigate('/login');
//                 }
//             } catch (error) {
//                 console.error('Error handling OAuth callback:', error);
//                 navigate('/login');
//             }
//         };

//         handleOAuthCallback();
//     }, [navigate]);

//     return <div>Loading...</div>;
// };

// export default GoogleCallback;
