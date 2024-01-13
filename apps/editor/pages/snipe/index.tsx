import { useRef, useEffect, useState } from "react";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { GlobeInstance } from "globe.gl";
import { COUNTRIES } from "../../components/COUNTRIES.ts";
import { createRoot } from "react-dom/client";

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
    <div className="w-full text-white flex p-4 text-left">
      <div className="w-16 h-16 rounded-lg border-0 border-black overflow-hidden mr-4">
        <img src={avatar} />
      </div>
      <div>
        <div className="text-lg">{getFlagEmoji(country)} {playerName}</div>
        <div>{Math.floor(accuracy * 10000) / 100}%{fullCombo ? " (FC)" : ""} {songName}
        <br />by {author}
        {mapper.length > 0 ? (<span><br />from {mapper}</span>) : null}
        </div>
      </div>
    </div>
  )
}

const StatusItemAsHTML = (props: BeatLeaderWSAcceptedModified) => {
  const elem = <StatusItem {...props} />;
  const root = document.createElement("div");
  root.className = "bg-zinc-900 glass"
  root.setAttribute("name", "toRemove")
  createRoot(root).render(elem);
  return root;
}

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
  const RINGS_MAX_R = 5; // deg
  const RING_PROPAGATION_SPEED = 0.8; // deg/sec

  return Globe()
    // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .atmosphereColor("white")
    .backgroundColor("black")
    .arcColor('color')
    .arcDashLength(() => 0.1)
    .arcDashGap(() => 1)
    .arcDashAnimateTime(() => 2000)
    .htmlElement((d) => StatusItemAsHTML(d))
    .pointRadius(0.05)
    .pointAltitude(0.5)
    .pointColor(0x18181B)
    .pointsTransitionDuration(0)
    .htmlAltitude(0.5)
    .htmlTransitionDuration(0)
  (document.getElementById('globeViz')!)
}

export const SnipeIndex = () => {
  const ref = useRef<GlobeInstance | null>(null);
  const dataRef = useRef<BeatLeaderWSAcceptedModified[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
      
      const globe = ref.current;
      if (!globe) return;

      const lenLatData = dataRef.current.map(x => {
        const country = COUNTRIES.ref_country_codes.find(country => country.alpha2 === x.data.player.country);
        if (!country) return { lat: 0, lng: 0, ...x };
        return { name: "toRemove", lat: country.latitude + x.skewLat, lng: country.longitude  + x.skewLng, ...x };
      });

      const scene = globe.scene();

      const htmlContainer = scene.children[3].children[0].children[11];
      const pointsContainer = scene.children[3].children[0].children[1];
      const htmlChildren = [...htmlContainer.children];
      const pointsChildren = [...pointsContainer.children];

      globe.pointsData(lenLatData);
      globe.htmlElementsData(lenLatData);

      setTimeout(() => {
        htmlChildren.forEach(c => c.removeFromParent());
        pointsChildren.forEach(c => c.removeFromParent());
      }, 500)
    }, 500)
  }, [counter])

  useEffect(() => {
    (async () => {
      ref.current = await init();

      const controls = ref.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = -5;
    })()
  }, []);

  useEffect(() => {
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
        globe.pointOfView({ lat: country.latitude + newData.skewLat, lng: country.longitude  + newData.skewLng, altitude: 0.9 }, 600);
      }

      const now = Date.now();
      dataRef.current = dataRef.current.filter(x => now - x.timeAdded < 10000);
    }
  }, [])

  return <div>
    <div id="globeViz"></div>
    <div className="w-96 h-[calc(100vh-8rem)] z-2 absolute top-0 right-0 border-box m-16 overflow-scroll glass scrollbar-hide">
      {
        dataRef.current.map((props) => <StatusItem { ...props } />)
      }
    </div>
  </div>
};
