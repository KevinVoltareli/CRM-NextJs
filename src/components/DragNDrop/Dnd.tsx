import React, { useEffect, useState } from "react";
import axios from "axios";
import Board from "react-trello";

import Modal from "react-modal";

import { useIdContext } from "../../app/utils/IdContext";

import { FcOk } from "react-icons/fc";

import { BiCommentDetail, BiHistory } from "react-icons/bi";

import { useSession } from "next-auth/react";

type BoardData = {
  lanes: {
    id: string;
    title: string;
    cards: any[];
  }[];
};

const TrelloBoard = () => {
  const { id } = useIdContext();
  const [boardData, setBoardData] = useState<BoardData>({ lanes: [] });

  const [searchQuery, setSearchQuery] = useState("");

  const session = useSession();

  const email = session.data?.user?.email;

  const [id2, setId2] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa

  // Função para aplicar a pesquisa
  const applySearch = (clients: any) => {
    if (searchTerm === "") {
      return clients; // Retorna todos os clientes se a pesquisa estiver vazia
    } else {
      return clients.filter(
        (client: any) =>
          client.CLIENTE.includes(searchTerm) || // Filtra por nome do cliente
          client.CELULAR.includes(searchTerm) // Filtra por telefone
      );
    }
  };

  useEffect(() => {
    axios
      .get(`http://192.168.30.252:9091/api_crm/crm/rotaCliente.php?id=${id}`)
      .then((response) => {
        const clients = response.data;
        const filteredClients = applySearch(clients); // Aplicar a pesquisa aos clientes

        // Mapear os clientes para as lanes com base no status
        const lanes = [
          "LISTA",
          "M1",
          "M2",
          "M3",
          "FEEDBACK",
          "RELACIONAMENTO",
          "OPORTUNIDADE",
          "VENDA CERTA",
          "VENDA",
          "ERRO",
        ].map((status) => {
          const statusClients = filteredClients.filter(
            (client: any) => client.STATUS === status
          );
          const statusCount = statusClients.length;

          return {
            id: status,
            title: `${status} (${statusCount})`,
            cards: statusClients.map((client: any) => ({
              id: client.IDCLIENTE,
              title: client.CLIENTE,
              label: client.CRIADO,
              description: client.TAG,
              descriptionEtiqueta: client.ETIQUETA,
              resposta: client.RESPOSTA,
              data: { CLIENTE: client.CLIENTE },
              descriptionStyle: getDescriptionStyle(client.TAG),
              descriptionStyleEtiqueta: getDescriptionStyleEtiqueta(
                client.ETIQUETA
              ),
            })),
          };
        });

        // Crie as lanes com base nos dados mapeados
        setBoardData({ lanes });
      })
      .catch((error) => console.error(error));
  }, [id, searchTerm]);

  const handleCardMove = (
    cardId: any,
    sourceLaneId: any,
    targetLaneId: any
  ) => {
    // Find the lane that contains the moved card
    const lane = boardData.lanes.find((lane) => lane.id === sourceLaneId);

    // Find the card object that matches the cardId
    const card = lane?.cards.find((card) => card.id === cardId);

    if (!card) {
      console.error("Card not found");
      return;
    }

    // Extract the ID_CLIENTE from the card's data
    const idCliente = card?.id;

    if (!idCliente) {
      console.error("ID_CLIENTE not found in card data");
      return;
    }

    console.log("cardId:", cardId);
    // Update the client status in the database via API
    const postData = {
      id: idCliente,
      status: targetLaneId,
    };
    console.log("POST Data:", postData);

    // Make the API call with the correct headers
    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/rotaCliente.php",
        postData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  const [cli, setCli] = useState({});
  const [log, setLog] = useState();
  const [recuperaComent, setRecuperaComent] = useState();
  const [dataFetched, setDataFetched] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSubTag, setSelectedSubTag] = useState("");

  const [controlaComentLog, setComentLog] = useState(false);

  const handleComentLog = () => {
    setComentLog(!controlaComentLog);
  };

  function openModal(cardId: any) {
    setIsOpen(true);
    setSelectedCardId(cardId); // Set the selectedCardId state to the cardId
  }
  async function getCli() {
    try {
      const url = `http://192.168.30.252:9091/api_crm/crm/modalClienteDnd.php?id=${selectedCardId}`;
      const res = await fetch(url);
      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
      return {}; // Return an empty object if the API call fails
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (modalIsOpen && !dataFetched && selectedCardId) {
        await getCli().then((responseJson) => {
          if (responseJson.CLIENTES) {
            setCli(responseJson.CLIENTES);
            setDataFetched(true); // Marcar dados como buscados apenas se houver sucesso na busca
          } else {
            // Lida com o caso em que não há CLIENTES na resposta
            setCli({});
          }
        });
      }
    }
    fetchData();
  }, [selectedCardId, modalIsOpen, dataFetched]);

  //função que chama o select do backend dos logs
  async function getLog() {
    try {
      const url = `http://192.168.30.252:9091/api_crm/crm/modalClienteLog.php?id=${selectedCardId}`;
      const res = await fetch(url);
      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
      return {}; // Return an empty object if the API call fails
    }
  }

  //select do log
  useEffect(() => {
    async function fetchData() {
      if (modalIsOpen && !dataFetched && selectedCardId) {
        await getLog().then((responseJson) => {
          setLog(responseJson.CLIENTES ?? {}); // Use an empty object if responseJson.CLIENTES is undefined
          //console.log(responseJson);
        });

        setDataFetched(true); // Mark data as fetched to prevent multiple API calls
      }
    }
    fetchData();
  }, [selectedCardId, modalIsOpen, dataFetched]);

  //função que chama o select do backend dos logs
  async function getComentario() {
    try {
      const url = `http://192.168.30.252:9091/api_crm/crm/modalRecuperaComentario.php?id=${selectedCardId}`;
      const res = await fetch(url);
      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
      return {}; // Return an empty object if the API call fails
    }
  }

  //select dos comentarios
  useEffect(() => {
    async function fetchData() {
      if (modalIsOpen && !dataFetched && selectedCardId) {
        await getComentario().then((responseJson) => {
          setRecuperaComent(responseJson.COMENTARIOS ?? {}); // Use an empty object if responseJson.CLIENTES is undefined
          //console.log(responseJson);
        });

        setDataFetched(true); // Mark data as fetched to prevent multiple API calls
      }
    }
    fetchData();
  }, [selectedCardId, modalIsOpen, dataFetched]);

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    setDataFetched(false);
    setCli(null);
    window.location.reload();
  }

  const customStyles = {
    content: {
      display: "flex",
      flexDirection: "column", // Define uma coluna para alinhar os elementos verticalmente
      alignItems: "center", // Centraliza os elementos horizontalmente
      justifyContent: "flex-start", // Alinha os elementos no topo
      minWidth: "650px",
      width: "38%", // Largura do modal em relação à largura do viewport (80% é apenas um exemplo)
      maxHeight: "90%", // Altura máxima do modal em relação à altura do viewport (80% é apenas um exemplo)
      margin: "auto", // Centraliza o modal horizontalmente
      padding: "20px", // Adiciona algum espaço interno ao modal
    },
  };

  {
    /*REGRAS PARA DAR UPDATE NA TAG DO CLIENTE */
  }
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const updateTag = () => {
    if (!selectedTag || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      tag: selectedTag,
      email: email,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteUpdateTag.php",
        postData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("Tag updated successfully");
        setStatus({
          type: "success",
          mensagem: "Tag atualizada com sucesso",
        });
        // Close the modal and reset the selected tag
        setSelectedTag("");

        // Refresh the page after 3 seconds
      })
      .catch((error) => {
        console.error(error);
        setStatus({
          type: "erro",
          mensagem: "Ops, alguma coisa deu errado ):",
        });
      });
  };

  const updateSubTag = () => {
    if (!selectedSubTag || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      subTag: selectedSubTag,
      email: email,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteUpdateEtiqueta.php",
        postData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("Tag updated successfully");
        setStatus({
          type: "success",
          mensagem: "Subtag atualizada com sucesso",
        });
        // Close the modal and reset the selected tag
        setSelectedSubTag("");

        // Refresh the page after 3 seconds
      })
      .catch((error) => {
        console.error(error);
        setStatus({
          type: "erro",
          mensagem: "Ops, alguma coisa deu errado ):",
        });
      });
  };

  const getDescriptionStyle = (tag: any) => {
    if (tag === "REFORCO") {
      return "rounded bg-orange-500";
    } else if (tag === "BO") {
      return "rounded bg-yellow-500";
    } else if (tag === "BO URGENTE") {
      return "rounded bg-red-500";
    } else if (tag === "BO ENCERRADO") {
      return "rounded bg-blue-500";
    } else if (tag === "CURTO PRAZO") {
      return "rounded bg-green-500";
    } else if (tag === "MEDIO PRAZO") {
      return "rounded bg-green-400";
    } else if (tag === "LONGO PRAZO") {
      return "rounded bg-green-300";
    } else if (tag === "INDICACAO") {
      return "rounded bg-pink-500";
    } else if (tag === "INDICADO") {
      return "rounded bg-blue-300";
    } else if (tag === "INDICOU") {
      return "rounded bg-emerald-500";
    } else if (tag === "BONUS") {
      return "rounded bg-silver-500";
    } else if (tag === "COMPROU RECENTEMENTE") {
      return "rounded bg-green-700";
    } else if (tag === "INATIVO") {
      return "rounded bg-orange-700";
    } else if (tag === "SATURADO") {
      return "rounded bg-orange-400";
    } else if (tag === "ESPERA") {
      return "rounded bg-yellow-800";
    } else if (tag === "RECENTE") {
      return "rounded bg-blue-800";
    } else if (tag === "INVALIDO") {
      return "rounded bg-yellow-500";
    } else if (tag === "NAO SALVO") {
      return "rounded bg-yellow-600";
    } else if (tag === "DUPLICADO") {
      return "rounded bg-purple-600";
    } else if (tag === "IMEDIATO") {
      return "rounded bg-green-500";
    } else if (tag === "NUMERO ERRADO") {
      return "rounded bg-yellow-500";
    } else if (tag === "ERRO") {
      return "rounded bg-red-500";
    }
    // Add more conditions for other tags
    return "";
  };

  const getDescriptionStyleEtiqueta = (tag: any) => {
    if (tag === "RESPONDEU") {
      return "rounded bg-blue-500";
    } else if (tag === "NAO RESPONDEU") {
      return "rounded bg-red-500";
    } else if (tag === "REFORCO") {
      return "rounded bg-amber-400";
    } else if (tag === "TROCAS") {
      return "rounded bg-teal-500";
    } else if (tag === "INDICACAO") {
      return "rounded bg-cyan-500";
    } else if (tag === "NAO INDICOU") {
      return "rounded bg-rose-400";
    } else if (tag === "INDICOU") {
      return "rounded bg-emerald-400";
    } else if (tag === "MARCADO") {
      return "rounded bg-indigo-500";
    } else if (tag === "MARCAR") {
      return "rounded bg-indigo-400";
    } else if (tag === "RELACIONAMENTO") {
      return "rounded bg-gray-500";
    } else if (tag === "NAO GOSTOU") {
      return "rounded bg-red-500";
    } else if (tag === "CARTAO VIRAR") {
      return "rounded bg-blue-700";
    } else if (tag === "REMARCOU EXAME") {
      return "rounded bg-teal-700";
    } else if (tag === "AGUARDANDO PAGAMENTO") {
      return "rounded bg-teal-400";
    } else if (tag === "ORCAMENTO CARO") {
      return "rounded bg-red-800";
    } else if (tag === "COMPROU EM OUTRO LUGAR") {
      return "rounded bg-red-800";
    } else if (tag === "EM ANDAMENTO") {
      return "rounded bg-blue-500";
    } else if (tag === "ENVIADO") {
      return "rounded bg-green-600";
    } else if (tag === "POS VENDA") {
      return "rounded bg-violet-600";
    }
    // Add more conditions for other tags
    return "";
  };

  const [resp, setResp] = useState(false);

  const updateResp = () => {
    if (!resp || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      tag: resp,
      email: email,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteUpdateConv.php",
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
          mensagem: "Status atualizada com sucesso",
        });
        setResp("");
      })
      .catch((error) => {
        console.error(error);
        setStatus({
          type: "erro",
          mensagem: "Ops, alguma coisa deu errado ):",
        });
      });
  };

  //update conversão em dinheiro

  const [conversao, setConv] = useState();

  const updateConv = () => {
    if (!conversao || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      tag: conversao,
      email: email,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteUpdateConversao.php",
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
        setConv("");
      })
      .catch((error) => {
        console.error(error);
        setStatus({
          type: "erro",
          mensagem: "Ops, alguma coisa deu errado ):",
        });
      });
  };

  //update Comentario

  const [comentario, setComentario] = useState();
  const [mensagemTempo, setMensagemTempo] = useState(false);

  const updateComentario = () => {
    if (!comentario || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      tag: comentario,
      email: email,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteComentario.php",
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
          mensagem: "Comentário enviado com sucesso",
        });
        setMensagemTempo(true);

        setTimeout(() => {
          setMensagemTempo(false);
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

  //insert indicação
  const [produto, setProduto] = useState({
    NOME_INDICADO: "",
    CONTATO_INDICADO: "",
  });

  const valorInput = (e: any) =>
    setProduto({ ...produto, [e.target.name]: e.target.value });

  const updateIndicacao = () => {
    event.preventDefault();
    if (!produto || !selectedCardId) return;
    const postData = {
      id: selectedCardId,
      idCam: id,
      NOME_INDICADO: produto.NOME_INDICADO,
      CONTATO_INDICADO: produto.CONTATO_INDICADO,
    };

    axios
      .post(
        "http://192.168.30.252:9091/api_crm/crm/modalClienteIndicacao.php",
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
          mensagem: "Indicação enviada com sucesso",
        });
        setMensagemTempo(true);

        setTimeout(() => {
          setMensagemTempo(false);
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

  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: "", mensagem: "" });
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

  return (
    <div className="h-full">
      <div className="absolute top-0 right-0 z-40 mt-4 mr-4">
        {status.type && (
          <div className="absolute right-4 top-4">
            <div
              className={`max-w-xs ${
                status.type === "erro" ? "bg-gray-500" : "bg-green-500"
              } text-sm text-white rounded-md shadow-lg mb-3 ml-3`}
              role="alert"
            >
              <div className="flex p-4">{status.mensagem}</div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" p-2  text-black ">
          {cli &&
            Object.values(cli).map((val, key) => {
              return (
                <div className="border-2 border-solid border-fuchsia-600 rounded p-2">
                  <div key={key}>Cliente: {val.CLIENTE}</div>
                  <div key={key}>
                    Contato: {val.DDD} - {val.CELULAR}
                  </div>
                  <div key={key}>Data de cadastro: {val.DTCAD}</div>
                  <div key={key}>Data última compra: {val.DTULTCOMP}</div>
                </div>
              );
            })}
          <div className="flex justify-between">
            <div className="mt-2">
              {cli &&
                Object.values(cli).map((val, key) => {
                  return (
                    <>
                      {val.STATUS === "LISTA" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="REFORCO">REFORÇO</option>
                          <option value="BO">BO</option>
                          <option value="BO URGENTE">BO URGENTE</option>
                          <option value="BO ENCERRADO">BO ENCERRADO</option>
                          <option value="CURTO PRAZO">CURTO PRAZO</option>
                          <option value="MEDIO PRAZO">MEDIO PRAZO</option>
                          <option value="LONGO PRAZO">LONGO PRAZO</option>
                          <option value="INDICACAO">INDICAÇÃO</option>
                          <option value="INDICADO">INDICADO</option>
                          <option value="INDICOU">INDICOU</option>
                          <option value="IMEDIATO">IMEDIATO</option>
                          <option value="INATIVO">INATIVO</option>
                          <option value="SATURADO">SATURADO</option>
                          <option value="ESPERA">ESPERA</option>
                          <option value="RECENTE">RECENTE</option>
                          <option value="INVALIDO">INVALIDO</option>
                          <option value="NAO SALVO">NÃO SALVO</option>
                          <option value="NUMERO ERRADO">numero errado</option>
                          <option value="BONUS">BONUS</option>
                          {/* Add other tag options here */}
                        </select>
                      ) : val.STATUS === "ERRO" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="RECENTE">RECENTE</option>
                          <option value="INVALIDO">INVALIDO</option>
                          <option value="NAO SALVO">NÃO SALVO</option>
                          <option value="NUMERO ERRADO">numero errado</option>
                        </select>
                      ) : val.STATUS === "M1" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="REFORCO">REFORÇO</option>
                          <option value="BO">BO</option>
                          <option value="BO URGENTE">BO URGENTE</option>
                          <option value="BO ENCERRADO">BO ENCERRADO</option>
                          <option value="CURTO PRAZO">CURTO PRAZO</option>
                          <option value="MEDIO PRAZO">MEDIO PRAZO</option>
                          <option value="LONGO PRAZO">LONGO PRAZO</option>
                          <option value="INDICACAO">INDICAÇÃO</option>
                          <option value="INDICADO">INDICADO</option>
                          <option value="INDICOU">INDICOU</option>
                          <option value="IMEDIATO">IMEDIATO</option>
                          <option value="INATIVO">INATIVO</option>
                          <option value="RECENTE">RECENTE</option>
                          <option value="INVALIDO">INVALIDO</option>
                          <option value="NAO SALVO">NÃO SALVO</option>
                          <option value="NUMERO ERRADO">numero errado</option>
                          <option value="BONUS">BONUS</option>
                          {/* Add other tag options here */}
                        </select>
                      ) : val.STATUS === "M2" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="REFORCO">REFORÇO</option>
                          <option value="BO">BO</option>
                          <option value="BO URGENTE">BO URGENTE</option>
                          <option value="BO ENCERRADO">BO ENCERRADO</option>
                          <option value="CURTO PRAZO">CURTO PRAZO</option>
                          <option value="MEDIO PRAZO">MEDIO PRAZO</option>
                          <option value="LONGO PRAZO">LONGO PRAZO</option>
                          <option value="INDICACAO">INDICAÇÃO</option>
                          <option value="INDICADO">INDICADO</option>
                          <option value="INDICOU">INDICOU</option>
                          <option value="IMEDIATO">IMEDIATO</option>
                          <option value="INATIVO">INATIVO</option>
                          <option value="RECENTE">RECENTE</option>
                          <option value="INVALIDO">INVALIDO</option>
                          <option value="NAO SALVO">NÃO SALVO</option>
                          <option value="NUMERO ERRADO">numero errado</option>
                          <option value="BONUS">BONUS</option>
                          {/* Add other tag options here */}
                        </select>
                      ) : val.STATUS === "FEEDBACK" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>

                          <option value="BO">BO</option>
                          <option value="BO URGENTE">BO URGENTE</option>
                          <option value="BO ENCERRADO">BO ENCERRADO</option>
                          <option value="INDICACAO">INDICAÇÃO</option>
                          <option value="INDICADO">INDICADO</option>
                          <option value="INDICOU">INDICOU</option>
                        </select>
                      ) : val.STATUS === "OPORTUNIDADE" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="CURTO PRAZO">CURTO PRAZO</option>
                          <option value="MEDIO PRAZO">MEDIO PRAZO</option>
                          <option value="LONGO PRAZO">LONGO PRAZO</option>
                        </select>
                      ) : val.STATUS === "RELACIONAMENTO" ? (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="SATURADO">SATURADO</option>
                          <option value="ESPERA">ESPERA</option>
                        </select>
                      ) : (
                        <select
                          className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="REFORCO">REFORÇO</option>
                          <option value="BO">BO</option>
                          <option value="BO URGENTE">BO URGENTE</option>
                          <option value="BO ENCERRADO">BO ENCERRADO</option>
                          <option value="CURTO PRAZO">CURTO PRAZO</option>
                          <option value="MEDIO PRAZO">MEDIO PRAZO</option>
                          <option value="LONGO PRAZO">LONGO PRAZO</option>
                          <option value="INDICACAO">INDICAÇÃO</option>
                          <option value="INDICADO">INDICADO</option>
                          <option value="INDICOU">INDICOU</option>
                          <option value="IMEDIATO">IMEDIATO</option>
                          <option value="INATIVO">INATIVO</option>
                          <option value="RECENTE">RECENTE</option>
                          <option value="INVALIDO">INVALIDO</option>
                          <option value="NAO SALVO">NÃO SALVO</option>
                          <option value="NUMERO ERRADO">numero errado</option>
                          <option value="BONUS">BONUS</option>
                          {/* Add other tag options here */}
                        </select>
                      )}
                    </>
                  );
                })}

              <button
                className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                onClick={updateTag}
              >
                Atualizar tag
              </button>
              <br />

              {cli &&
                Object.values(cli).map((val, key) => {
                  return (
                    <>
                      {val.STATUS === "M1" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>
                            <option value="RESPONDEU">RESPONDEU</option>
                            <option value="NAO RESPONDEU">NÃO RESPONDEU</option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : val.STATUS === "M2" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>
                            <option value="REFORCO">REFORÇO</option>
                            <option value="RESPONDEU">RESPONDEU</option>
                            <option value="NAO RESPONDEU">NÃO RESPONDEU</option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : val.STATUS === "FEEDBACK" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>

                            <option value="TROCAS">TROCAS E GARANTIA</option>
                            <option value="INDICACAO">INDICADO COMPROU</option>
                            <option value="NAO INDICOU">NÃO INDICOU</option>
                            <option value="INDICOU">INDICOU</option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : val.STATUS === "OPORTUNIDADE" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>

                            <option value="MARCADO">EXAME MARCADO</option>
                            <option value="MARCAR">MARCAR EXAME</option>
                            <option value="RELACIONAMENTO">
                              RELACIONAMENTO
                            </option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : val.STATUS === "VENDA CERTA" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>
                            <option value="NAO GOSTOU">
                              NÃO GOSTOU DA ARMAÇÃO
                            </option>
                            <option value="CARTAO VIRAR">
                              ESPERAR CARTAO VIRAR
                            </option>
                            <option value="REMARCOU EXAME">
                              REMARCOU EXAME
                            </option>
                            <option value="SUMIU RECEITA">SUMIU RECEITA</option>
                            <option value="AGUARDANDO PAGAMENTO">
                              AGUARDANDO PAGAMENTO
                            </option>
                            <option value="ORCAMENTO CARO">
                              ORÇAMENTO CARO
                            </option>
                            <option value="COMPROU EM OUTRO LUGAR">
                              COMPROU EM OUTRO LUGAR
                            </option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : val.STATUS === "VENDA" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded-md p-1 mt-2 w-1/3"
                            value={selectedSubTag}
                            onChange={(e) => setSelectedSubTag(e.target.value)}
                          >
                            <option value="">--</option>
                            <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                            <option value="ENVIADO">ENVIADO</option>
                            <option value="POS VENDA">PÓS VENDA</option>
                          </select>
                          <button
                            className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                            onClick={updateSubTag}
                          >
                            Etiqueta
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  );
                })}

              <br />
              <div className="mt-4">Cliente respondeu?</div>

              <select
                className="border border-gray-300 rounded-md p-1 w-1/3"
                onChange={(e) => setResp(e.target.value)}
              >
                <option> -- </option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>

                {/* Add other tag options here */}
              </select>
              <button
                className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                onClick={updateResp}
              >
                Atualizar
              </button>
              <br />
              <div className="mt-4">Houve conversão ?</div>

              <input
                placeholder="1200,00"
                type="text"
                onChange={(e) => setConv(e.target.value)}
                className="border-2 border-gray-200 rounded-md w-1/3"
              />
              <button
                className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                onClick={updateConv}
              >
                Atualizar
              </button>

              <div className="mt-4 flex items-center">
                <textarea
                  className="h-22 w-full border-2 border-gray-200 rounded-md"
                  placeholder="Escreva como foi o atendimento"
                  onChange={(e) => setComentario(e.target.value)}
                />
                <button
                  className="ml-4 h-8 w-28  bg-neutral-200  text-md rounded border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]"
                  onClick={updateComentario}
                >
                  Atualizar
                </button>
              </div>
            </div>

            <div className="flex flex-col border-2 border-gray-300 rounded-md p-2 mt-4">
              <form onSubmit={updateIndicacao} className="">
                <div className=" flex flex-col">
                  <label>Nome indicado</label>
                  <input
                    required
                    name="NOME_INDICADO"
                    onChange={valorInput}
                    className="border-2  rounded "
                  />
                </div>
                <div className="flex flex-col">
                  <label>Contato</label>
                  <input
                    required
                    name="CONTATO_INDICADO"
                    onChange={valorInput}
                    className="border-2 rounded "
                  />
                </div>

                <div className="flex justify-end items-end h-28">
                  <button
                    type="submit"
                    className="ml-2 border-2 border-purple-600 bg-purple-600 text-white w-24 rounded hover:bg-orange-400 hover:border-orange-400"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {controlaComentLog === false ? (
            <button className="mt-4" onClick={handleComentLog}>
              <BiCommentDetail color="#7e22ce" size={24} />
            </button>
          ) : (
            <button className="mt-4" onClick={handleComentLog}>
              <BiHistory color="#7e22ce" size={24} />
            </button>
          )}

          {controlaComentLog === false
            ? log &&
              Object.values(log).map((val, key) => {
                return (
                  <div
                    className="mt-8 bg-slate-700 text-white p-4 rounded"
                    key={key}
                  >
                    <div>{val.DATA}</div>
                    <br />
                    <div>{val.LOG.toLowerCase()}</div>
                  </div>
                );
              })
            : Object.values(recuperaComent).map((val, key) => {
                return (
                  <div className="border border-gray-200 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xl font-semibold">{val.NOME}</div>
                      <div className="text-sm text-gray-500">{val.DATA}</div>
                    </div>
                    <div className="text-gray-700">{val.COMENTARIO}</div>
                  </div>
                );
              })}
        </div>
      </Modal>

      <input
        type="text"
        placeholder="Pesquisar por Nome ou Telefone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
        className="border border-gray-300 rounded-md p-1 mt-2 ml-2 mb-2"
      />
      <div
        className="ml-4 mr-4"
        style={{ overflowX: "auto", maxWidth: "100%" }}
      >
        <Board
          data={boardData}
          draggable
          handleDragEnd={handleCardMove}
          style={{
            backgroundColor: "#6b7280",
            fontFamily: "Arial, sans-serif",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            maxHeight: "795px",
            // Add any other custom styles here
          }}
          onCardClick={(cardId) => openModal(cardId)}
          components={{
            Card: (props) => (
              <div className="w-64 cursor-grab bg-gray-900 border border-gray-900 shadow-lg rounded p-4 m-2 ">
                <div className="flex">
                  <div className="mr-2 ">
                    {props.resposta === "sim" ? <FcOk /> : ""}
                  </div>
                  <div
                    onClick={() => openModal(props.id)}
                    className=" flex-none text-md text-gray-200 font-bold leading-none cursor-pointer hover:text-orange-500"
                  >
                    {props.title}
                  </div>
                </div>
                <div className="text-sm text-slate-500">{props.label}</div>
                <div
                  className={`text-sm text-white w-36 mt-2 text-center ${props.descriptionStyle}`}
                >
                  <p className="">{props.description}</p>
                </div>
                <div
                  className={`text-sm text-white w-36 mt-2 text-center ${props.descriptionStyleEtiqueta}`}
                >
                  <p className="">{props.descriptionEtiqueta}</p>
                </div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default TrelloBoard;
