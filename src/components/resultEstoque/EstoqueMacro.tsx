"use client";
import React, { useState, useEffect } from "react";

import { getEstoque } from "./GetEstoque";

interface EstoqueObj {
  APELIDO: string;
  QTD: number;
}
async function EstoqueMacro() {
  const [datas, setDatas] = useState<EstoqueObj[]>([]);

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
              Quantidade estoque
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.APELIDO}</div>;
              })}
            </td>
            <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
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

export default EstoqueMacro;
