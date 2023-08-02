const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

//Shows all tags including the associated products and product_tag
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
//Shows a specific tag by :id also includes the associated products and product_tag
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

//Creates a new tag
router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res
      .status(500)
      .json("Couldn't create a tag at this time! Please try again");
  }
});

// Updates a tag by it's :id
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
});

// Deletes a tag by :id
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    // const productTag = await ProductTag.destroy({
    //   where: {
    //     tag_id: id,
    //   },
    // });
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
});

module.exports = router;
