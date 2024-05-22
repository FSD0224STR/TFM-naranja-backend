const { categoryModel } = require("../Models/categoryModel");

const findCategories = async (req, res) => {
  try {
    //const decodedToken = jwt.verify(token, tokenSecret);

    const result = await categoryModelModel.find({}).toArray();
    res.json(result);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }
};

module.exports = {
  findCategories,
};
