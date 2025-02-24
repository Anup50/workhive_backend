require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const RoleRouter = require("./routes/RoleRoute");
const UserRouter = require("./routes/UserRoute");
const EmployerRouter = require("./routes/EmployerRoute");
const JobRouter = require("./routes/JobRouter");
const JobSeekerRouter = require("./routes/JobSeekerRoute");
const ResumeRouter = require("./routes/ResumeRoute");
const ApplicationRouter = require("./routes/ApplicationRoute");
const BookmarkRouter = require("./routes/BookmarkRoute");
const SearchRouter = require("./routes/SearchRoute");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/role", RoleRouter);
app.use("/api/user", UserRouter);
app.use("/api/employer", EmployerRouter);
app.use("/api/job", JobRouter);
app.use("/api/jobseeker", JobSeekerRouter);
app.use("/api/resume", ResumeRouter);
app.use("/api/application", ApplicationRouter);
app.use("/api/bookmark", BookmarkRouter);
app.use("/api/search", SearchRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = 3000;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
