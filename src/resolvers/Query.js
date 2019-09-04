const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  team: forwardTo("db"),
  teams: forwardTo("db"),
  players: forwardTo("db"),
  stats: forwardTo("db"),
  statses: forwardTo("db"),

  async players(parent, args, ctx, info) {
    return ctx.db.query.players({}, info);
  },

  async teams(parent, args, ctx, info) {
    return ctx.db.query.teams({}, info);
  }
};

module.exports = Query;
