//=====LOCATION OBJECT=====//
'use strict'
 /**
  * Constructor. All values must be converted to string in order to create requests.
  * Params:
  *     lat: int, the starting lat of an object.
  *     long: int, the starting long of an object.
  */
function location(long,lat,long2,lat2) {
    this.name;
    this.lat1 = lat;
    this.long1 = long;
    this.lat2 = lat2;
    this.long2 = long2;
    this.id = [this.long1, this.lat1, this.long2, this.lat2]
}

//=====SETTERS=====//
location.prototype.setLong = function(x) {
    this.long1 = x.toString();
}
location.prototype.setLat = function(x) {
    this.lat1 = x.toString();
}
location.prototype.setLat2 = function(x) {
    this.lat2 = x.toString();
}
location.prototype.setLong2 = function(x) {
    this.long2 = x.toString();
}
location.prototype.setName = function(x) {
    this.name = x;
}



module.exports = location;
