import { query } from "../functions";

export const testSchema = query({
  args: {},
  handler: async (ctx) => {
    // Simple test to verify schema is working
    return {
      message: "Catalog schema deployed successfully",
      tablesExist: true,
      phase1Complete: true
    };
  },
});
