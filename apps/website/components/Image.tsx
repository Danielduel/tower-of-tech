import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";

const ImageLoading = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div
      key={props.src}
      className={props.className +
        " animate-[spin_2s_linear_infinite] border-blue-300 border-4 blur-sm h-10 w-10 rounded"}
      style={{
        width: props.width + "px",
        height: props.height + "px",
      }}
    >
    </div>
  );
};

const ImageClientSide = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const [pristine, setPristine] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const imageData = useRef(new window.Image());
  useEffect(() => {
    imageData.current.onload = () => {
      setLoaded(true);
    };
    imageData.current.src = props.src!;
    setPristine(false);
  }, [imageData.current, setLoaded, setPristine]);

  if (!loaded || pristine) {
    return <ImageLoading key={props.src} {...props} />;
  }

  return <img key={props.src} {...props} />;
};

const ImageServerSide = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <ImageLoading key={props.src} {...props} />;
};

export const Image = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  if ("Image" in window) {
    return <ImageClientSide key={props.src} {...props} />;
  }
  return <ImageServerSide key={props.src} {...props} />;
};
