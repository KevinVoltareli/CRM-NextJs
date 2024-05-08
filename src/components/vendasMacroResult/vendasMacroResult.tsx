"use client";
import React, { useState, useEffect } from "react";

import Datepicker from "react-tailwindcss-datepicker";

interface EstoqueObj {
  NOME: string;
  TOTAL: number;
}
async function VendaMacro() {
  const [datas, setDatas] = useState<EstoqueObj[]>([]);

  async function getVenda() {
    const dataInicial = value.startDate;
    const dataFinal = value.endDate;

    const url = `http://192.168.30.252:9091/api_crm/vendas/vendas.php?dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  const fetchData = async () => {
    //console.log(id);
    await getVenda().then((responseJson) => {
      setDatas(responseJson.VENDA);
      //console.log(responseJson);
    });
  };

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  const handleFetch = () => {
    fetchData();
  };

  return (
    <>
      <div className="flex">
        <table className="m-2 w-9/12 bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">
                Produto
              </th>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">
                Quantidade
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr>
              <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return <div key={key}>{val.NOME}</div>;
                })}
              </td>
              <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return <div key={key}>{val.TOTAL}</div>;
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-96 mt-2 ml-2">
          <Datepicker value={value} onChange={handleValueChange} />
          <button
            className="bg-white mt-2 w-1/3 rounded-md text-gray-400 hover:bg-purple-700 hover:text-white transition ease-in-out delay-5"
            onClick={handleFetch}
          >
            Clica ai
          </button>
        </div>
      </div>
    </>
  );
}

export default VendaMacro;
