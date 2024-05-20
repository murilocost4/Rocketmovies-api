const { Router } = require("express");

const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();

const tagsControler = new TagsController();

tagsRoutes.get("/:user_id", tagsControler.index);

module.exports = tagsRoutes;