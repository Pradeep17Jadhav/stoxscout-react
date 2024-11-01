import { HttpMethod, request } from ".";

const loginAPI = async (username: string, password: string) => {
    const response = await request('http://localhost:4000/api/login', {
        method: HttpMethod.POST,
        body: { username, password }
    });
    if (response.status === 204) return null;
    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid username or password.');
    }
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

const logoutAPI = async () => {
    const response = await request('http://localhost:4000/api/logout', {
        method: HttpMethod.POST,
    });
    if (response.status === 204) return null;
    if (response.status === 401) {
        throw new Error('Unauthorized: You must be logged in to logout.');
    }
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    return response.json();
};

export {
    loginAPI,
    logoutAPI
}