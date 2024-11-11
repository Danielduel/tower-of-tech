import { Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { authCacheQuery } from "@/packages/react-query/constants.ts";

const ProfileBeatLeader = () => {
  const { data, isFetching } = trpc.auth.beatleader.useQuery(undefined, authCacheQuery);
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
  const { data, isFetching } = trpc.auth.discord.useQuery(undefined, authCacheQuery);
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
  const { data, isFetching, isRefetching, isLoading, error, isError } = trpc.auth.me.useQuery(
    undefined,
  );

  if (isError) {
    return "Error";
  }

  if (isLoading || isRefetching || isFetching) {
    return "Loading...";
  }

  if (!data) {
    return "No data";
  }

  return (
    <>
      Hi {data?.beatLeader?.name}
      <ProfileDiscord />
      <ProfileBeatLeader />
    </>
  );
};
