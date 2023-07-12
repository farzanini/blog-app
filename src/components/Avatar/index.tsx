import Image from "next/image";
import React from "react";

type AvatarProps = { src: string; alt: string };

function Avatar({ src, alt }: AvatarProps) {
  return (
    <Image src={src} alt={alt} fill className="rounder-full">
      Avatar
    </Image>
  );
}

export default Avatar;
