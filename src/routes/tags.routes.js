const { Router } = require("express");

const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const tagsRoutes = Router();

const tagsControler = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsControler.index);

module.exports = tagsRoutes;