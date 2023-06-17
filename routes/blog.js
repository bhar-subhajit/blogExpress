const express = require("express");
const path = require("path");
const blogs = require("../data/blogs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const router = express.Router();

const uri =
  "mongodb+srv://Subhajit:31223122@cluster0.6b1hmzh.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, '../templates/index.html'))
  res.render("home");
});

router.get("/movies", (req, res) => {
  // res.sendFile(path.join(__dirname, '../templates/bloghome.html'))
  // res.render('blogHome', {
  //     blogs: blogs
  // });
  getMovieList(req, res).catch(console.dir);
});

router.post("/booking", bodyParser.json(), (req, res) => {
  setTimeout(() => saveBooking(req, res).catch(console.dir), 5000);
});

router.get("/blogpost/:slug", (req, res) => {
  myBlog = blogs.filter((e) => {
    return e.slug == req.params.slug;
  });
  // console.log(myBlog)
  res.render("blogPage", {
    title: myBlog[0].title,
    content: myBlog[0].content,
  });
  // res.sendFile(path.join(__dirname, '../templates/blogPage.html'))
});

async function getMovieList(req, res) {
  try {
    const database = client.db("db");
    const movies = database.collection("movies");
    const query = { rating: { $gt: 4 } };
    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      // projection: { _id: 0, title: 1, imdb: 1 },
    };
    const cursor = movies.find(query, options);
    const moviesArr = [];
    for await (const doc of cursor) {
      moviesArr.push(doc);
    }
    res.status(200);
    res.json({ movies: moviesArr });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

async function saveBooking(req, res) {
  try {
    const database = client.db("db");
    const bookings = database.collection("bookings");
    const cursor = await bookings.insertOne(req.body);
    res.status(200);
    res.json({
      statusCode: "0",
      statusMsg: "Booking Saved Successfully",
      bookingId: cursor.insertedId,
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

module.exports = router;
