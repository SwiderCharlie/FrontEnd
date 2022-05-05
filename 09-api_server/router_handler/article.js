const path = require('path');
const db = require('../db/index');

exports.addArticle = (req, res) => {
    // 手动判断是否上传了封面
    if (!req.file || req.file.filename !== 'cover_img') return res.cc('文章封面是必选参数！');

    const articleInfo = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        put_date: new Date(),
        author_id: req.user.id
    };
    const sql = 'insert into ev_articles set ?';
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('发布文章失败！');
        res.cc('发布文章成功！', 0);
    });
};
