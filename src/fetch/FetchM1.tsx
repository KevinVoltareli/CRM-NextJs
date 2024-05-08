"use client";
import React, { FC, useState, useEffect } from "react";
interface fetchObj {
  TXX: number;
  STATUS: string;
  RESPOSTA: number;
  STATUSCOUNT: number;
}

const FetchM1 = () => {
  const [datas, setDatas] = useState<fetchObj[]>([]);

  async function getM1() {
    const url = "http://192.168.30.252:9091/api_crm/dashboard_crm/crmTaxa.php";

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      //console.log(id);
      await getM1().then((responseJson) => {
        setDatas(responseJson.CRMTX);
        //console.log(responseJson);
      });
    };
    fetchData();
  }, []);

  return (
    <>
      {Object.values(datas).map((val, key) => {
        return (
          <div className="w-48 h-48 bg-white rounded flex flex-col">
            <div className="flex w-48 justify-center  items-center">
              <div className="mt-4 w-32 bg-violet-600 rounded h-12 w-12 flex items-center justify-center text-white">
                {val.STATUS}
              </div>
            </div>
            <div className="mt-4 ml-2">
              <div className="text-left ">
                <p>Qtd clientes:{val.STATUSCOUNT}</p>
                <p>Qtd resposta:{val.RESPOSTA}</p>
                <p>% resposta:{val.TXX}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FetchM1;
