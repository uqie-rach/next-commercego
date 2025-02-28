import { Session } from "next-auth";

export default async function roleAuthenticator(session: Session, requestedRole?: string): Promise<boolean> {
  const permittedRoles = ['lead', 'core', 'ascore'];

  // If the user has a role and it is in the permitted roles
  if (session?.user?.role && permittedRoles.includes(session.user.role))
    return true;

  // If the requested role is the same as the user's role
  if (requestedRole && session.user.role === requestedRole)
    return true;

  // Otherwise, return false
  return false;
}
