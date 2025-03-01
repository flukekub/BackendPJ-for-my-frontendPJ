const express = require("express");
const {register, login, logout, getMe, getUsers, getOnlyUsers, getOnlyAdmins, updateUser, deleteUser} = require("../controllers/auth");
const {protect, authorize} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", protect, logout);

router.get("/me", protect, getMe);

router.get("/users", protect, authorize("admin"), getUsers);

router.get("/users/only", protect, authorize("admin"), getOnlyUsers);

router.get("/users/admins", protect, authorize("admin"), getOnlyAdmins);

router.route("/users/:userID")
                            .put(protect, authorize("admin"), updateUser)
                            .delete(protect, authorize("admin"), deleteUser);

module.exports = router;
