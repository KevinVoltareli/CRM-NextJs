import React, { useState, useEffect } from "react";
import { useIdContext } from "../../app/utils/IdContext";

interface ClientesObj {
  CLIENTE: string;
  DDD: number;
  CELULAR: number;
  DTCAD: string;
  DTULTCOMP: number;
  IDCLIENTE: number;
  STATUS: string;
  CRIADO: string;
}

const CampanhaClientes = () => {
  const [datas, setDatas] = useState<ClientesObj[]>([]);
  const { id } = useIdContext();

  async function getCliente() {
    const url = `http://192.168.30.252:9091/api_crm/crm/clientes.php?id=${id}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      //console.log(id);
      await getCliente().then((responseJson) => {
        setDatas(responseJson.CLIENTES);
        //console.log(responseJson);
      });
    };
    fetchData();
  }, []);

  return (
    <div className="">
      <table className="m-2 w-9/12 bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Status
            </th>
            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">
              Cliente
            </th>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              DDD
            </th>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Celular
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className=" text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.STATUS}</div>;
              })}
            </td>
            <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.CLIENTE}</div>;
              })}
            </td>

            <td className=" text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.DDD}</div>;
              })}
            </td>
            <td className="text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.CELULAR}</div>;
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CampanhaClientes;
