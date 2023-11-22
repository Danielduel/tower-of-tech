import React from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { GlobeInstance } from "globe.gl";
import { COUNTRIES } from "../../components/COUNTRIES.ts";

type BeatLeaderWSAccepted = {
  data: {
    fullCombo: boolean;
    accuracy: number;
    baseScore: number;
    modifiedScore: number;

    leaderboard: {
      song: {
        author: string;
        hash: LowercaseMapHash;
        id: BeatSaverMapId;
        mapper: string;
        name: string;
      };
    };
    player: {
      avatar: string;
      name: string;
      id: string;
      country: string;
      platform: string;
    };
  }
};

type BeatLeaderWSAcceptedModified = BeatLeaderWSAccepted & {
  skewLat: number;
  skewLng: number;
  timeAdded: number;
}

const safeParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const init = async () => {
  const Globe = (await import("globe.gl")).default;
  // Gen random data
  const N = 20;
  // const arcsData = [...Array(N).keys()].map(() => ({
  //   startLat: (Math.random() - 0.5) * 180,
  //   startLng: (Math.random() - 0.5) * 360,
  //   endLat: (Math.random() - 0.5) * 180,
  //   endLng: (Math.random() - 0.5) * 360,
  //   color: [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
  // }));
  const ARC_REL_LEN = 0.4; // relative to whole arc
  const FLIGHT_TIME = 1000;
  const NUM_RINGS = 1;
  const RINGS_MAX_R = 40; // deg
  const RING_PROPAGATION_SPEED = 20; // deg/sec

  return Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .arcColor('color')
    .arcDashLength(() => 0.1)
    .arcDashGap(() => 1)
    .arcDashAnimateTime(() => 2000)
    .ringColor(() => t => `rgba(255,100,50,${1-t})`)
    .ringMaxRadius(RINGS_MAX_R)
    .ringPropagationSpeed(RING_PROPAGATION_SPEED)
    .ringRepeatPeriod(1000000)
  (document.getElementById('globeViz')!)
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const StatusItem = (props: BeatLeaderWSAcceptedModified) => {
  const {
    data: {
      accuracy,
      baseScore,
      fullCombo,
      modifiedScore,

      leaderboard: {
        song: {
          author,
          hash,
          id: songId,
          mapper,
          name: songName
        }
      },
      player: {
        avatar,
        country,
        id: playerId,
        name: playerName,
        platform
      }
    }
  } = props;
  return (
    <div className={tw("w-full text-white flex p-4 text-left")}>
      <div className={tw("w-16 h-16 rounded-lg border-0 border-black overflow-hidden mr-4")}>
        <img src={avatar} />
      </div>
      <div>
        <div className={tw("text-lg")}>{getFlagEmoji(country)} {playerName}</div>
        <div>{Math.floor(accuracy * 10000) / 100}%{fullCombo ? " (FC)" : ""} {songName}
        <br />by {author}
        {mapper.length > 0 ? (<span><br />from {mapper}</span>) : null}
        </div>
      </div>
    </div>
  )
}

export const SnipeIndex = () => {
  const ref = React.useRef<GlobeInstance | null>(null);
  const dataRef = React.useRef<BeatLeaderWSAcceptedModified[]>([]);
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
      
      const globe = ref.current;
      if (!globe) return;

      globe.ringsData(dataRef.current.map(x => {
        const country = COUNTRIES.ref_country_codes.find(country => country.alpha2 === x.data.player.country);
        if (!country) return { lat: 0, lng: 0};
        return { lat: country.latitude + x.skewLat, lng: country.longitude  + x.skewLng };
      }));
    }, 500)
  }, [counter])

  React.useEffect(() => {
    (async () => {
      ref.current = await init();

      const controls = ref.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = -5;
    })()
  }, []);

  React.useEffect(() => {
    const client = new WebSocket("wss://api.beatleader.xyz/general");
    
    client.onmessage = (message) => {
      const data = safeParse(message.data);
      if (!data) return;

      if (data.message === "accepted") {
        const newData: BeatLeaderWSAcceptedModified = {
          ...data,
          skewLat: Math.random() * 4,
          skewLng: Math.random() * 4,
          timeAdded: Date.now()
        };
        dataRef.current.push(newData);

        const globe = ref.current;
        if (!globe) return;
        const country = COUNTRIES.ref_country_codes.find(country => country.alpha2 === newData.data.player.country);
        if (!country) return;
        globe.pointOfView({ lat: country.latitude + newData.skewLat, lng: country.longitude  + newData.skewLng }, 600);
      }

      const now = Date.now();
      dataRef.current = dataRef.current.filter(x => now - x.timeAdded < 10000);
    }
  }, [])

  return <div>
    <div id="globeViz"></div>
    <div className={tw("w-96 h-[calc(100vh-8rem)] z-2 absolute top-0 right-0 border-box m-16 overflow-scroll") + " glass scrollbar-hide"}>
      {
        dataRef.current.map((props) => <StatusItem { ...props } />)
      }
    </div>
  </div>
};
