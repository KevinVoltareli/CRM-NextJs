"use client";
import React, { useState, useEffect } from "react";

interface EstoqueObj {
  COR: string;
  QTD: number;
}
async function getCor() {
  const [datas, setDatas] = useState<EstoqueObj[]>([]);

  async function getEstoque() {
    const url =
      "http://192.168.30.252:9091/api_crm/estoque/detalhes_estoque/cor.php";

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      //console.log(id);
      await getEstoque().then((responseJson) => {
        setDatas(responseJson.ESTOQUE);
        //console.log(responseJson);
      });
    };
    fetchData();
  }, []);

  return (
    <>
      <table className="m-2 w-96 bg-white">
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
        <tbody className="text-gray-700 text-xs w-96">
          <tr>
            <td className=" text-left py-3 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.COR}</div>;
              })}
            </td>
            <td className=" text-left divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.QTD}</div>;
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default getCor;
