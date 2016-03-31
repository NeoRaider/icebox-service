'use strict';

exports.updateDrink = function(client, fullprice, discountprice, barcode, quantity, empties, callback) {
  var query = client.query("UPDATE drinks SET fullprice=($1), discountprice=($2), quantity=($4), empties=($5) WHERE barcode=($3)", [fullprice, discountprice, barcode, quantity, empties]);
  query.on('end', function() {
    exports.getDrinkByBarcode(client, barcode, callback);
  });
};

exports.deleteDrinkById = function(client, drinkId) {
  client.query("DELETE FROM drinks WHERE id=($1)", [drinkId]);
};

exports.getDrinkByBarcode = function(client, barcode, callback) {
  console.log("get drink by barcode...");
  var query = client.query("SELECT name, barcode, fullprice, discountprice, quantity, empties FROM drinks WHERE barcode=($1) ORDER BY id ASC", [barcode]);
  query.on('row', function(row) {
    console.log("return drink... ")
    callback(row);
  });
};

exports.getAllDrinks = function(client, callback) {
  var results = [];
  var query = client.query("SELECT name, barcode, fullprice, discountprice, quantity, empties FROM drinks ORDER BY name ASC");
  query.on('row', function(row) {
    results.push(row);
  });
  query.on('end', function() {
    callback(results);
  });
};

exports.getAllDrinksByPopularity = function(client, callback) {
  var results = [];
  var query = client.query("SELECT name, barcode, fullprice, discountprice, quantity, empties " +
  "FROM drinks d LEFT OUTER JOIN consumptions c ON d.id = c.drink_id " +
  "GROUP BY d.id "+
  "ORDER BY COUNT(c.drink_id) DESC");
  query.on('row', function(row) {
    results.push(row);
  });
  query.on('end', function() {
    callback(results);
  });
};

exports.insertNewDrink = function(client, name, barcode, fullprice, discountprice, quantity, empties, callback) {
  var query = client.query("INSERT INTO drinks(name, barcode, fullprice, discountprice, quantity, empties) values($1, $2, $3, $4, $5, $6)  ON CONFLICT DO NOTHING", [name, barcode, fullprice, discountprice, quantity, empties]);
  query.on('end', function() {
    exports.getDrinkByBarcode(client, barcode, callback);
  });
};

exports.consumeDrink = function(client, barcode, callback) {
  console.log("consume Drink");
  var query1 = client.query("UPDATE drinks SET quantity=(quantity-1) WHERE barcode=($1)", [barcode]);
  query1.on('end', function() {
    var query2 = client.query("UPDATE drinks SET empties=(empties+1) WHERE barcode=($1)", [barcode]);
    query2.on('end', function() {
      console.log("return drink....")
      exports.getDrinkByBarcode(client, barcode, callback);
    });
  })
};

exports.setUpDrinksTable = function() {
  client.query('CREATE TABLE IF NOT EXISTS drinks(id SERIAL PRIMARY KEY, name VARCHAR(200) not null UNIQUE, barcode VARCHAR(200) not null UNIQUE, fullprice INTEGER not null, discountprice INTEGER not null, quantity INTEGER not null)');
};
