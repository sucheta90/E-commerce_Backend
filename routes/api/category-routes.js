const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const category = await Category.findByPk(id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json("Did not find a category with that id!");
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  const { category_name } = req.body;
  try {
    const newCategory = await Category.create({ category_name: category_name });
    res.status(200).json("Created new category sucessfully!");
  } catch (err) {
    res.status(400).json("Couldn't fulfill request at this time!");
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    console.log(updatedCategory);
    if (updatedCategory[0] === 0) {
      res
        .status(404)
        .json({ message: "Category with this id does not exist!" });
      return;
    }
    res.status(200).json("Update was successful");
  } catch (err) {}
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryToDelete = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryToDelete) {
      res
        .status(404)
        .json({ message: "Category with this id does not exist!" });
      return;
    }
    res.status(200).json("Deleted Category!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
