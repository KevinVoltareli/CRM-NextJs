import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "tailwindcss/tailwind.css";
import { format } from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";

interface FetchObj {
  TXX: number;
  STATUS: string;
  RESPOSTA: number;
  STATUSCOUNT: number;
  NOME: string;
  ID: string;
  VALORCONVERSAO: number;
  INDICADOCOUNT: number;
  TM: number;
  DIA: string;
  TAG: string;
  TAGCONT: number;
}

interface CampObj {
  NOME: string;
  ID: any;
}

interface GrafObj {
  ID_CLI: number;
  ID_CAM: number;
  NOME: string;
}

const DashboardCrm = () => {
  const chartRefGrafi = useRef<HTMLCanvasElement | null>(null);
  const [datas, setDatas] = useState<FetchObj[]>([]);
  const [datasCrmTaxa, setDatasCrmTaxa] = useState<FetchObj[]>([]);
  const [camp, setCamp] = useState<CampObj[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [graf, setGraf] = useState<GrafObj[]>([]);
  const [dataOverview, setDataOverview] = useState<FetchObj[]>([]);
  const [dataOverviewIndicacao, setDataOverviewIndicacao] = useState<
    FetchObj[]
  >([]);
  const [dataM1Dia, setDataM1Dia] = useState<FetchObj[]>([]);
  const [dataM2Dia, setDataM2Dia] = useState<FetchObj[]>([]);
  const [dataFeedbackDia, setDataFeedbackDia] = useState<FetchObj[]>([]);
  const [dataOportunidadeDia, setDataOportunidadeDia] = useState<FetchObj[]>(
    []
  );
  const [dataVendaCertaDia, setDataVendaCertaDia] = useState<FetchObj[]>([]);
  const [dataVendaDia, setDataVendaDia] = useState<FetchObj[]>([]);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;

      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);

        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmTaxa.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDatasCrmTaxa(response.data.CRMTX);
            setDatas(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //overview
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmOverview.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataOverview(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //overview INDICAÇÃO
  useEffect(() => {
    async function fetchData() {
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmOverviewIndicacao.php?id=${selectedOptionNumber}`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataOverviewIndicacao(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption]);

  //m1 dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmM1Dia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataM1Dia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //m2 dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmM2Dia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataM2Dia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //feedback dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmFeedbackDia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataFeedbackDia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //oportunidade dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmOportunidadeDia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataOportunidadeDia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //venda certa dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmVendaCertaDia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataVendaCertaDia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  //venda certa dia
  useEffect(() => {
    async function fetchData() {
      const dataInicial = value.startDate;
      const dataFinal = value.endDate;
      try {
        const selectedOptionNumber = parseInt(selectedOption, 10);
        if (!isNaN(selectedOptionNumber)) {
          const response = await axios.get(
            `http://192.168.30.252:9091/api_crm/dashboard_crm/crmVendaDia.php?id=${selectedOptionNumber}&dataInicial='${dataInicial}'&dataFinal='${dataFinal}'`
          );

          if (response.data && Array.isArray(response.data.CRMTX)) {
            setDataVendaDia(response.data.CRMTX);
          } else {
            console.error("", response.data);
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    if (selectedOption !== "") {
      fetchData();
    }
  }, [selectedOption, value.startDate, value.endDate]);

  useEffect(() => {
    async function fetchCampanhas() {
      try {
        const response = await axios.get(
          "http://192.168.30.252:9091/api_crm/crm/campanhas.php"
        );

        if (response.data && Array.isArray(response.data.CAMPANHAS)) {
          setCamp(response.data.CAMPANHAS);
        } else {
          console.error("", response.data);
        }
      } catch (error) {
        console.error("", error);
      }
    }

    fetchCampanhas();
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get(
          "http://192.168.30.252:9091/api_crm/dashboard_crm/crmGrafico.php"
        );

        if (response.data && Array.isArray(response.data.GRAFICO)) {
          setGraf(response.data.GRAFICO);

          if (chartRefGrafi.current) {
            const ctx = chartRefGrafi.current.getContext("2d");
            if (ctx) {
              new Chart(ctx, {
                type: "bar",
                data: {
                  labels: graf.map((val: any) => val.NOME),
                  datasets: [
                    {
                      label: "Respostas por Campanha",
                      data: graf.map((val: any) => val.ID_CAM),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                    },
                  ],
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                  color: "black",
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: {
                      left: 20,
                      right: 20,
                      top: 20,
                      bottom: 20,
                    },
                  },
                },
              });
            }
          }
        }
      } catch (error) {
        console.error("", error);
      }
    }

    fetchChartData();
  }, []);

  return (
    <div className="min-screen">
      <div className="min-screen">
        <div className="w-64 mt-2 ml-2">
          <Datepicker
            showShortcuts={true}
            showFooter={true}
            primaryColor={"amber"}
            popoverDirection="down"
            value={value}
            onChange={handleValueChange}
          />
        </div>

        <select
          onChange={handleOptionChange}
          className={`w-100 p-2 border rounded mt-4 mx-2 ${
            isSelectFocused ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <option value="">-- Escolha a opção --</option>
          {camp.map((val, key) => (
            <option key={key} value={val.ID}>
              {val.NOME}
            </option>
          ))}
        </select>
      </div>

      <div className="flex">
        {dataOverviewIndicacao.map((val, key) => (
          <div
            key={key}
            className="mt-4 ml-4 w-56 h-56 bg-white rounded flex flex-col items-center  "
          >
            <div className="flex w-48 justify-center items-center">
              <div className="mt-4 w-44 bg-sky-600 rounded h-12 w-12 flex items-center justify-center text-white">
                Overview indicação
              </div>
            </div>
            <div className="mt-4 ml-2">
              <div className="text-left space-y-2 text-black">
                <p>
                  Qtd indicados:{" "}
                  <span className="font-semibold">{val.INDICADOCOUNT}</span>
                </p>
                <p>
                  Ticket médio: <span className="font-semibold">{val.TM}</span>
                </p>
                <p>
                  Valor convertido:{" "}
                  <span className="font-semibold">R$ {val.VALORCONVERSAO}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {dataOverview.map((val, key) => (
          <div
            key={key}
            className="mt-4 ml-4 px-4 h-56 bg-white rounded flex flex-col items-center "
          >
            <div className="flex w-48 justify-center  items-center">
              <div className="mt-4 w-32 bg-sky-600 rounded h-12 w-12 flex items-center justify-center text-white">
                Overview
              </div>
            </div>
            <div className="mt-4 ml-2">
              <div className="text-left space-y-2 text-black">
                <p>
                  Qtd clientes:{" "}
                  <span className="font-semibold">{val.STATUSCOUNT}</span>
                </p>
                <p>
                  Qtd resposta:{" "}
                  <span className="font-semibold">{val.RESPOSTA}</span>
                </p>
                <p>
                  % resposta: <span className="font-semibold">{val.TXX}%</span>
                </p>
                <p>
                  Valor convertido:{" "}
                  <span className="font-semibold">R$ {val.VALORCONVERSAO}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-700  m-2 rounded ">
        <div className="flex ">
          <div className="m-8 flex w-screen  text-sm grid grid-cols-7 gap-4">
            {datas.map((val, key) => (
              <div
                key={key}
                className="w-48 h-56 bg-white rounded flex flex-col  "
              >
                <div className="flex w-48 justify-center  items-center">
                  <div className="mt-4 w-32 bg-violet-600 rounded h-12 w-12 flex items-center justify-center text-white">
                    {val.STATUS}
                  </div>
                </div>
                <div className="mt-4 ml-2">
                  <div className="text-left space-y-2 text-black">
                    <p>
                      Qtd clientes:{" "}
                      <span className="font-semibold">{val.STATUSCOUNT}</span>
                    </p>
                    <p>
                      Qtd resposta:{" "}
                      <span className="font-semibold">{val.RESPOSTA}</span>
                    </p>
                    <p>
                      % resposta:{" "}
                      <span className="font-semibold">{val.TXX}%</span>
                    </p>
                    <p>
                      Valor convertido:{" "}
                      <span className="font-semibold">
                        {val.VALORCONVERSAO}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-violet-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>M1</span>
              </div>

              {dataM1Dia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataM1Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataM1Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataM1Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataM1Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-indigo-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>M2</span>
              </div>

              {dataM2Dia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataM2Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataM2Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataM2Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataM2Dia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-emerald-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>Feedback</span>
              </div>

              {dataFeedbackDia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataFeedbackDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataFeedbackDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataFeedbackDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataFeedbackDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-pink-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>Oportunidade</span>
              </div>

              {dataOportunidadeDia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tag</span>
                </div>
                {dataOportunidadeDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TAG}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataOportunidadeDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataOportunidadeDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataOportunidadeDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataOportunidadeDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-yellow-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>Venda Certa</span>
              </div>

              {dataVendaCertaDia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tag</span>
                </div>
                {dataVendaCertaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TAG}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataVendaCertaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataVendaCertaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataVendaCertaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataVendaCertaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="w-full ">
          <div className="flex flex-col w-full border-t border-r border-slate-400">
            <div className="flex flex-shrink-0 bg-red-800 text-white">
              <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                <span>Venda</span>
              </div>

              {dataVendaDia.map((val, key) => (
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400">
                  <span>{format(new Date(val.DIA), "dd/MM")}</span>
                </div>
              ))}
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tag</span>
                </div>
                {dataVendaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TAG}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente</span>
                </div>
                {dataVendaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.STATUSCOUNT}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Qtd. cliente resp.</span>
                </div>
                {dataVendaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.RESPOSTA}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Tx. resposta.</span>
                </div>
                {dataVendaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.TXX}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-auto">
              <div className="flex flex-shrink-0">
                <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                  <span>Valor convertido R$</span>
                </div>
                {dataVendaDia.map((val, key) => (
                  <div className="flex items-center flex-grow w-0 h-10 px-2 border-b border-l border-slate-400 text-white">
                    <span>{val.VALORCONVERSAO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCrm;
