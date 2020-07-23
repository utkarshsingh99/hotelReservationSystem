var date = require("date-and-time");
d1 = new Date(2020, 05, 20);
d2 = new Date(2020, 03, 16);
console.log(d1);
console.log(d2);
console.log(date.subtract(d1, d2).toDays());