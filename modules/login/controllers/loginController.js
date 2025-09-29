const ejs = require('ejs');
const path = require('path');  
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const { body, validationResult } = require('express-validator');
const passport = require('passport')

exports.showLogin = (req, res) => {
    if (req.session.userId) {
      if(req.session.role === 'user'){
        return res.redirect('/tasks/read');
      }else{
        return res.redirect('/admin/users');
      }
    }

    //**** clear cache to prevent browser back button ******/
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    //******** end **********/

    let boolAdmin = false;

    if (req.session.role === "admin") {
      boolAdmin = true;
    }
    res.render('login/login', { boolAdmin });
};

exports.getUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const rsUser = await usersModel.findOne({ email }) 

        if (rsUser) {
            const boolMatch = await bcrypt.compare(password, rsUser.password); 

            if (!boolMatch) {
                req.flash('error','Wrong password.');
                req.flash('formData', { email, password });
                return res.redirect('/auth');
            }

            if (!rsUser.verified) {
                req.flash('error', 'Please verify your email before logging in.');
                req.flash('formData', { email, password });
                return res.redirect('/auth');
            }

        } else {
            req.flash('error','User not found.');
            req.flash('formData', { email, password });
            return res.redirect('/auth');
        }

        req.session.userId = rsUser._id;
        req.session.username = rsUser.email; 
        req.session.role = rsUser.role;
       
        const redirectUrl = rsUser.role === 'admin' 
          ? '/admin/users' 
          : '/tasks/read';

          res.redirect(redirectUrl);
    } catch (err) {
        console.error('Error fetching user', err);
        res.status(500).send('Error login user.');
    }
};

exports.showRegister = (req, res) => {
    let boolAdmin = false;
    if (req.session.role === "admin") {
      boolAdmin = true;
    }
    res.render('login/register', { boolAdmin });
};

async function sendVerificationEmail(user, req) {
  const token = jwt.sign(
    { id: user._id },
    process.env.EMAIL_SECRET,
    { expiresIn: '1d' }
  );

  const verificationUrl = `${req.protocol}://${req.get('host')}/auth/verify?token=${token}`;

  // Configure Nodemailer transporter (example with Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email here
      pass: process.env.EMAIL_PASS, // your email password or app password
    }
  });

  const templatePath = path.join(__dirname, '../../../views/login/email-template.ejs');
  
  const html = await ejs.renderFile(templatePath, {
    name: user.email,
    subject: 'Please verify your email.',
    heading: 'Verify your email',
    message: 'Thanks for registering. Please verify your email by clicking the button below:',
    buttonText: 'Verify Email',
    actionUrl: `${verificationUrl}`,
    expiration: '1 day'
  });  

  const mailOptions = {
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify Your Email',
    html
  };  

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Registration Email sending failed:', err.message);
    req.flash('error', 'Failed to send new registration email. Please try again.');
  }  
}

exports.createUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }

        return true;
    }),

    //**** TEST STRONG PASSWORD ******/
    // ^(?=.*[a-z])       // at least one lowercase
    // (?=.*[A-Z])        // at least one uppercase
    // (?=.*\d)           // at least one digit
    // (?=.*[\W_])        // at least one special character (non-word char or underscore)
    // .+$                // match the entire password(apply all the required regex)
    
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])/)
        .withMessage('Password must include atleast 1 lowercase'),
        //.withMessage('Password must include uppercase, lowercase, number, and special character'),

    async (req, res) => {
        const errors = validationResult(req).array({ onlyFirstError: true });        

        const { email, password, confirmPassword } = req.body;

        if (errors.length > 0) {
            req.flash('error', errors[0].msg);
            req.flash('formData', { email, password, confirmPassword })
            return res.redirect('/auth/register');
        }        
        
        try {
            //validate username / email duplication
            const existingUser = await usersModel.findOne({ email });

            if (existingUser) {
                req.flash('error','Username already taken.');
                req.flash('formData', { email, password, confirmPassword })
                return res.redirect('/auth/register');
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = new usersModel({
                email, 
                password: hashedPassword,
            }); 

            const savedUser = await user.save();

            // Send verification email
            await sendVerificationEmail(savedUser, req);

            res.render('login/register-success', 
                { username: user.email, message: 'Please check your email to verify your account.' });  
        } catch (err) {
            console.error('Error saving new user: ', err);
            res.status(500).send('Failed to register user');
        }
}];

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Logout error:', err);
      return res.redirect('/tasks/read');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/auth');
  });
};

exports.verified = async (req, res) => {    
    const token = req.query.token;

    if (!token) {
        req.flash('error', 'Verification token is missing or invalid.');
        return res.redirect('/auth'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
        const user = await usersModel.findById(decoded.id);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/auth'); 
        }

        if (user.verified) {
            req.flash('success', 'Your email is already verified. Please login.');
            return res.redirect('/auth'); 
        }

        user.verified = true;
        await user.save();

        req.flash('success', 'Email verified successfully! You can now log in.');
        return res.redirect('/auth'); 
    } catch (err) {
        console.error(err);
        req.flash('error', 'Invalid or expired verification token');        
        return res.redirect('/auth'); 
    }
};

