"use client";
import React, { useState } from "react";
import CrmInativo from "../../components/crmInativo/CrmInativo";

import Select from "react-select";
import CrmGeral from "../../components/crmFrequencia/CrmFrequencia";
import CrmTkt from "../../components/crmTkt/CrmTkt";
import CrmRecencia from "../../components/crmRecencia/CrmRecencia";
import CrmVendas from "../../components/crmVendas/CrmVendas";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface SelectProps {
  value: number;
  label: string;
}

const crm = () => {
  const [relInativo, setRelInativo] = useState<SelectProps>(false);
  const [relGeral, setRelGeral] = useState<SelectProps>(false);
  const [relTkt, setRelTkt] = useState<SelectProps>(false);
  const [relRecencia, setRecencia] = useState<SelectProps>(false);
  const [relVendas, setRelVendas] = useState<SelectProps>(false);

  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  var options = [
    {
      value: "1",
      label: "Clientes inativos",
    },
    {
      value: "2",
      label: "Frequência",
    },
    {
      value: "3",
      label: "Ticket",
    },
    {
      value: "4",
      label: "Recência",
    },
    {
      value: "5",
      label: "Total venda",
    },
  ];

  const handleRel = (event) => {
    if (event.value === "1") {
      setRelGeral(false);
      setRelTkt(false);
      setRecencia(false);
      setRelVendas(false);
      setRelInativo(true);
    } else if (event.value === "2") {
      setRelInativo(false);
      setRelTkt(false);
      setRecencia(false);
      setRelVendas(false);
      setRelGeral(true);
    } else if (event.value === "3") {
      setRelInativo(false);
      setRelGeral(false);
      setRecencia(false);
      setRelVendas(false);
      setRelTkt(true);
    } else if (event.value === "4") {
      setRelInativo(false);
      setRelGeral(false);
      setRelTkt(false);
      setRelVendas(false);
      setRecencia(true);
    } else if (event.value === "5") {
      setRelInativo(false);
      setRelGeral(false);
      setRelTkt(false);
      setRecencia(false);
      setRelVendas(true);
    }
  };

  return (
    <div className="mt-2 min-h-screen">
      <label className="ml-2 text-white">Selecione o relatório:</label>
      <br />
      <Select
        name="select-name"
        onChange={handleRel}
        placeholder="Escolha o relatório"
        options={options}
        className="w-1/4 m-2"
      />

      {relInativo && <CrmInativo />}
      {relGeral && <CrmGeral />}
      {relTkt && <CrmTkt />}
      {relRecencia && <CrmRecencia />}
      {relVendas && <CrmVendas />}
    </div>
  );
};

export default crm;
