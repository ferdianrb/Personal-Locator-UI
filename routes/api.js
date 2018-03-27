var express = require('express');
var router = express.Router();
var Person = require('../models/persons.js');

/* GET Person listing. */
router.get('/person/list', function(req, res, next) {
       Person.find(function(err, persons) {
       console.log( persons );
       res.json(persons);
   });
});

/* Add person */
router.post('/addperson', function(req, res, next) {
  var person = new Person({
    name: req.body.name,
    address : req.body.address,
    status: req.body.status
  })
    person.save(function(err) {
      if (err)
          res.send(err);
       console.log(person)
      res.redirect('/admin');
  });
});

/* Edit Person */
router.post('/putperson/:id', function(req, res, next) {
  Person.findById(req.params.id, function(err, person) {
    if (err)
      res.send(err);
      
    person.name= req.body.name;
    person.address= req.body.address;
    
    person.save(function(err) {
      if (err)
        res.send(err)
      
      res.redirect('/admin')
    });
  });
});

router.get('/delperson/:id', function(req, res, next) {
  Person.remove({
    _id: req.params.id
  },
  function(err) {
    if (err)
      res.send(err)
    res.redirect('/admin')
  });
});

module.exports = router;