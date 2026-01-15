import { internalMutation, mutation } from "./functions";
import { getRole } from "./permissions";
import { defaultToAccessTeamSlug, getUniqueSlug } from "./users/teams";
import { createMember } from "./users/teams/members";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Called api.users.store without valid auth token");
    }

    const existingUser = await ctx
      .table("users")
      .get("tokenIdentifier", identity.tokenIdentifier);
    if (existingUser !== null) {
      return defaultToAccessTeamSlug(existingUser);
    }
    // Handle users without email (e.g., OAuth-only accounts)
    const email = identity.email ?? `${identity.tokenIdentifier.split("|")[0]}@no-email.clerk`;
    let user = await ctx.table("users").get("email", email);
    const nameFallback = identity.email 
      ? emailUserName(identity.email) 
      : (identity.name ?? identity.nickname ?? "User");
    const userFields = {
      fullName: identity.name ?? nameFallback,
      tokenIdentifier: identity.tokenIdentifier,
      email: email,
      pictureUrl: identity.pictureUrl,
      firstName: identity.givenName,
      lastName: identity.familyName,
    };
    if (user !== null) {
      await user.patch({ ...userFields, deletionTime: undefined });
    } else {
      user = await ctx.table("users").insert(userFields).get();
    }
    const name = `${user.firstName ?? nameFallback}'s Team`;
    const slug = await getUniqueSlug(ctx, identity.nickname ?? name);
    const teamId = await ctx
      .table("teams")
      .insert({ name, slug, isPersonal: true });
    await createMember(ctx, {
      teamId,
      user,
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return slug;
  },
});

function emailUserName(email: string) {
  return email.split("@")[0];
}

export const foo = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.table("as", "b", (q) => q.eq("_creationTime" as any, 3 as any));
  },
});
