const userRepository = require('../repositories/user.repository');

exports.createUser = (user) => {
  return userRepository.createUser(user);
};

exports.getUsers = () => {
  return userRepository.getUsers();
};

exports.getUserById = (id) => {
  return userRepository.getUserById(id);
};

exports.updateUser = (id, user) => {
  return userRepository.updateUser(id, user);
};

exports.deleteUser = (id) => {
  return userRepository.deleteUser(id);
};