const { contactWithUs } = require("../config/nodemailer.config");

const createContactWithAdmin = async (req, res) => {
  try {
    const data = req.body;

    contactWithUs(data);

    res.json({
      message: "Email sent successfully",
      status: 200,
    });
  } catch (error) {
    console.log("error from create contact with admin", error);
  }
};

module.exports = {
  createContactWithAdmin,
};
