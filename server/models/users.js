const
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR =  15,
    Sequelize = require('sequelize'),
    pg = require('pg');

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
            validate:{
                isAlpha: true
            }
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'last_name',
            validate:{
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

         comparePassword: function(candidatePassword, cb){
             bcrypt.compare(candidatePassword, this.password, function(err,isMatch){

                 if(err){
                     return cb(err);
                 }

                 cb(null,isMatch);

             });
         }
    }
});

userSchema.hook('beforeValidate',function(user,options,next){
    //var user = this;
    if (!user.registerDate){
        user.registerDate = pg.types.setTypeParser(1114, function(stringValue){
            return new Date(stringValue,"-0600");
        });
        user.registerDate = new Date();
        //console.log(user.registerDate);

    }

    //only hash the password if it has been modified (or is new)
    if (!user.changed('password')){
        console.log('not modified!');
        return next();
    }
    console.log('in here!');
    //generate a salty snack
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if (err){
            return next(err);
        }

        // hash the password along with our new salty snack
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) {
                return next(err);
                console.log(err);
            }
            //console.log(user.password,hash);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();

        });
    });
    console.log(user.password);
});

//userSchema.instanceMethods.comparePassword = function(candidatePassword, cb){
//    bcrypt.compare(candidatePassword, this.password, function(err,isMatch){
//        if(err){
//            return cb(err);
//        }
//        cb(null,isMatch);
//    });
//};

module.exports = userSchema;