import React from "react";
import Image from "next/image";

import logo from "../../../public/logo.png";

function Footer() {
  return (
    <div className="flex justify-center ">
      <a href="/">
        <Image height={120} src={logo} alt="Logo Santo Grau" />
      </a>
    </div>
  );
}

export default Footer;
