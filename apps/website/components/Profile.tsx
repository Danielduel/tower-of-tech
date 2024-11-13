import { Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { FC } from "react";

type ProfileBeatLeaderProps = {
  notReady: boolean;
  signedIn: boolean;
};
const ProfileBeatLeader: FC<ProfileBeatLeaderProps> = ({ notReady, signedIn }) => {
  if (notReady) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link
          reloadDocument
          className="text-lg inline ring-1"
          to={links.api.v1.auth.beatleader.oauth.signOut()}
          children="Sign out"
        />
      </>
    );
  }
  return (
    <>
      <Link
        reloadDocument
        className="text-lg inline ring-1"
        to={links.api.v1.auth.beatleader.oauth.signIn()}
        children="Sign in"
      />
    </>
  );
};

type ProfileDiscordProps = {
  notReady: boolean;
  signedIn: boolean;
};
const ProfileDiscord: FC<ProfileDiscordProps> = ({ notReady, signedIn }) => {
  if (notReady) {
    return <></>;
  }
  if (signedIn) {
    return (
      <>
        <Link
          reloadDocument
          className="text-lg inline ring-1"
          to={links.api.v1.auth.discord.oauth.signOut()}
          children="Sign out"
        />
      </>
    );
  }
  return (
    <>
      <Link
        reloadDocument
        className="text-lg inline ring-1"
        to={links.api.v1.auth.discord.oauth.signIn()}
        children="Sign in"
      />
    </>
  );
};

export const Profile = () => {
  const { data, isFetching, isRefetching, isLoading, error, isError } = trpc.auth.me.useQuery();

  const notReady = isLoading || isRefetching || isFetching;

  if (isError) {
    return "Error";
  }

  if (notReady) {
    return "Loading...";
  }

  const beatLeaderSignedIn = !!data?.beatLeader;
  const discordSignedIn = !!data?.discord;

  if (!data) {
    return (
      <>
        <h3 className="text-2xl">Sign in</h3>
        <div className="py-4">
          <h4 className="text-xl">Beatleader</h4>
          <h5 className="text-lg px-2 pt-2 pb-3 border-l-2">
            <ProfileBeatLeader notReady={notReady} signedIn={beatLeaderSignedIn} />
          </h5>
        </div>

        <div className="py-4">
          <h4 className="text-xl">Discord</h4>
          <h5 className="text-lg px-2 pt-2 pb-3 border-l-2">
            <ProfileDiscord notReady={notReady} signedIn={discordSignedIn} />
          </h5>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-2xl">Integrations</h3>
      <div className="py-4">
        <h4 className="text-xl">Beatleader</h4>
        <h5 className="text-lg px-2 pt-2 pb-3 border-l-2">
          {data.beatLeader
            ? (
              <>
                {data.beatLeader.name} <br />
                <code>
                  {data.beatLeader.id}
                </code>
              </>
            )
            : "Not connected"} <br />
          <ProfileBeatLeader notReady={notReady} signedIn={beatLeaderSignedIn} />
        </h5>
      </div>
      <div className="py-4">
        <h4 className="text-xl">Discord</h4>
        <h5 className="text-lg px-2 pt-2 pb-3 border-l-2">
          {data.discord
            ? (
              <>
                {data.discord.username} <br />
                {data.discord.global_name} <br />
                <code>
                  {data.discord.id}
                </code>
              </>
            )
            : "Not connected"} <br />
          <ProfileDiscord notReady={notReady} signedIn={discordSignedIn} />
        </h5>
      </div>
    </>
  );
};
