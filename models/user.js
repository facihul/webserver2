var becrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt : {
 			type: DataTypes.STRING,	
		},
		password_hash: {
			type: DataTypes.STRING,
		},

		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [4, 100]
			},
			set: function(value){
            var salt = becrypt.genSaltSync(10);
            var hashPassword = becrypt.hashSync(value, salt);
            this.setDataValue('password', value);
            this.setDataValue('salt', salt);
            this.setDataValue('password_hash', hashPassword); 	

			}

		}


	}, {
		hooks: {
			beforeValidate: function(user, option) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}


		},
		instanceMethods: {
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json, 'id', 'email','createdAt', 'updatedAt');
			}
		}
	});

};