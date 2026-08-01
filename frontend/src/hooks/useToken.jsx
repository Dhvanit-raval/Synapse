import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
            return null;
        }

        let parsedToken = tokenString;

        try {
            parsedToken = JSON.parse(tokenString);
        } catch {
            parsedToken = tokenString;
        }

        const token = typeof parsedToken === 'string'
            ? parsedToken
            : parsedToken?.token;

        if (!token) {
            return null;
        }

        if (typeof token === 'string' && token.split('.').length === 3) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                    return null;
                }
            } catch {
                localStorage.removeItem('token');
                return null;
            }
        }

        return token;
    };

    const [token, setToken] = useState(getToken);

    const saveToken = userToken => {
        const normalizedToken = typeof userToken === 'string'
            ? { token: userToken }
            : userToken;

        const tokenValue = normalizedToken?.token;

        if (tokenValue) {
            localStorage.setItem('token', JSON.stringify(normalizedToken));
            setToken(tokenValue);
        } else {
            localStorage.removeItem('token');
            setToken(null);
        }
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        setToken: saveToken,
        token,
        removeToken
    };
}