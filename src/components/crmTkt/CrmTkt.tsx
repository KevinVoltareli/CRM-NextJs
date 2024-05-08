"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Select from "react-select";

import Datepicker from "react-tailwindcss-datepicker";

interface InativoObj {
  CLIENTE: string;
  TOTALPROD: number;
  TOTALVAL: number;
  DDD: number;
  CELULAR: number;
  DTCAD: string;
  DTULTCOMP: string;
  FILIAL: string;
  STATUS: string;
  IDCLIENTE: number;
  TKT: number;
}

interface FilialObj {
  filial: number;
}

async function CrmTkt() {
  const [datas, setDatas] = useState<InativoObj[]>([]);

  const [filial, setFilial] = useState<FilialObj[]>();
  const [colFil, setColFil] = useState(false);
  const [download, setDownload] = useState(false);

  var options = [
    {
      value: "todas",
      label: "Todas",
    },
    {
      value: "5",
      label: "Ecommerce",
    },
    {
      value: "4",
      label: "Aggio",
    },
    {
      value: "2",
      label: "Galao",
    },
  ];

  const handleRel = (event) => {
    if (event.value === "5") {
      setFilial("5");
      setColFil(false);
    } else if (event.value === "4") {
      setFilial("4");
      setColFil(false);
    } else if (event.value === "2") {
      setFilial("2");
      setColFil(false);
    } else if (event.value === "todas") {
      setFilial("todas");
      setColFil(true);
    }
  };

  async function getInativo() {
    const dataInicial = value.startDate;
    const dataFinal = value.endDate;

    const url = `http://192.168.30.252:9091/api_crm/crm/tkt.php?dataInicial='${dataInicial}'&dataFinal='${dataFinal}'&filial=${filial}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }
  const fetchData = async () => {
    //console.log(id);
    await getInativo().then((responseJson) => {
      setDatas(responseJson.GERAL);
      setDownload(true);
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

  const handleSearchFilial = () => {
    fetchData();
  };

  const urlDownload = `http://192.168.30.252:9091/api_crm/crm/downloadRelTkt.php?dataInicial='${value.startDate}'&dataFinal='${value.endDate}'&filial=${filial}`;

  return (
    <>
      <div className="mt-2">
        <label className="ml-2">Selecione a filal:</label>
        <br />
        <Select
          name="select-name"
          onChange={handleRel}
          placeholder="--Selecione--"
          options={options}
          className="w-1/4 m-2"
        />
        <div className="w-96 mt-2 ml-2">
          <Datepicker
            showShortcuts={true}
            showFooter={true}
            primaryColor={"amber"}
            popoverDirection="down"
            value={value}
            onChange={handleValueChange}
          />
        </div>

        <div className="flex w-screen relative">
          <button
            className="bg-white w-28 ml-2 mt-2 button-sm rounded-md text-gray-400 hover:bg-purple-700 hover:text-white transition ease-in-out delay-5"
            onClick={handleSearchFilial}
          >
            Buscar
          </button>

          {download && (
            <a href={urlDownload}>
              <button className="absolute top-0 right-8 bg-white w-32 ml-2 mt-2 button-sm rounded-md text-gray-400 hover:bg-emerald-700 hover:text-white transition ease-in-out delay-5">
                Exportar excel
              </button>
            </a>
          )}
        </div>
      </div>
      <div className="flex">
        <table className="rounded-sm text-sm m-2 w-full  bg-white">
          <thead className="bg-gray-800 text-white h-8">
            <tr>
              <th className=" uppercase font-semibold text-sm">ID cliente</th>
              <th className=" uppercase font-semibold text-sm">Status</th>
              <th className=" uppercase font-semibold text-sm">Cliente</th>
              <th className="  uppercase font-semibold text-sm">Ticket</th>
              <th className=" uppercase font-semibold text-sm">Celular</th>
              <th className=" uppercase font-semibold text-sm">
                Data cadastro
              </th>
              <th className=" uppercase font-semibold text-sm">Ult. Compra</th>
              {colFil && (
                <th className="uppercase font-semibold text-sm">Filial</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-center">
            <tr>
              <td className=" divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.IDCLIENTE}
                    </div>
                  );
                })}
              </td>
              <td className=" divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.STATUS ? val.STATUS : "."}
                    </div>
                  );
                })}
              </td>
              <td className=" divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.CLIENTE}
                    </div>
                  );
                })}
              </td>

              <td className="divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.TM}
                    </div>
                  );
                })}
              </td>

              <td className="divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.DDD} - {val.CELULAR}
                    </div>
                  );
                })}
              </td>
              <td className="divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.DTCAD}
                    </div>
                  );
                })}
              </td>
              <td className=" divide-y divide-solid">
                {" "}
                {Object.values(datas).map((val, key) => {
                  return (
                    <div className="sm:text-xs md:text-xs" key={key}>
                      {val.DTULTCOMP}
                    </div>
                  );
                })}
              </td>
              {colFil && (
                <td className="divide-y divide-solid">
                  {" "}
                  {Object.values(datas).map((val, key) => {
                    return (
                      <div className="sm:text-xs md:text-xs" key={key}>
                        {val.FILIAL}
                      </div>
                    );
                  })}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CrmTkt;
