// Default admin credentials
const defaultAdminCredentials = {
    username: 'admin',
    password: 'admin123' // Simple plain text password
};

// Function to initialize admin credentials
const initializeAdminCredentials = async () => {
    try {
        console.log('Admin credentials initialized');
        return true;
    } catch (error) {
        console.error('Error initializing admin credentials:', error);
        return false;
    }
};

module.exports = {
    defaultAdminCredentials,
    initializeAdminCredentials
};