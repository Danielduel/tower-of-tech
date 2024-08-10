import { Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

const ProfileBeatLeader = () => {
  const { data, isFetching } = trpc.auth.beatleader.useQuery(undefined, semiconstantCacheQuery);
  const signedIn = data?.authorized;
  if (isFetching) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link reloadDocument to={links.api.v1.auth.discord.oauth.signOut()} children="Beatleader sign out" />
      </>
    );
  }
  return (
    <>
      <Link reloadDocument to={links.api.v1.auth.beatleader.oauth.signIn()} children="Beatleader sign in" />
    </>
  );
};

const ProfileDiscord = () => {
  const { data, isFetching } = trpc.auth.discord.useQuery(undefined, semiconstantCacheQuery);
  const signedIn = data?.authorized;
  if (isFetching) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link reloadDocument to={links.api.v1.auth.discord.oauth.signOut()} children="Discord sign out" />
      </>
    );
  }
  return (
    <>
      <Link reloadDocument to={links.api.v1.auth.discord.oauth.signIn()} children="Discord sign in" />
    </>
  );
};

export const Profile = () => {
  return (
    <>
      <ProfileDiscord />
      <ProfileBeatLeader />
    </>
  );
};
