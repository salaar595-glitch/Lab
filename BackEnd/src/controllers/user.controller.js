const userService = require('../services/user.service');

exports.createUser = (req, res) => {

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: 'name and email are required'
    });
  }

  const user = userService.createUser({
    name,
    email
  });

  res.status(201).json(user);
};

exports.getUsers = (req, res) => {

  const users = userService.getUsers();

  res.json(users);
};

exports.getUserById = (req, res) => {

  const user = userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(user);
};

exports.updateUser = (req, res) => {

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: 'name and email are required'
    });
  }

  const updatedUser = userService.updateUser(
    req.params.id,
    {
      name,
      email
    }
  );

  if (!updatedUser) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(updatedUser);
};

exports.deleteUser = (req, res) => {

  const result = userService.deleteUser(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json({
    message: 'Deleted'
  });
};