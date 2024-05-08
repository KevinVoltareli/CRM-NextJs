"use client";

import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import Dnd from "../../../components/DragNDrop/Dnd";
import IdContext from "../../utils/IdContext";
import CampanhaClientes from "../../../components/campanhaClientes/CampanhaClientes";
import Indicacoes from "../../../components/indicacoes/Indicacoes";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  const id = params.id;

  let subtitle: any;

  const [produto, setProduto] = useState({
    ID_CLIENTE: "",
    STATUS: "",
  });

  const customStyles = {
    content: {
      top: "45%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      height: "450px",
    },
  };

  function reload() {
    setTimeout(() => {
      setIsOpen(false);
      location.reload();
    }, 3000);
  }

  const [modalIsOpen, setIsOpen] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valorInput = (e: any) =>
    setProduto({ ...produto, [e.target.name]: e.target.value });
  const url = `http://192.168.30.252:9091/api_crm/crm/cadastrar_cliente.php?id=${id}`;

  const cadProduto = async (e: any) => {
    e.preventDefault();
    //console.log(produto.titulo);

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produto }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson)
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
          mensagem: "Ops, alguma coisa deu errado!",
        });
      });
    if (status.type === "success") {
    }
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

  const [isHamburger, setIsHamburger] = useState(true);
  const [showReport, setShowReport] = useState(false);

  const handleClick = () => {
    setIsHamburger(!isHamburger);
    setShowReport(!showReport);
  };

  const [showIndicacoes, setShowIndicacoes] = useState(false);

  const handleIndicacoes = () => {
    setShowIndicacoes(!showIndicacoes);
  };

  return (
    <div>
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
        {status.type === "success" ? (
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
      <div>
        <div className="flex ">
          <div className=" flex " onClick={openModal}>
            <a className="" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </a>
            <button
              type="submit"
              className="text-white/50 group-hover:text-white group-hover:smooth-hover text-center"
            >
              Adicionar cliente
            </button>
          </div>

          <div className="ml-4 justify-baseline">
            <Link
              className="flex"
              href={"http://192.168.30.252:9091/api_crm/file_xlsx/index.php"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="mt-2">Adicionar multiplos</span>
            </Link>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="border-2 border-purple-600 rounded p-2 wd-1/3  text-black h-full">
            <h2 className="">Cadastrar cliente</h2>

            <form onSubmit={cadProduto} className="flex flex-col  mt-10">
              <div className="flex mt-6">
                <label>ID do cliente:</label>
                <input
                  required
                  name="ID_CLIENTE"
                  onChange={valorInput}
                  className="border-2 ml-2 rounded "
                />
              </div>
              <div className="flex mt-2">
                <label className="mt-2">Status:</label>
                <select required name="STATUS" onChange={valorInput}>
                  <option>--Selecione--</option>
                  <option value="LISTA">INICIO</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                  <option value="M3">M3</option>
                  <option value="OPORTUNIDADE">OPORTUNIDADE </option>
                  <option value="VENDA CERTA">VENDA CERTA</option>
                  <option value="VENDA">VENDA</option>
                  <option value="FEEDBACK">FEEDBACK</option>
                  <option value="RELACIONAMENTO">RELACIONAMENTO</option>
                  <option value="ERRO">ERRO</option>
                </select>
              </div>

              <div className="flex justify-end items-end h-28">
                <button
                  onClick={closeModal}
                  className="border-2 w-24 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="ml-2 border-2 border-purple-600 bg-purple-600 text-white w-24 rounded hover:bg-orange-400 hover:border-orange-400"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
      {/* Botões*/}

      {showIndicacoes ? (
        <>
          <button
            onClick={handleIndicacoes}
            className="ml-2 bg-gray-100 rounded p-2 text-black hover:bg-gray-200"
          >
            Kanban
          </button>
          <IdContext.Provider value={{ id }}>
            <Indicacoes />
          </IdContext.Provider>
        </>
      ) : (
        <>
          <button
            onClick={handleIndicacoes}
            className="ml-2 bg-gray-100 rounded p-2 text-black hover:bg-gray-200"
          >
            Indicações
          </button>
          <div>
            <button
              className="bg-gray-200 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded transition-all duration-300 m-2"
              onClick={handleClick}
            >
              {isHamburger ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 640 512"
                >
                  <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              )}
            </button>
            {isHamburger ? (
              <IdContext.Provider value={{ id }}>
                <Dnd />
              </IdContext.Provider>
            ) : (
              <IdContext.Provider value={{ id }}>
                <CampanhaClientes />
              </IdContext.Provider>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default page;