exports.resetPasswordGet = async (req, res) => {
  //display form reset here validate token
  const token = req.query.token;

  if (!token) {
      req.flash('error', 'Verification token is missing or invalid.');
      return res.redirect('/auth'); 
  }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const rsUser = await usersModel.findById(decoded.id);

    if (!rsUser) {
        req.flash('error', 'User not found');
        return res.redirect('/auth'); 
    }

    res.render('login/resetForm', { token });    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        req.flash('error', 'Your reset link has expired.');
    } else {
        req.flash('error', 'Invalid reset link. ');
    }

    return res.redirect('/auth');    
  }
}

exports.resetPasswordPost = [
  body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])/)
      .withMessage('Password must include atleast 1 lowercase'),  

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password){
      throw new Error('Passwords do not match')
    }

    return true;
  }),

  async (req, res) => {
  //validate token
  const { password, confirmPassword, token } = req.body;

  if (!token) {
      req.flash('error', 'Verification token is missing or invalid.');
      return res.redirect('/auth'); 
  }

  const errors = validationResult(req).array({ onlyFirstError: true });   
  
  if (errors.length > 0) {
    req.flash('error', errors[0].msg);
    req.flash('formData', { password, confirmPassword, token });
    return res.redirect(`/auth/reset?token=${token}`);
  }  
  
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);    

    const rsUser = await usersModel.findById(decoded.id);

    if (!rsUser) {
      req.flash('error', "User not found.");
      return res.redirect('/auth');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    rsUser.password = hashedPassword;
    rsUser.save();

    req.flash('success', 'Password reset successfully.');
    return res.redirect('/auth');
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        req.flash('error', 'Your reset link has expired.');
    } else {
        req.flash('error', 'Invalid reset link. ');
    }

    return res.redirect('/auth');
  }
}]

exports.dispResetPasswordGet = (req, res) => {
    let boolAdmin = false;
    if (req.session.role === "admin") {
      boolAdmin = true;
    }    

  res.render('login/reset', { boolAdmin });
}

exports.dispResetPasswordPost = (req, res) => {
  const { email } = req.body;

  sendEmail(req, res, { email }, 'reset-password');
}

exports.resendVerificationGet = (req, res) => {
  let boolAdmin = false;
  if (req.session.role === "admin") {
    boolAdmin = true;
  }    

  res.render('login/resend', { boolAdmin }); 
};

exports.resendVerificationPost =  async (req, res) => {
  const { email } = req.body;

  sendEmail(req, res, { email }, 'resend-verification');
};

const sendEmail = async (req, res, { email } , trans_type) => {
  const user = await usersModel.findOne({ email });

  if (!user) {
    req.flash('formData', { email });
    req.flash('error', 'No account found with that email.');

    const redirectUrl = trans_type === 'resend-verification' 
      ? '/auth/resend-verification'
      : '/auth/reset-password';

    return res.redirect(redirectUrl)
  }

  if (user.verified && trans_type === 'resend-verification') {
    req.flash('success', 'Account already verified. You can log in.');
    return res.redirect('/auth');
  }

  //  Resend token
  const token = jwt.sign({ id: user._id }, 
                           process.env.EMAIL_SECRET, 
                           { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  
  const templatePath = path.join(__dirname, '../../../views/login/email-template.ejs');

  const html = await ejs.renderFile(templatePath, {
    name: user.email,
    subject: trans_type === 'resend-verification' ? 'Verify Your Email' : 'Reset Your Password',
    heading: trans_type === 'resend-verification' ? 'Confirm Your Email Address' : 'Reset Your Password',
    message: trans_type === 'resend-verification'
      ? 'Click the button below to verify your email and activate your account.'
      : 'Click the button below to reset your password.',
    buttonText: trans_type === 'resend-verification' ? 'Verify Email' : 'Reset Password',
    actionUrl: `${req.protocol}://${req.get('host')}${trans_type === 'resend-verification' ? '/auth/verify' : '/auth/reset'}?token=${token}`,
    expiration: '15 minutes'
  });  

  const mailOptions = {
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: trans_type === 'resend-verification' ? 'Verify Your Email' : 'Reset Your Password',
    html
  };

  try {
    await transporter.sendMail(mailOptions);

    req.flash('success', 'Verification email sent! Please check your inbox.');
  } catch (err) {
    console.error('Email sending failed:', err.message);
    req.flash('error', 'Failed to send email. Please try again.');
  }

  return res.redirect('/auth');      
}

exports.googleCallBack = [
  passport.authenticate('google', { failureRedirect: '/auth' }),
  (req, res) => {
    // Successful login
    req.session.userId = req.user._id;
    req.session.username = req.user.name;
    req.session.role = req.user.role;

    req.flash('success', 'Logged in with Google!');
    /**** check if admin / users ***/
    req.user.role === 'admin' 
      ? res.redirect('/admin/users') // or your home/dashboard route
      : res.redirect('/tasks/read'); // or your tasks route
  }
];

exports.google = (req, res, next) => {
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })(req, res, next);
};

exports.facebookCallBack = [
  passport.authenticate('facebook', { failureRedirect: '/auth' }),
  (req, res) => {
    // Successful login
    req.session.userId = req.user._id;
    req.session.username = req.user.name;
    req.session.role = req.user.role;

    req.flash('success', 'Logged in with Facebook!');
    /**** check if admin / users ***/
    res.redirect('/tasks/read'); // or your home/dashboard route
  }
];

exports.facebook = (req, res, next) => {
  //passport.authenticate('facebook', { scope: [ 'email' ], authType: 'rerequest' })(req, res, next);
  res.send("Facebook OAuth soon be available <a href='/auth'>Back to Login</a> ");
};
