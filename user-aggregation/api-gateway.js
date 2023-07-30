// api-gateway.js

const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/login/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user data from user service
    const userResponse = await axios.get(`http://auth-srv/api/users/${userId}`);
    const user = userResponse.data;

    // Fetch image data from image service using the obtained user id
    const imageResponse = await axios.get(`http://storage-srv/api/storage/${user.id}`);
    const image = imageResponse.data;

    const response = {
      user: user,
      image: image,
    };

    res.json(response);
  } catch (error) {
    console.error("Error during aggregation:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`);
});