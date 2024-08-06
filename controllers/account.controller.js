const express = require('express');
const router = express.Router();
const Account = require('../models/account.model');
const authorize = require('../_helpers/authorize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.put('/update-user/:id', authorize(), updateUser);


module.exports = router;

// account registration
async function register(req, res) {
  try {
    const { fullname, email, password } = req.body;
    // Check for already existing email
    if(await Account.findOne({ email }).exec()){
      return res.status(400).json({ message: 'User with this email address already exist.'});
    }

    // Create new store owner
    let account = new Account({
      fullname,
      email,
      passwordHash: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    await account.save();

    return res.status(200).json({ message: `Your registration is complete, you can now login.` });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error: Operation was not completed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    let account = await Account.findOne({ email }).exec();
    // Check if email exist
    if(!account){
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Check if password match hashed password
    if(!bcrypt.compareSync(password, account.passwordHash)){
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Generate store owner login token (token expires in 2 hours)
    const token = jwt.sign({ sub: account._id, email: account.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
    // return back data to the user
    return res.status(200).json({ ...account.toJSON(), token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error: Operation was not successful' });
  }
}

async function updateUser(req, res) {
  if(req.params.id !== req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { id } = req.params;
    const updateObj = Object.assign({}, req.body);
    const account = await Account.findByIdAndUpdate(
      { _id: id },
      { $set: updateObj },
      { new: true }).exec();

    return res.status(200).json({ account, message: "User account details was updated successful" });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update user account' });
  }
}