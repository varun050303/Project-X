import React from 'react';
import { useAuth } from '../providers/AuthProvider';

const Home = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>You need to log in</div>;
    }

    return (
        <div>
            Welcome, {user.name}!
        </div>
    );
};

export default Home;
