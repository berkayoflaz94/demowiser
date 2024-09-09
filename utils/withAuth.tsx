"use client"; // Bu ifade, bu dosyanın istemci tarafında çalışacağını belirtir

import { useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    return (props: P) => {

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
                window.location.href = '/login';
                return;
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
