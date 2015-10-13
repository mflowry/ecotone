const
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 12,
    Sequelize = require('sequelize'),
    pg = require('pg'),
    jsonwebtoken = require('jsonwebtoken');

var sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone');


var userSchema = sequelize.define('user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            field: 'user_name',
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email',
            unique: true,
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: Sequelize.STRING,
            field: 'firstName',
            validate: {
                isAlpha: true
            }
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'last_name',
            validate: {
                isAlpha: true
            }
        },
        title: {
            type: Sequelize.STRING,
            field: 'title',
            validate: {
                isAlpha: true
            }
        },
        companyName: {
            type: Sequelize.STRING,
            field: 'company_name',
            unique: true,
            validate: {
                isAlpha: true
            }
        },
        zipCode: {
            type: Sequelize.STRING,
            field: 'zip_code',
            validate: {
                isInt: true
            }
        },
        registerDate: {
            type: Sequelize.DATE,
            field: 'register_date'
        }
    },
    {
        instanceMethods: {

            comparePassword: function (candidatePassword, cb) {
                bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {

                    if (err) {
                        console.log(err);
                        return cb(err);
                    }

                    cb(null, isMatch);

                });
            }

        },
        classMethods: {
            getAuthenticated: function (user, callback) {
                var options = {
                    where: {
                        username: user.username
                    }
                };
                userSchema.findOne(options).then(function (instance) {
                    //if (err) {
                    //    console.log(err);
                    //    console.log('ERROR');
                    //    return callback(err);
                    //}

                    // make sure the user exists
                    if (!instance) {
                        console.log('No user found,');
                        return callback(new Error('Invalid username or password.', 401), null);
                    }
                    else {
                        // test for a matching password
                        instance.comparePassword(user.password, function (err, isMatch) {
                            if (err) {
                                return callback(err);
                            }

                            // check if the password was a match
                            if (isMatch) {
                                var matchedUser = {
                                    username: instance.username,
                                    id: instance.id,
                                    firstName: instance.firstName,
                                    lastName: instance.lastName
                                };

                                // return the jwt
                                var token = jsonwebtoken.sign(matchedUser, 'supersecret', {
                                    expiresIn: 1440 // expires in 24 hours
                                });
                                return callback(null, token, matchedUser);
                            }
                            else {
                                return callback(new Error('Invalid username or password.'), null);

                            }
                        });
                    }
                }).catch(function (err) {
                    callback(err);
                });
            }
        }
    });

userSchema.hook('beforeValidate', function (user, options, next) {
    //var user = this;
    if (!user.registerDate) {
        user.registerDate = pg.types.setTypeParser(1114, function (stringValue) {
            return new Date(stringValue, "-0600");
        });
        user.registerDate = new Date();

    }

    //only hash the password if it has been modified (or is new)
    if (!user.changed('password')) {
        console.log('not modified!');
        return next();
    }
    //generate a salty snack
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        // hash the password along with our new salty snack
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
                return next(err);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();

        });
    });
});

projectSchema = sequelize.define('project',
    {
        projectId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectName: {
            type: Sequelize.STRING,
            validate: {
                isAlpha: true
            }
        }
    }
);

userSchema.hasMany(projectSchema);
projectSchema.belongsTo(userSchema);

var models = {
    Users: userSchema,
    Projects: projectSchema
};

module.exports = models;