const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const dotenv = require("dotenv").config();

// cors
app.use(cors())

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const charactersRoutes = require("./routes/characters");
const partiesRoutes = require("./routes/parties");
const classesRoutes = require("./routes/classes");
const rolesRoutes = require("./routes/roles");

app.get("/", (req, res) => {
  res.send("API up")
});

app.use("/characters", charactersRoutes)
app.use("/parties", partiesRoutes)
app.use("/classes", classesRoutes)
app.use("/roles", rolesRoutes)


// Server setup
const PORT = process.env.PORT || 3000;
module.exports = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
