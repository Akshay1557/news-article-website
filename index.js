const mongoose = require("mongoose");
const app = require("./app");

// Use Render environment variables (with fallback for local dev)
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/newsdb";

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(" MongoDB connected");

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
