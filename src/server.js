const express = require("express");
const cors = require("cors");
const { userRouter } = require("./user");

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
