const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const tag = await Tag.findByPk(id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tag) {
      res.status(404).json("Couldn'y find a tag!");
      resturn;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res
      .status(500)
      .json("Couldn't create a tag at this time! Please try again");
  }
  // create a new tag
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
  // update a tag's name by its `id` value
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const productTag = await ProductTag.destroy({
      where: {
        tag_id: id,
      },
    });
    const tagToDelete = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagToDelete) {
      res.status(404).json({ message: "Tag with this id does not exist!" });
      return;
    }
    res.status(200).json("Deleted Tag!");
  } catch (err) {
    res.status(500).json(err);
  }
  // delete on tag by its `id` value
});

module.exports = router;
