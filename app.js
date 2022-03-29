const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express')
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);




app.route("/articles")

  .get(function(req, res) {

    Article.find({}, function(err, result) {
      if (!err) {
        res.send(result);

      } else {
        res.send(err);
      }

    });

  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content

    });

    newArticle.save(function(err) {
      if (!err) {

        res.send("Sucessfully added a new article");
      } else {
        res.send(err);
      }

    });



  })

  .delete(function(req, res) {

    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Succesfully deleted all articles");
      } else {
        res.send(err);
      }

    });


  });
////////////////////////////REQUEST TARGETTING SPECIFIC ARTICLES//////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req,res){



Article.findOne({title:req.params.articleTitle}, function(err,result){

if(result){
  res.send(result);
}
else{
  res.send("No articles matching that title was found");
}
});

})

.put(function(req,res){

Article.findOneAndUpdate(
  {title:req.params.articleTitle},
  {title:req.body.title, content:req.body.content},
  {overwrite:true},
  function(err,result){
if(!err){
  res.send("Succesffully updated article");
}

}
);

})

.patch(function(req,res){

Article.findOneAndUpdate(
  {title:req.params.articleTitle},
  {$set:req.body},
  function(err){
    if(!err){
      res.send("Successfully updated article");
    }
    else{res.send(err);}
  }
);


})

.delete(function(req,res){

  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted an article");
    }
    else {
      res.send(err);
    }

  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
