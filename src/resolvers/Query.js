const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  team: forwardTo("db"),
  teams: forwardTo("db"),
  players: forwardTo("db"),

  async players(parent, args, ctx, info) {
    return ctx.db.query.players({}, info);
  }
};

module.exports = Query;
