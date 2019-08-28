const { hasPermission } = require("../utils");

const Mutations = {
  async upsertTeam(parent, args, ctx, info) {
    const team = await ctx.db.mutation.upsertTeam(
      {
        data: {
          ...args
        }
      },
      info
    );

    return team;
  },

  async upsertPlayer(parent, args, ctx, info) {
    const player = await ctx.db.mutation.upsertPlayer(
      {
        data: {
          team: {
            connect: {
              id: args.team
            }
          },
          ...args
        }
      },
      info
    );

    return player;
  },

  async upsertMatch(parent, args, ctx, info) {
    const player = await ctx.db.mutation.upsertMatch(
      {
        data: {
          teams: {
            connect: {
              id: args.teams
            }
          },
          players: {
            connect: {
              id: args.players
            }
          },
          winner: {
            connect: {
              id: args.winner
            }
          },
          ...args
        }
      },
      info
    );

    return player;
  }
};

module.exports = Mutations;
