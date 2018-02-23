var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Page= require('../models/page.js');
var adminUser= require('../models/admin-users.js');
var userProfile= require('../models/user-profile.js');

/*Validate current session */
function sessionCheck(request,response,next){

    if(request.session.user) 
        next();
    else 
        response.send(401,'authorization failed');
}

/* USER ROUTES */
router.get('/', function(req, res) {
  res.send('Welcome to the API zone');
});

router.get('/pages', function(request, response) {
    return Page.find(function(err, pages) {
        if (!err) {
            return response.send(pages);
        } else {
            return response.send(500, err);
        }
    });
});

/* GET: Page contents for users */
router.get('/pages/details/:url', function(request, response) {
    var url = request.params.url;
    Page.findOne({
        url: url
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

/*ADMIN ROUTES */

/* POST: Add new pages */
router.post('/pages/add', sessionCheck, function(request, response) {
    var page = new Page({
        title: request.body.title,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        date: new Date(Date.now())
    });

    page.save(function(err) {
        if (!err) {
            return response.send(200, page);

        } else {
            return response.send(500,err);
        }
    });
});

/* POST: Update page */
router.post('/pages/update', sessionCheck, function(request, response) {
    var id = request.body._id;

    Page.update({
        _id: id
    }, {
        $set: {
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        }
    }).exec();
    response.send("Page updated");
});

/* GET: Delete a page */
router.get('/pages/delete/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('Page id- ' + id + ' has been deleted');
});

/* GET: Data for a single page */
router.get('/pages/admin-details/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

/* POST: Add new admin user */
router.post('/add-user', function(request, response) {
    var salt, hash, password, userType, accountStatus, dateAdded;
    password = request.body.password;
    userType = request.body.userType;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
        username: request.body.username,
        password: hash,
        userType: userType,
        accountStatus: request.body.accountStatus,
        dateAdded: new Date(Date.now())
    });
    AdminUser.save(function(err) {
        if (!err) {
            return response.send('Admin User successfully created');

        } else {
            return response.send(err);
        }
    });
});

/*GET: Get all users */
router.get('/get-user', function(request, response) {
    return adminUser.find(function(err, adminUser) {
        if (!err) {
            return response.send(adminUser);
        } else {
            return response.send(500, err);
        }
    });
});

router.post('/add-profile', function(request, response) {
    var UserProfile = new userProfile({
        username: request.body.username,
        fullName: request.body.fullName,
        dob: request.body.dob,
        profileImage: request.body.profileImage,
        shortBio: request.body.shortBio,
        dateAdded: request.body.dateAdded,
        lastUpdated: new Date(Date.now())
    });

    UserProfile.save(function(err) {
        if (!err) {
            return response.send('your profile has been successfully created');

        } else {
            return response.send(err);
        }
    });
});

router.get('/get-profile/:user', function(request, response) {
    return userProfile.findOne({
        username: request.params.user
    }, function(err, data) {
        try {
            return response.send(data)
        } catch(err) {
            return response.send('false')
        }
    });
});

router.get('/get-profile-pic/:user', function(request, response) {
    return userProfile.findOne({
        username: request.params.user
    }, function(err, data) {
        try {
            return response.send(data.profileImage)
        } catch(err) {
            return response.send('false')
        }
    });
});

router.post('/update-user-profile', function(request, response) {
    userProfile.update({
        username: request.body.username
    }, {
        $set: {
            username: request.body.username,
            fullName: request.body.fullName,
            dob: request.body.dob,
            profileImage: request.body.profileImage,
            shortBio: request.body.shortBio,
            dateAdded: request.body.dateAdded,
            lastUpdated: new Date(Date.now())
        }
    }).exec();
    
    response.send("Your profile updated successfully");
});

/*GET: Single user details */

router.get('/get-user-single/:user', function(request, response) {
    var user = request.params.user;

    adminUser.findOne({
        username: user
    }, function(err, data) {
        return response.send(data)
    });
});

/* GET: Delete a user */
router.get('/delete-user/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    adminUser.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('User id- ' + id + ' has been deleted');
});

/* GET: Disable a user */
router.post('/disable-user', sessionCheck, function(request, response) {
    var id = request.body.id;

    adminUser.update({
        _id: id
    }, {
        $set: {
            accountStatus: "disabled",
        }
    }).exec();
    response.send("User account status updated");
});

/* GET: enable a user */
router.post('/enable-user', sessionCheck, function(request, response) {
    var id = request.body.id;

    adminUser.update({
        _id: id
    }, {
        $set: {
            accountStatus: "active",
        }
    }).exec();
    response.send("User account status updated");
});

/*GET: find if user exists */
router.post('/username-check', function(request, response) {
    adminUser.findOne({
        username: request.body.username
    }, function(err, data) {
        try {
            return response.send(data.username)
        } catch(err) {
            return response.send('false')
        }
    });
});

/*POST: Admin login */
router.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;


  adminUser.findOne({
    username: username
  }, function(err, data) {
    if (err | data === null) {
      return response.send(401, "User Doesn't exist");
    } else {
      var usr = data;
      if (username == usr.username && bcrypt.compareSync(password, usr.password)) {
        adminUser.update({
            username: usr.username
        }, {
            $set: {
                lastLogin: new Date(Date.now())
            }
        }).exec();

        request.session.regenerate(function() {
          request.session.user = username;
          return response.send({user: username, userType: usr.userType, accountStatus: usr.accountStatus});

        });
      } else {
        return response.send(401, "Bad Username or Password");
      }
    }
  });
});

/*GET: Admin logout */
router.get('/logout', function(request, response) {
    request.session.destroy(function() {
        return response.send(200, 'User logged out');
    });
});

module.exports = router;