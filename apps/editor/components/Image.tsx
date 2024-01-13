import { useEffect, useRef, useState } from "react";
import { ImgHTMLAttributes } from "npm:@types/react";

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false);
  const imageData = useRef(new window.Image());
  useEffect(() => {
    imageData.current.onload = () => {
      setLoaded(true);
    }
    imageData.current.src = props.src!;
  }, [imageData.current, setLoaded]);

  if (!loaded) {
    return <div className={props.className + " animate-[spin_2s_linear_infinite] border-blue-300 border-4 blur-sm h-10 w-10 rounded"}></div>
  }

  return <img {...props} />
};
