"use client";
import React, { useState, useEffect } from "react";
import LogoZap from "../../components/logoZap/LogoZap";
import ModalGroup from "../../components/modalGroup/Modal";
import LogoFb from "../../components/LogoFb/LogoFb";
import LogoIg from "../../components/LogoIg/LogoIg";
import LogoEmail from "../../components/logoEmail/LogoEmail";
import LogoCarrinho from "../../components/logoCarrinho/LogoCarrinho";
import { format } from "date-fns";
import { FaTrashAlt } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "./calendario.css";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Campanha {
  NOME: string;
  DATA: number;
  id: number;
  PLATAFORMA: string;
  ID: number;
}

const Campanhas = () => {
  const [date, setDate] = useState(new Date());
  const [camp, setCamp] = useState(false);
  const [show, setShow] = useState(false);
  const [datas, setDatas] = useState<Campanha[]>([]);
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  async function getCalendario() {
    const url = `http://192.168.30.252:9091/api_crm/crm/modalCalendario.php`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  async function getCampanhas() {
    const url = `http://192.168.30.252:9091/api_crm/crm/campanhas.php`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  }

  const fetchData = async () => {
    await getCampanhas().then((responseJson) => {
      setDatas(responseJson.CAMPANHAS);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function reload() {
    setTimeout(() => {
      location.reload();
    }, 1500);
  }

  const apagarProduto = async (ID: number) => {
    await fetch(
      "http://192.168.30.252:9091/api_crm/crm/deletar_campanha.php?id=" + ID
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.erro) {
          setStatus({
            type: "erro",
            mensagem: responseJson.mensagem,
          });
        } else {
          setStatus({
            type: "success",
            mensagem: responseJson.mensagem,
          });
          reload();
        }
      })
      .catch(() => {
        setStatus({
          type: "erro",
          mensagem: "Oops, alguma coisa deu errado ): ",
        });
      });

    await fetch(
      "http://192.168.30.252:9091/api_crm/crm/deletar_cliente.php?id=" + ID
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.erro) {
          setStatus({
            type: "erro",
            mensagem: responseJson.mensagem,
          });
        } else {
          setStatus({
            type: "success",
            mensagem: responseJson.mensagem,
          });
          reload();
        }
      })
      .catch(() => {
        setStatus({
          type: "erro",
          mensagem: "Oops, alguma coisa deu errado ): ",
        });
      });
  };
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataTermino: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://192.168.30.252:9091/api_crm/crm/form_calendario.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: formData.titulo,
            descricao: formData.descricao,
            dataInicio: formData.dataInicio,
            dataTermino: formData.dataTermino,
          }),
        }
      );

      if (response.ok) {
        setStatus({
          type: "success",
          mensagem: "Dados enviados com sucesso!",
        });
        reload();
        setShowModal(false);
      } else {
        const responseData = await response.json();
        setStatus({
          type: "erro",
          mensagem: responseData.mensagem,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setStatus({
        type: "erro",
        mensagem: "Ocorreu um erro ao enviar os dados.",
      });
    }
  };

  //recuperando dados pro calendario
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Faça uma requisição GET para obter os eventos/datas do servidor
    fetch("http://192.168.30.252:9091/api_crm/crm/eventos_calendario.php") // Substitua pela URL correta
      .then((response) => response.json())
      .then((data) => {
        // Estruture os eventos no formato exigido pelo FullCalendar
        const formattedEvents = data.map((evento: any) => ({
          title: evento.TITULO,
          start: evento.DATA_INICIO,
          descricao: evento.DESCRICAO,
          end: evento.DATA_TERMINO,
        }));

        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error("Erro ao buscar eventos:", error);
      });
  }, []);

  const [view, setView] = useState("month");

  const toggleView = () => {
    setView((prevView) => (prevView === "month" ? "list" : "month"));
  };

  return (
    <>
      {status.type === "erro" ? (
        <div className="absolute right-4 top-4">
          <div
            className="max-w-xs bg-gray-500 text-sm text-white rounded-md shadow-lg dark:bg-gray-700 mb-3 ml-3"
            role="alert"
          >
            <div className="flex p-4">
              {status.mensagem}
              <div className="ml-auto">
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-white/[.5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-600 focus:ring-gray-500 transition-all text-sm dark:focus:ring-offset-gray-700 dark:focus:ring-gray-500"
                ></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {status.type === "success" ? (
        <div className="absolute right-4 top-4">
          <div
            className="max-w-xs bg-green-500 text-sm text-white rounded-md shadow-lg mb-3 ml-3"
            role="alert"
          >
            <div className="flex p-4">
              {status.mensagem}
              <div className="ml-auto">
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-white/[.5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-green-500 transition-all text-sm dark:focus:ring-offset-green-500 dark:focus:ring-green-700"
                ></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="bg-black-900 flex min-h-screen">
        <div className="bg-gray-700 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 w-screen sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
          <div className="flex-1 px-2 sm:px-0 ">
            {show === false ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl text-white p-2 rounded-lg  font-light">
                    Grupos de campanhas
                  </h3>
                  <div className="absolute top-0 right-0 z-40 mt-4 mr-4"></div>
                  <div className="inline-flex items-center space-x-2">
                    <button onClick={handleShow}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="#fff"
                        viewBox="0 0 448 512"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-2 sm:mb-0 mt-2 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                  <ModalGroup />
                  {Object.values(datas).map((val, key) => {
                    return (
                      <div
                        key={key}
                        className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center rounded-md hover:bg-gray-900/80 hover:smooth-hover"
                      >
                        <div
                          className="absolute top-2 right-2 cursor-pointer"
                          onClick={() => apagarProduto(val.ID)}
                        >
                          <FaTrashAlt />
                        </div>
                        {val.PLATAFORMA === "Whatsapp" && <LogoZap />}
                        {val.PLATAFORMA === "Facebook" && <LogoFb />}
                        {val.PLATAFORMA === "Instagram" && <LogoIg />}
                        {val.PLATAFORMA === "Email" && <LogoEmail />}
                        {val.PLATAFORMA === "Carrinho" && <LogoCarrinho />}

                        <a href={"/campanhas/" + val.ID}>
                          <h4 className="text-white text-md font-bold capitalize text-center  hover:smooth-hover hover:text-yellow-300">
                            {val.NOME}
                          </h4>
                        </a>
                        <p className="text-white/50">
                          Criado em: {format(new Date(val.DATA), "dd/MM/yyyy")}
                        </p>
                        <p className="absolute top-2 text-white/20 inline-flex items-center text-xs">
                          Id Campanha: {val.ID}
                          <span className="ml-2 w-2 h-2 block bg-green-500 rounded-full group-hover:animate-pulse"></span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl text-white p-2 rounded-lg  font-light">
                    Planejamento
                  </h3>
                  <div className="absolute top-0 right-0 z-40 mt-4 mr-4"></div>
                  <div className="inline-flex items-center space-x-2">
                    <button onClick={handleShow}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#fff"
                        className="bi bi-grid h-6 w-6"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleShowModal}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Adicionar um evento
                  </button>
                </div>
                <div>
                  <button
                    onClick={toggleView}
                    className="bg-white w-48 h-8 mt-4 text-black hover:bg-slate-100 rounded"
                  >
                    {view === "month" ? "Mostrar Lista" : "Mostrar Mês"}
                  </button>
                  {view === "month" && (
                    <FullCalendar
                      locale="pt-BR"
                      selectable={false}
                      select={function (info) {
                        //alert("Inicio do evento" + info.start.toLocaleDateString());
                      }}
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                      ]}
                      initialView="dayGridMonth"
                      events={events}
                      height="800px"
                    />
                  )}
                  {view === "list" && (
                    <FullCalendar
                      locale="pt-BR"
                      selectable={false}
                      select={function (info) {
                        //alert("Inicio do evento" + info.start.toLocaleDateString());
                      }}
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                      ]}
                      initialView="listMonth"
                      events={events}
                      height="800px"
                      eventContent={(eventInfo) => {
                        return (
                          <div>
                            <p>{eventInfo.event.title}</p>
                            <p>{eventInfo.event.extendedProps.descricao}</p>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <h2 className="text-2xl font-semibold mb-4">Enviar Formulário</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="titulo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Título:
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className="mt-1 p-2 w-full border rounded-lg"
                    onChange={handleChange}
                    value={formData.titulo}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Descrição:
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    className="mt-1 p-2 w-full border rounded-lg"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="dataInicio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Data de Início:
                  </label>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    className="mt-1 p-2 w-full border rounded-lg"
                    onChange={handleChange}
                    value={formData.dataInicio}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="dataTermino"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Data de Término:
                  </label>
                  <input
                    type="date"
                    id="dataTermino"
                    name="dataTermino"
                    className="mt-1 p-2 w-full border rounded-lg"
                    onChange={handleChange}
                    value={formData.dataTermino}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200"
                  >
                    Enviar
                  </button>
                  <button
                    type="button"
                    className="ml-2 bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition duration-200"
                    onClick={handleCloseModal}
                  >
                    Fechar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Campanhas;
