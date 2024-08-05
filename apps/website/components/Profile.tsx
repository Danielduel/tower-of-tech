import { Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";

export const Profile = () => {
  const { data, isFetching } = trpc.auth.discord.useQuery();
  const signedIn = data?.authorized;
  if (isFetching) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link reloadDocument to={links.api.v1.auth.discord.oauth.signIn()} children="Sign in" />
      </>
    );
  }
  return (
    <>
      <Link reloadDocument to={links.api.v1.auth.discord.oauth.signOut()} children="Sign out" />
    </>
  );
};
