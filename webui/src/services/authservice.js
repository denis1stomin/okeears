class AuthService {
    getToken() {
        return localStorage.getItem('token');
    }

    checkAuthorization() {
        // if browser URL contains token:
        //     setToken()
        //     removeTokenFromURL()
        // else
        //     throw exception Unauthorized or start authorization flow again
    }

    setToken(token) {
    }
}

// Single instance pattern
export default new AuthService();
