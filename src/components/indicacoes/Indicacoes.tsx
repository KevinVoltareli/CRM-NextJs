"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useIdContext } from "../../app/utils/IdContext";
import { BiEdit } from "react-icons/bi";

const Indicacoes = () => {
  const { id } = useIdContext();

  const [datas, setDatas] = useState<any>([]);
  const [idIndicacao, setIdIndicacao] = useState(null);

  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "45%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "350px",
      height: "350px",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function getCliente() {
    const url = `http://192.168.30.252:9091/api_crm/crm/recuperaIndicacoes.php?id=${id}`;

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
        setIdIndicacao(responseJson.IDINDICACAO);
      });
    };
    fetchData();
  }, []);

  //update na conversão da indicação
  const [conversao, setConv] = useState();
  const [mensagemTempo, setMensagemTempo] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const updateConv = () => {
    if (!conversao || idIndicacao === null) return;
    const postData = {
      id: idIndicacao,
      tag: conversao,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/updateConversaoIndicacao.php",
        postData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("Status updated successfully");
        setStatus({
          type: "success",
          mensagem: "Valor atualizado",
        });

        // Refresh the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setStatus({
          type: "erro",
          mensagem: "Ops, alguma coisa deu errado ):",
        });
      });
  };

  const openModalWithId = (id) => {
    // Armazene o id na função updateConv
    setIdIndicacao(id);
    openModal();
  };

  console.log(idIndicacao);

  return (
    <div className="h-screen">
      <div className="absolute top-0 right-0 z-40 mt-4 mr-4">
        {status.type === "erro" ? (
          <div>
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
        {mensagemTempo && status.type === "success" ? (
          <div>
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
      </div>
      <table className="m-2 w-9/12 bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Indicador
            </th>
            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">
              Tel indicador
            </th>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Indicado
            </th>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Tel indicado
            </th>
            <th className=" text-left py-3 px-4 uppercase font-semibold text-sm">
              Conversão
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className=" text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.INDICADOR}</div>;
              })}
            </td>
            <td className="w-1/3 text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return (
                  <div key={key}>
                    {val.DDD}-{val.CELULAR}
                  </div>
                );
              })}
            </td>

            <td className=" text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.INDICADO}</div>;
              })}
            </td>
            <td className="text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return <div key={key}>{val.NUMERO}</div>;
              })}
            </td>
            <td className="text-left py-3 px-4 divide-y divide-solid">
              {" "}
              {Object.values(datas).map((val, key) => {
                return (
                  <div key={key}>
                    {val.CONVERSAO === null ? (
                      <>
                        <button
                          onClick={() => openModalWithId(val.IDINDICACAO)}
                        >
                          <BiEdit size={20} />
                        </button>
                      </>
                    ) : (
                      val.CONVERSAO
                    )}{" "}
                  </div>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex flex-col justify-center items-center border-2 border-purple-600 rounded  text-black h-full">
          <input
            placeholder="1200,00"
            type="number"
            onChange={(e) => setConv(e.target.value)}
            className="border-2 border-gray-200 rounded-md "
          />
          <button
            className="mt-4 ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
            onClick={updateConv}
          >
            Atualizar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Indicacoes;
