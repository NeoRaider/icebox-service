var persistence = require('../persistence/consumers.js');
var consumptions = require('./consumptions.js');

exports.list = function(req, res) {
  console.log("list Consumers");

  persistence.getAllConsumersSortedByConsumption(function(consumers) {
    res.json(consumers);
  });
};

exports.create = function(req, res) {
  console.log("created Consumer");
  //TODO: users may not have the same name as a drinks barcode, this would create issues on the client side.
  console.log(res.body);
  var username = req.body.username;

  persistence.insertNewConsumer(username, function(consumer) {
    res.json(consumer);
  });
};

exports.show = function(req, res) {
  console.log("show Consumer");

  var username = req.params.username;
  persistence.getConsumersByName(username, function(consumer) {
    res.status(200);
    res.json(consumer);
  });
};

exports.showHistory = function(req, res) {
  console.log("show Consumer With History");

  var username = req.params.username;
  persistence.getConsumersByName(username, function(consumer) {
    consumptions.getConsumptionRecordsForUser(username, function(consumptions) {

    });
  });
}

exports.destroy = function(req, res) {
  console.log("Delete Consumer");

  var username = req.params.username;
  persistence.deleteConsumerByName(username, function() {
    res.status(200);
    res.json({
      message: 'User deleted.'
    });
  });
};

exports.manipulate = function(req, res) {
  console.log("Manipulate Consumer");

  var username = req.params.username;
  var avatarmail = req.body.avatarmail;
  var vds = req.body.vds;

  persistence.manipulateConsumer(username, avatarmail, vds,
    function(consumer) {
      res.json(consumer);
    });
};

exports.addDeposit = function(req, res) {
  console.log("add Deposit");

  var username = req.params.username;
  var amount = req.body.amount;

  console.log("username "+username);
  console.log("amount "+amount);

  if (amount < 500) {
    console.log("<500");
    res.status(422);
    res.json({
      message: 'Only positive amounts over 500 allowed.'
    });
  }

  persistence.addDeposit(username, amount, function(consumer) {
    res.json(consumer);
  })
};
