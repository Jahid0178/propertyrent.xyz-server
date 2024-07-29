const { contactWithUs, notifyMe } = require("../config/nodemailer.config");

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

const createNotifyMe = async (req, res) => {
  try {
    const data = req.body;

    notifyMe(data);

    res.status(200).json({
      message: "Notify created successfully",
      status: 200,
    });
  } catch (error) {
    console.log("notify me error", error);
  }
};

module.exports = {
  createContactWithAdmin,
  createNotifyMe,
};
