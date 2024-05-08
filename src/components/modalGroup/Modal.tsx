"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { useSession } from "next-auth/react";

import Select from "react-select";

interface inputObjNome {
  NOME?: string;
}
interface inputObjPlataforma {
  PLATAFORMA?: string;
}

function ModalGroup() {
  const session = useSession();

  const email = session.data?.user?.email;

  const router = useRouter();

  let subtitle: any;

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

  const [produto, setProduto] = useState({
    NOME: "",
    PLATAFORMA: "",
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valorInput = (e: any) =>
    setProduto({ ...produto, [e.target.name]: e.target.value });

  const cadProduto = async (e: any) => {
    e.preventDefault();
    //console.log(produto.titulo);

    const requestBody = {
      produto,
      email,
    };

    console.log(requestBody);

    await fetch(
      "http://192.168.30.252:9091/api_crm/crm/cadastrar_campanha.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )
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
          mensagem: "Ops, algo deu errado!",
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

      <div
        className="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover  
      "
        onClick={openModal}
      >
        <a
          className="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
          href="#"
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
        </a>
        <button
          type="submit"
          className="text-white/50 group-hover:text-white group-hover:smooth-hover text-center"
        >
          Criar campanha
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="border-2 border-purple-600 rounded p-2 wd-1/3  text-black h-full">
          <h2 className="">Cadastrar campanha</h2>

          <form onSubmit={cadProduto} className="flex flex-col  mt-10">
            <div>
              <label>Nome da campanha:</label>
              <input
                required
                name="NOME"
                onChange={valorInput}
                className="border-gray-200 border-2 ml-2 rounded "
              />
            </div>
            <div className="flex mt-6 items-center">
              <label>Plataforma:</label>

              <select
                required
                name="PLATAFORMA"
                onChange={valorInput}
                className="h-10 border-2 border-gray-200 ml-2 rounded text-sm"
              >
                <option value="" className="text-sm">
                  --Selecione--
                </option>
                <option value="Whatsapp" className="text-sm">
                  Whatsapp
                </option>
                <option value="Facebook" className="text-sm">
                  Facebook
                </option>
                <option value="Instagram" className="text-sm">
                  Instagram
                </option>
                <option value="Email" className="text-sm">
                  Email
                </option>
                <option value="Carrinho" className="text-sm">
                  Carrinho abandonado
                </option>
              </select>
            </div>

            <div className="flex justify-end items-end h-56">
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
  );
}

export default ModalGroup;
