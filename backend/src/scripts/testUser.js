require('dotenv').config();
const User = require('../models/user');

(async () => {
  const user = await User.create({
    fullName: 'Second User',
    email: 'second@test.com',
    password: 'hashed',
    tenantId: null
  });

  console.log(user.toJSON());
  process.exit(0);
})();
