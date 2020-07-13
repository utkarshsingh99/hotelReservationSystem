const mongoose = require("mongoose");
const Room = require("../models/room");

exports.get_available_rooms = (req, res, next) => {
  let addr = req.query.address
  let cin = new Date(req.query.checkIn)
  let cout = new Date(req.query.checkOut)
  let bedCapacity = req.query.bedCapacity
  let maxRent = req.query.maxRent
  var availableRooms = [];
  if(addr === undefined || cin === undefined || cout === undefined)
  {
      res.send("Insufficient parameters");
      return;
  }
  Room.find( {address: addr} )
  .then(rooms => {
      let i = 0;
      rooms.forEach(room => {
          i++;
          if((bedCapacity === undefined || room.bedCapacity == bedCapacity) && (maxRent === undefined || room.rent <= maxRent) )
          {
              availableRooms.push(room);
              console.log(room)
              room.bookingStatus.forEach(booking => {
                  Client.findOne({"_id": booking})
                  .then(b => {
                      console.log(b)
                      if(cout < b.checkIn || cin > b.checkOut)
                      {
                      }
                      else
                      {
                          availableRooms.pop();
                      }
                  }).catch(err => console.log(err));
              });
          }
          if(i === rooms.length)
          {
              res.status(200).json({
                  message : 'Showing Rooms',
                  roomsCount : availableRooms.length,
                  rooms : availableRooms
              });
          }
      });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });   
  });
};

exports.add_room = (req, res, next) => {
  var rooms = req.body.rooms
  let n = 0;
  let addedRooms = [];
  rooms.forEach(room => {
    var newRoom = new Room(room);
    newRoom.save().then(r => {
      n++;
      console.log('Saved', r)
      addedRooms.push(r);
      if(n === rooms.length)
      {
        res.status(200).json({
          message : 'Successfully added',
          addedRooms : addedRooms
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });
};

  // const product = new Product({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: req.body.name,
  //   price: req.body.price,
  //   productImage: req.file.path
  // });
  // product
  //   .save()
  //   .then(result => {
  //     console.log(result);
  //     res.status(201).json({
  //       message: "Created product successfully",
  //       createdProduct: {
  //         name: result.name,
  //         price: result.price,
  //         _id: result._id,
  //         request: {
  //           type: "GET",
  //           url: "http://localhost:3000/products/" + result._id
  //         }
  //       }
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });


exports.get_room = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.update_room = (req, res, next) => {

  console.log(req.body)
  Room.findOne({_id: req.body._id}).then( room => {
    if(room.bookingStatus.length > 0)
    {
        res.send('Cannot Update. Room is currently booked');
        return;
    }
    Room.findOneAndUpdate({_id: req.body._id}, 
    {
        number: req.body.number,
        features: req.body.features,
        bedCapacity: req.body.bedCapacity,
        rent: req.body.rent,
        address: req.body.address
    })
    .then(r => {
        console.log(r)
        res.status(200).json({
            message : '1 document updated',
            room : r
        });
    })
    .catch(e => res.send(e));
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};  

  // const id = req.params.productId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  // Product.update({ _id: id }, { $set: updateOps })
  //   .exec()
  //   .then(result => {
  //     res.status(200).json({
  //       message: "Product updated",
  //       request: {
  //         type: "GET",
  //         url: "http://localhost:3000/products/" + id
  //       }
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });

exports.delete_room = (req, res, next) => {

  Room.findOne({_id: req.body._id}).then(room => {
    if(room.bookingStatus.length > 0)
    {
        res.send('Cannot Delete. Room is currently booked');
        return;
    }
    Room.deleteOne({ "_id": req.body._id }, function(err, obj) {
    if (err) throw err;
    })
    .then( x => {
      console.log("Room deleted")
      res.status(200).json({
        message : 'Room deleted'
      });
    })
    .catch(e => res.send(e));
  })
  .catch(e => res.send(e));  
};
