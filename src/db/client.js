const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//   if (params.model == "User" && params.action == "craete") {
//     // hash pass
//   }
//   return next(params);
// });

module.exports = prisma;
