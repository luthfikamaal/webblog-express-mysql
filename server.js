const express = require('express');
const mysql = require('mysql');
const BodyParser = require('body-parser');
const slugify = require('slugify');

const app = express();
app.use(express.static(__dirname + '/src'));
app.use(BodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'src/views');

const db = mysql.createConnection({
  host: 'localhost',
  database: 'blogapp',
  user: 'root',
  password: '',
});

db.connect((err) => {
  if (err) throw err;
  app.get('/', (req, res) => {
    const getPost = `SELECT * FROM post`;
    db.query(getPost, (err, result) => {
      if (err) throw err;
      res.render('post/index', {
        posts: result,
        title: 'All Post',
      });
    });
  });

  app.get('/blog', (req, res) => {
    const getPost = `SELECT * FROM post`;
    db.query(getPost, (err, result) => {
      if (err) throw err;
      res.render('post/index', {
        posts: result,
        title: 'All Post',
      });
    });
  });

  app.get('/blog/:slug', (req, res) => {
    const selectSql = `SELECT * FROM post WHERE slug = '${req.params.slug}' LIMIT 1`;
    db.query(selectSql, (err, result) => {
      if (err) throw err;
      res.render('post/show', {
        post: result[0],
      });
    });
  });

  app.get('/dashboard', (req, res) => {
    res.render('dashboard/index', {
      title: 'Dashboard',
    });
  });

  app.get('/dashboard/post', (req, res) => {
    const selectSql = `SELECT * FROM post`;
    db.query(selectSql, (err, result) => {
      if (err) throw err;
      res.render('dashboard/post/index', {
        title: 'Dashboard',
        posts: result,
        i: 1,
      });
    });
  });

  app.get('/dashboard/post/create', (req, res) => {
    res.render('dashboard/post/create');
  });

  app.post('/dashboard/post/create', (req, res) => {
    var insertSql = `INSERT INTO post (title,slug,author,body) VALUES ('${req.body.title}','${req.body.slug}','${req.body.author}','${req.body.body}')`;
    db.query(insertSql, (err, result) => {
      if (err) throw err;
      res.redirect('/dashboard/post');
    });
  });

  app.post('/dashboard/post/edit/:id', (req, res) => {
    const user = `SELECT * FROM post WHERE id = ${req.params.id}`;
    db.query(user, (err, result) => {
      const updateSql = `UPDATE post SET title = '${req.body.title}', slug = '${req.body.slug}', author = '${req.body.author}', body = '${req.body.body}' WHERE id = '${req.params.id}'`;
      db.query(updateSql, (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard/post');
      });
    });
  });

  app.post('/dashboard/post/delete/:id', (req, res) => {
    const deleteSql = `DELETE FROM post WHERE id = ${req.params.id}`;
    db.query(deleteSql, (err, result) => {
      if (err) throw err;
      res.redirect('/dashboard/post');
    });
  });

  app.get('/checkslug/:title', (req, res) => {
    const slug = slugify(req.params.title, {
      lower: true,
      remove: /[*+~.()^<>?[]'"!:@]/g,
    });
    res.json({ slug: slug });
  });
});

app.listen(8000, (err) => {
  if (err) throw err;
  console.log('Ready');
});
