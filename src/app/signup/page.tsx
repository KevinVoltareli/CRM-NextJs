"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import logo from "../../../public/logo.png";
import Image from "next/image";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const signup = async () => {
    if (password === passwordAgain) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = userCredential.user.uid;
        const userData = {
          nome,
          funcao,
        };

        const response = await fetch(
          "http://192.168.30.252:9091/api_crm/register.php",
          {
            method: "POST",
            body: JSON.stringify({ email, userData }), // Enviando email, nome e função
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setStatus({
            type: "success",
            mensagem: "Usuário cadastrado com sucesso!",
          });
          setEmail("");
          setPassword("");
          setPasswordAgain("");
          setNome("");
          setFuncao("");
        } else {
          setStatus({
            type: "erro",
            mensagem: "Oops, alguma coisa deu errado!",
          });
        }
      } catch (error) {
        setStatus({
          type: "erro",
          mensagem: "Oops, alguma coisa deu errado!",
        });
      }
    }
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
    <div className="flex min-h-screen flex-1 flex-col px-6 py-2 lg:px-8">
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <Image className="mx-auto h-82 w-auto" src={logo} alt="logo" /> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Cadastro de colaboradores
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium leading-6 text-white"
            >
              Nome
            </label>
            <div className="mt-2">
              <input
                id="nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Senha
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Confirmação senha
              </label>
            </div>
            <div className="mt-2">
              <input
                id="passwordAgain"
                name="passwordAgain"
                type="password"
                autoComplete="current-password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="funcao"
              className="block text-sm font-medium leading-6 text-white"
            >
              Função
            </label>
            <div className="mt-2">
              <select
                id="funcao"
                name="funcao"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-slate-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              >
                <option value="">--selecione--</option>
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div>
            <button
              disabled={
                !email ||
                !password ||
                !passwordAgain ||
                password !== passwordAgain
              }
              onClick={() => signup()}
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
