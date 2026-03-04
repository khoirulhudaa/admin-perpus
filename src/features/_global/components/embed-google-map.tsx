import React from "react";

export interface EmbedGoogleMapProps {
  latitude?: number;
  longitude?: number;
  text?: string;
}

export const EmbedGoogleMap = React.memo((props: EmbedGoogleMapProps) => {
  const createSrc = () => {
    return `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5000!2d${props.longitude}!3d${props.latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sinicustom!2s${encodeURIComponent(props.text || "")}!5e0!3m2!1sen!2sid!4v0`;
  };

  return (
    <iframe
      className="w-full aspect-video"
      src={createSrc()} // Adjust the z parameter to set the default zoom level
      width="600"
      height="450"
      allowFullScreen
      aria-hidden={false}
      tabIndex={0}
    ></iframe>
  );
});
