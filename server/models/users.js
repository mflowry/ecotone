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
            isAlphanumeric: true
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email',
            unique: true,
            isEmail: true
        },
        firstName: {
            type: Sequelize.STRING,
            field: 'firstName',
            isAlpha: true
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'last_name',
            isAlpha: true
        },
        title: {
            type: Sequelize.STRING,
            field: 'title',
            isAlpha: true
        },
        companyName: {
            type: Sequelize.STRING,
            field: 'company_name',
            unique: true,
            isAlpha: true
        },
        zipCode: {
            type: Sequelize.STRING,
            field: 'zip_code',
            isInt: true
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

userSchema.hook('beforeCreate',function(user,options){
    //var user = this;

    if (!user.registerDate){
        user.registerDate = pg.types.setTypeParser(1114, function(stringValue){
            return new Date(stringValue,"-0600");
        });
        //this.registerDate = new Date();
    }

    //only hash the password if it has been modified (or is new)
    if (!user.changed('password')){
        return next();
    }

    //generate a salty snack
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if (err){
            return next(err);
        }

        // hash the password along with our new salty snack
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();

        });
    });
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