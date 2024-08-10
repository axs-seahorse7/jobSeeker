var express = require('express');
var router = express.Router();
var mognoose = require('mongoose');
var UserModel = require('../public/db/db');
var postModel = require('../public/db/post');
var app = require('../app');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const upload = require('../public/db/multer')
const path = require('path');
const { error } = require('console');


/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', (req, res)=>{
  res.render('login') 
});

router.get('/feed', isLoggedin, async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.session.passport.user }).populate('post').exec()
    // const posts = await postModel.find().populate('username').exec();
    res.render('feed', {user, posts: user.post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/feed/chat', function(req,res){
  res.render('chat');
})

router.get('/feed/search', async function(req, res){
  const query = req.query.query;
  console.log('query is passed :', query);
  try{
    const user = await UserModel.find({username: new RegExp(query, 'i')});
    res.render('search', {user, query});
  }
  catch(err){
    console.error(err);
    res.status(500).send('query not found')
  }
});

router.post('/feed/search',async function(req, res){
  const query = req.body.query;
  console.log('query is : ', query);

  res.redirect(`/feed/search`);
});

router.post('/feed/post', upload.single('image'),async function(req, res){
  try{
  const user = await UserModel.findOne({username: req.session.passport.user});

  if(!user){
    throw new Error('user is not define')
  }

  let picture = [];
  if (req.file) {
    picture.push(req.file.filename);
  } else {
    picture.push('');
  }

  const post = await postModel.create({
    picture:[req.file.filename],
    caption: req.body.caption,
    username: user._id
  })
    user.post.push(post._id) 
    await user.save();
    res.redirect('/feed');  
}catch(err){
    console.error(err);
    
  }
});

router.delete('/feed/delete', async function(req, res){

  try{
    const postID = req.query.postID;
    if(!postID){
      return res.status(400).json({ error: 'Post ID is required' });
    }
    const deletePost = await postModel.findByIdAndDelete(postID);
    if(!deletePost){
      return res.status(404).json({error: 'post ID not found'});
    } 
  }
  catch(err){
    console.log(err)
  }
})


router.post('/feed/profile', upload.single('image'),async function(req, res){
  try{
  const user = await UserModel.findOne({username: req.session.passport.user});

  if(!user){
    throw new Error('user is not define')
  }
  
  user.profile = req.file.filename;
    await user.save();
    res.redirect('/feed');  
}catch(err){
    console.error(err);
    
  }
});

router.get('/username/:username',async (req, res)=>{
  const regex = new RegExp(`^${req.params.username}`,'i')
  try {
    const user = await UserModel.find({ username: regex });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
})

router.post('/register', function(req, res, next){
    const {username, email, password} = req.body;

    const newUser = new UserModel({
      username,
      email
    });
    
    UserModel.register(newUser, req.body.password).then(function(){
      passport.authenticate('local')(req, res, () =>{
        res.redirect('/feed')
      });
    })

    .catch(err =>{
      res.render('error', {error : err})
    })
});


router.post('/login', passport.authenticate("local", {
  successRedirect: '/feed',
  failureRedirect: '/login'
}), function(req, res, next){
});

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});




function isLoggedin(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
}


module.exports = router;

