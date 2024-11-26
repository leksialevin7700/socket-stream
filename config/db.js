const mongoose = require("mongoose");

// Define the connectDB function
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chatapp');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

// Export the function
module.exports = connectDB;
