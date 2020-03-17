const expres = require("express");
const app = expres();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sanitize = require("mongo-sanitize");
const port = 3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const url = "mongodb://localhost:27017/seller";
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(error) {
    if (!error) {
      console.log("mongo connected ");
    } else {
      console.log("err: ", err);
    }
  }
);

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: String,
    family: String,
    mobile: String
  }
);

const usersModel = mongoose.model("users", usersSchema);

/* -------------------------------------------------------------------------- */
/*                                  add user                                  */
/* -------------------------------------------------------------------------- */
app.all("/addUser/:mobile", function(request, response) {
  const name = "fakeName";
  const family = "fakeFamilyName";
  const mobile = request.params.mobile;

  usersModel.findOne({ mobile: mobile }, function(err, result) {
    if (err) console.log(err);
    if (result) {
      response.end(JSON.stringify({ status: result._id }));
    } else {
      const dataInformation = new usersModel({
        name: name,
        family: family,
        mobile: mobile
      });
      dataInformation.save(function(error) {
        if (!error) {
          response.end(
            JSON.stringify({ status: dataInformation._id, done: true })
          );
        } else {
          response.end(JSON.stringify({ status: "error to register user" }));
        }
      });
    }
  });
});

/* -------------------------------------------------------------------------- */
/*                       find user by mobile inside body                      */
/* -------------------------------------------------------------------------- */
app.all("/find", function(request, response) {
  // we can send injection inside mobile parameter like this {$ne: null}
  const mobile = request.body.mobile;
  console.log(" beforeSanitize =", JSON.stringify(mobile) ===JSON.stringify({'$ne': null}) );
  console.log(" afterSanitize =", sanitize({...mobile}));

  
  /*****************************************************************
   * IF IT WAS DELETEMANY INSTEAD OF FIND IT WOULD DELETE ALL DOCS *
   *****************************************************************/
  usersModel.find({ mobile: (mobile) }, function(error, result) {
    if (error) {
      response.send({ error });
      console.log("error: ", error);
    }

    if (result) {
      response.send(result);
    } else {
      response.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`app is listening on ${port} port`);
});
