"use client";

import React, { useEffect, useState } from "react";
import DashboardCrm from "../../components/dashboardCrm/DashboardCrm";
import DashboardVendas from "@/components/dashboardCrm/DashboardVendas";
import DashboardEstoque from "@/components/dashboardCrm/DashboardEstoque";
import FetchM1 from "../../fetch/FetchM1";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const page = () => {
  const [venda, setVenda] = useState(false);

  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const handleVenda = () => {
    setVenda(true);
    setCrm(false);
    setEstoque(false);
  };

  const [estoque, setEstoque] = useState(false);

  const handleEstoque = () => {
    setEstoque(true);
    setVenda(false);
    setCrm(false);
  };

  const [crm, setCrm] = useState(false);

  const handleCrm = () => {
    setCrm(true);
    setEstoque(false);
    setVenda(false);
  };

  const handleFetch = () => {
    setCrm(false);
    setEstoque(false);
    setVenda(false);
  };

  return (
    <div
      style={{ background: "#15171B" }}
      className="min-w-screen min-h-screen "
    >
      {/* <div className="">
        <div className="m-2">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 ml-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <div onClick={handleCrm}>Dashboard CRM</div>
              </li>
              <li>
                <div onClick={handleVenda}>Dashboard Vendas</div>
              </li>
              <li>
                <div onClick={handleEstoque}>Dashboard Estoque</div>
              </li>
              <li>
                <div onClick={handleFetch}>Dashboard teste </div>
              </li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* {venda && <DashboardVendas />}
      {estoque && <DashboardEstoque />} */}
      <DashboardCrm />
    </div>
  );
};

export default page;
