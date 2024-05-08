"use client";
import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useSessionContext } from "../../app/SessionContext";

import { ActiveLink } from "../activeLink";

import logo from "../../../public/logo.png";

import Link from "next/link";

function Navbar() {
  const session = useSessionContext();

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <a href="/">
            <Image height={120} src={logo} alt="Logo Santo Grau" />
          </a>

          <nav>
            <ActiveLink href="/crm" activeClassName={styles.active}>
              <a>CRM</a>
            </ActiveLink>
            <ActiveLink href="/campanhas" activeClassName={styles.active}>
              <a>Campanhas</a>
            </ActiveLink>
            <ActiveLink href="/estoque" activeClassName={styles.active}>
              <a>Estoque</a>
            </ActiveLink>
            <ActiveLink href="/venda" activeClassName={styles.active}>
              <a>Vendas</a>
            </ActiveLink>
            <ActiveLink href="/dashboard" activeClassName={styles.active}>
              <a>Dashboard</a>
            </ActiveLink>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
