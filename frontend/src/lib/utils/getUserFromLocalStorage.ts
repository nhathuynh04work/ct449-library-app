export function getUserFromLocalStorage() {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
}
