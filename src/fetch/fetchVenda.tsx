"use client";
import React, { FC, useState, useEffect } from "react";
import axios from "axios";

interface CrmObj {
  id: string;
  STATUS: string;
}

const FetchM1: FC = () => {
  const [M1, setM1] = useState<CrmObj[]>([]);

  useEffect(() => {
    axios
      .get("http://192.168.30.252:9091/api_crm/dashboard_crm/crmTaxa.php?id=M1")
      .then((response) => {
        setM1(response.data);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }, []);

  console.log(M1);

  return (
    <div>
      {M1.map((item, index) => (
        <div key={index}>{item.STATUS}</div>
      ))}
    </div>
  );
};

export default FetchM1;
