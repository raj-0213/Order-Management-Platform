const express = require("express");
const http = require("http");
const db = require("./database/config");
const { sequelize } = require('./models'); 
const cors = require('cors');
// console.log("Sequelize instance:", sequelize);

const {productRoutes} = require("./routes");
const {cartRoutes} = require("./routes");
const {orderRoutes} = require("./routes");
const {userRoutes} = require("./routes");


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost"; 

app.use(express.json());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: false }));
app.use(cors({
  origin: 'http://localhost:3000', // Make sure this matches the frontend origin exactly
  methods: 'GET,POST,PUT,DELETE',  // Allow the necessary methods
  allowedHeaders: 'Content-Type,Authorization', // Allow necessary headers
  credentials: true, // Allow cookies (if needed)
}));

app.use("/product",productRoutes);
app.use("/cart",cartRoutes);
app.use("/order",orderRoutes);
app.use("/user",userRoutes);


app.get("/", (req, res) => {
  res.send("Server is running");
});

sequelize.sync({ force: false }).then(() => {
  console.log("Database Synced");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

