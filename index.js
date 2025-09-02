const mongoose = require("mongoose");
const app = require("./app");   

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/newsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(" MongoDB connected");

  // Start server
  
  app.listen(8080, () => {
    console.log("server is listening port 8080");
  });
})
.catch(err => {
  console.error(" MongoDB connection error:", err);
});
