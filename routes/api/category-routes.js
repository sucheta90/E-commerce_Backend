const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
// finds all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});
// finds a category by :id
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

// Creates a new category
router.post("/", async (req, res) => {
  const { category_name } = req.body;
  try {
    const newCategory = await Category.create({ category_name: category_name });
    res.status(200).json("Created new category sucessfully!");
  } catch (err) {
    res.status(400).json("Couldn't fulfill request at this time!");
  }
});

// Updates a category by :id
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
// Deletes a category by :id
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.destroy({
      where: {
        category_id: categoryId,
      },
    });
    // console.log(products);
    const categoryToDelete = await Category.destroy({
      where: {
        id: categoryId,
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
