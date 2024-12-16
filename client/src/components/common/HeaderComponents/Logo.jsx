import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"}>
      <img
        className="object-cover h-5 scale-[2] w-20"
        src="/assets/Logo.png"
        alt="Majdooor"
      />
    </Link>
  );
}
