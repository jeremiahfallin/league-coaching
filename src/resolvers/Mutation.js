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
    const match = await ctx.db.mutation.upsertMatch(
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

    return match;
  },

  async upsertStats(parent, args, ctx, info) {
    const stats = await ctx.db.mutation.upsertStats(
      {
        data: {
          player: {
            connect: {
              id: args.player
            }
          },
          match: {
            connect: {
              id: args.match
            }
          },
          ...args
        }
      },
      info
    );

    return stats;
  }
};

module.exports = Mutations;
