const { hasPermission } = require("../utils");

const Mutations = {
  async createTeam(parent, args, ctx, info) {
    const team = await ctx.db.mutation.createTeam(
      {
        data: {
          ...args
        }
      },
      info
    );

    return team;
  },

  async createPlayer(parent, args, ctx, info) {
    const player = await ctx.db.mutation.createPlayer(
      {
        data: {
          ...args
        }
      },
      info
    );

    return player;
  }
};

module.exports = Mutations;
