const
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 12,
    Sequelize = require('sequelize'),
    jsonwebtoken = require('jsonwebtoken');

var sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone');

//user model
var userSchema = sequelize.define('user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
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
        first_name: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, and dashes allowed!')
                    }
                }
            }
        },
        last_name: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, and dashes allowed!')
                    }
                }
            }
        },
        title: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' \/.-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, forward slashes, and dashes allowed!')
                    }
                }
            }
        },
        company_name: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' \/.-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, forward slashes, and dashes allowed!')
                    }
                }
            }
        },
        zip_code: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z ]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric and spaces allowed!')
                    }
                }
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        resetPasswordToken: {
            type: Sequelize.STRING
        },
        resetPasswordExpires: {
            type: Sequelize.DATE
        }

    },
    {
        //references to properties of this model will be given a name with an underscore in external tables
        underscored: true,
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

                            // check if the password was a match, if so construct user object
                            if (isMatch) {
                                var matchedUser = {
                                    username: instance.username,
                                    id: instance.id,
                                    first_name: instance.first_name,
                                    last_name: instance.last_name,
                                    email: instance.email,
                                    title: instance.title,
                                    company_name: instance.company_name,
                                    zip_code: instance.zip_code
                                };

                                // return the jwt
                                var token = jsonwebtoken.sign(matchedUser, process.env.jwtSecret, {
                                    expiresIn: 1440 // expires in 24 hours
                                });
                                return callback(null, token, matchedUser);
                            }
                            else {
                                return callback(new Error('Invalid username and/or password.'), null);

                            }
                        });
                    }
                }).catch(function (err) {
                    callback(err);
                });
            }
        }
    });

//methods to be run before validation
userSchema.hook('beforeValidate', function (user, options, next) {
    //only hash the password if it has been modified (or is new)
    if (!user.changed('password')) {
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

//projects model
projectSchema = sequelize.define('project',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_name: {
            type: Sequelize.STRING,
            isAlphanumericWithSpaces: function(value) {

                var reg = new RegExp("^[0-9a-zA-Z\' .-]+$");
                if(!value.match(reg)) {
                    throw new Error('Only alphanumeric, spaces, periods, and dashes allowed!')
                }
            }
        },
        project_description: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .,?!\/-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, punctuation, forward slashes, and dashes allowed!')
                    }
                }
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    },
    //references to properties of this model will be given a name with an underscore in external tables
    {underscored: true}
);

//calculations model
calculationSchema = sequelize.define('calculation',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, and dashes allowed!')
                    }
                }
            }
        },
        sub_category: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumeric: true
            }
        },
        units: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, periods, and dashes allowed!')
                    }
                }
            }
        },
        weight: {
            type: Sequelize.FLOAT,
            validate: {
                isFloat: true
            }
        },
        co2_offset: {
            type: Sequelize.FLOAT,
            validate: {
                isFloat: true
            }
        },
        item_description: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumericWithSpaces: function(value) {
                    var reg = new RegExp("^[0-9a-zA-Z\' .,?!\/-]+$");
                    if(!value.match(reg)) {
                        throw new Error('Only alphanumeric, spaces, punctuation, forward slashes, and dashes allowed!')
                    }
                }
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    },
    //references to properties of this model will be given a name with an underscore in external tables
    {underscored: true}
);

//calculationSchema.afterBulkCreate(function(calculation){
//
//});

//set up associations
userSchema.hasMany(projectSchema);
projectSchema.belongsTo(userSchema);
projectSchema.hasMany(calculationSchema);
calculationSchema.belongsTo(projectSchema);

//export models
var models = {
    Users: userSchema,
    Projects: projectSchema,
    Calculations: calculationSchema
};

module.exports = models;