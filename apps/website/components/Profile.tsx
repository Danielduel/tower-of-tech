import { Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";

const ProfileBeatLeader = () => {
  const { data, isFetching } = trpc.auth.beatleader.useQuery();
  const signedIn = data?.authorized;
  if (isFetching) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link reloadDocument to={links.api.v1.auth.beatleader.oauth.signIn()} children="Beatleader sign in" />
      </>
    );
  }
  return (
    <>
      <Link reloadDocument to={links.api.v1.auth.discord.oauth.signOut()} children="Beatleader sign out" />
    </>
  );
};

const ProfileDiscord = () => {
  const { data, isFetching } = trpc.auth.discord.useQuery();
  const signedIn = data?.authorized;
  if (isFetching) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link reloadDocument to={links.api.v1.auth.discord.oauth.signIn()} children="Discord sign in" />
      </>
    );
  }
  return (
    <>
      <Link reloadDocument to={links.api.v1.auth.discord.oauth.signOut()} children="Discord sign out" />
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
