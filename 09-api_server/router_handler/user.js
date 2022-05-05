const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body;
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        // return res.send({ status: 1, message: '用户名或密码不能为空！' });
        return res.cc('用户名或密码不能为空！');
    }

    // 定义sql语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, [userinfo.username], function (err, results) {
        if (err) {
            // return res.send({ status: 1, message: err.message });
            return res.cc(err);
        }
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' });
            return res.cc('用户名被占用，请更换其他用户名！');
        }

        // 对用户的密码，进行 bcrypt 加密，返回值是加密后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义插入新用户的sql语句
        const sql = 'insert into ev_users set ?';
        // 调用db.query()执行sql语句，插入新用户
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            if (err) return res.send({ status: 1, message: err.message });
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' });
                return res.cc('注册用户失败，请稍后再试！');
            }
            // res.send({ status: 0, message: '注册成功！' });
            res.cc('注册成功！', 0);
        });
    });
};

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义SQL语句
    const sql = 'select * from ev_users where username=?';
    // 执行SQL语句，根据用户名查询
    db.query(sql, userinfo.username, function (err, results) {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('登录失败！');
        // 用用户输入的密码和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc('登录失败！');
        // 剔除ES6高级语法，快速剔除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' };
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        });
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })
    });
};