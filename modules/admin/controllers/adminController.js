const Login = require('../../login/models/users');

exports.getAllUsers = async (req, res) => {
    try {
        let boolAdmin = false;

        if(req.session.role === "admin"){
          boolAdmin = true;
        }

        const users = await Login.find().sort({ username: 1 });    
            
        res.render('admin/users', { users, boolAdmin });
    } catch (err) {
        console.error('Error fetching user: ', err);
        req.flash('error', 'Failed to load users');
        res.redirect('/');        
    }
};

// POST /admin/users/:id/role
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    req.flash('error', 'Invalid role');
    return res.redirect('/admin/users');
  }

  try {
    await Login.findByIdAndUpdate(id, { role });
    
    req.flash('success', 'Role updated successfully');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update role');
  }

  res.redirect('/admin/users');
};




