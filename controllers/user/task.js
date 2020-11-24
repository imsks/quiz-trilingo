const User = require("../../models/user/user");
const Task = require("../../models/user/task");

// Testing
exports.test = async (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "User Added Successful",
  });
};

// Add A User
exports.add = async (req, res, next) => {
  const { type, money } = req.body;

  const user = await Task.find({ email: res.payload.email });

  // User Exists
  if (user.length > 0) {
    const data = {
      type,
      money,
    };

    user[0].balance =
      type === "credit"
        ? user[0].balance + parseInt(money)
        : user[0].balance - parseInt(money);

    user[0].history.push(data);

    await Task.updateOne(user[0]).then(() => {
      res.status(200).json({
        status: "Success",
        message: "User Added Successful",
      });
    });
  }
  // User Doesn't Exists
  else {
    const newUser = Task({
      email: res.payload.email,
      balance:
        type === "credit" ? 1000 + parseInt(money) : 1000 - parseInt(money),
      history: [
        {
          type,
          money,
        },
      ],
    });

    newUser
      .save()
      .then((data) =>
        res.status(200).json({
          status: "Success",
          data,
          message: "User Added Successful",
        })
      )
      .catch((err) =>
        res.status(400).json({
          status: "Failed",
          message: "User Added Failed",
        })
      );

    next();
  }

  res.status(200).json({
    status: "Success",
    // user,
    message: "User Added Successful",
  });
};

//Get All Users
exports.getAllTasks = async (req, res) => {
  const data = await Task.find({ email: res.payload.email });

  res.status(200).json({
    status: "Success",
    data: data[0],
  });
};

// Delete A User
exports.delete = async (req, res) => {
  const { _id, email } = req.body;
  // console.log(_id);

  const data = await Task.find({ email: res.payload.email });

  data[0].balance =
    data[0].balance -
    parseInt(
      data[0].history.find((transaction) => transaction._id.toString() === _id)
        .money
    );
  data[0].history = data[0].history.filter(
    (transaction) => transaction._id.toString() !== _id
  );

  await Task.updateOne(data[0]).then(() => {
    res.status(200).json({
      status: "Success",
      message: "Data Deleted Successful",
    });
  });
};

//Get All Users
exports.getAllUsersData = async (req, res) => {
  const data = await Task.find();

  res.status(200).json({
    status: "Success",
    data,
  });
};
