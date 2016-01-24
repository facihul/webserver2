var becrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs =  require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	return user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
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
			set: function(value) {
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
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
					  return reject();
					}
					user.findOne({
					  where: {
					    email: body.email
					  }
					}).then(function(user) {
					  if (!user || !becrypt.compareSync(body.password, user.get('password_hash'))) {
					    return reject();
					  }
					  resolve(user);
					  //res.json(user.toPublicJSON());
					}, function(e) {
					 reject();

					});
				});
			}
		},

		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function (type){
			if (!_.isString(type)) {
				return undefine; 
			}
			try {
				var stringData = JSON.stringify({id: this.get('id'), type: type}) 
				var encryptData = cryptojs.AES.encrypt(stringData, '12345').toString();
				var token = jwt.sign({
					token: encryptData
				}, 'qretw');
				return token; 

			}catch (e){
				console.log(e);
				return undefine;
			}

			}
		}
	});
return user;

};