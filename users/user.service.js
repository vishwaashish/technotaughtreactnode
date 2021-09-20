const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../_helpers/db');
const mysql = require('mysql2');

module.exports = {
    authenticate,
    authenticatepassword
};

const { host, user, password, database } = config.database;
const conn =  mysql.createConnection({ host, user, password, database });

conn.connect((err)=>{
    if (err) {
        throw err;
    }
    console.log('Mysql Connected');
})


async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        // throw 'Username or password is incorrect';
        return { msg: 'Username or password is incorrect', status: 401 };
    }

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token, status: 200 };
}

async function authenticatepassword({ email, password, newpassword }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        // throw 'Username or password is incorrect';
        return { message: 'Username or password is incorrect', status: 401 };
    }
    // authentication successful
    hashpassword = await bcrypt.hash(newpassword,10);
    sql = 'Update users set password = ? where email = ? ';
    conn.query(sql, [hashpassword, email], (err, result) => {
        return { status: 200, message: "Updated Successfully", data: result };
    })
    return { status: 200, message: "Updated Successfully" };
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}
