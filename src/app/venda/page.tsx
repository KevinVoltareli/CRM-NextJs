"use client";

import React, { useState } from "react";
import VendaMacro from "../../components/vendasMacroResult/vendasMacroResult";
import VendaMicro from "../../components/vendasMicroResult/vendasMicroResult";
import { useSessionContext } from "../SessionContext";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const page = () => {
  const [relDet, setRelDet] = useState(false);
  const [relMac, setRelMac] = useState(true);

  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const handleRelMac = (event: any) => {
    setRelDet(false);
    setRelMac(true);
  };

  const handleRelDet = (event: any) => {
    setRelMac(false);
    setRelDet(true);
  };

  return (
    <div className="h-screen">
      {relMac === true ? (
        <button
          className="inline-block text-center align-middle bg-white ml-2 mt-2 w-44 h-8 rounded-md text-gray-400 hover:bg-purple-700 hover:text-white transition ease-in-out delay-5"
          onClick={handleRelDet}
        >
          Relatório detalhado
        </button>
      ) : (
        <button
          className="inline-block text-center align-middle bg-white ml-2 mt-2 w-44 h-8 rounded-md text-gray-400 hover:bg-purple-700 hover:text-white transition ease-in-out delay-5"
          onClick={handleRelMac}
        >
          Relatório Macro
        </button>
      )}

      {relDet === false ? <VendaMacro /> : <VendaMicro />}
    </div>
  );
};

export default page;

// page.requireAuth = true;
