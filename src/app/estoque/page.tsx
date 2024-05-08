"use client";

import React, { useState } from "react";
import { Suspense } from "react";

import EstoqueMacro from "../../components/resultEstoque/EstoqueMacro";

import Cor from "../../components/datalheEstoque/Cor";
import Material from "../../components/datalheEstoque/Material";
import Sub1 from "../../components/datalheEstoque/Sub1";
import Sub2 from "../../components/datalheEstoque/Sub2";
import Grife from "../../components/datalheEstoque/Grife";

import { Button, Icon, Image, Modal } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import VendaMacro from "../../components/resultVenda/VendaMacro";
import Load from "./load";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const estoque = () => {
  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          trigger={
            <Button style={{ margin: "16px" }}>Ver detalhes do estoque</Button>
          }
          size="fullscreen"
        >
          <Modal.Header>Produtos detalhados</Modal.Header>
          <Modal.Content image scrolling>
            <Modal.Description>
              <div className="flex">
                <Suspense fallback={<Load />}>
                  <div>
                    <Cor />
                  </div>
                </Suspense>

                <Suspense fallback={<Load />}>
                  <div>
                    <Material />
                  </div>
                </Suspense>

                <Suspense fallback={<Load />}>
                  <div>
                    <Sub1 />
                  </div>
                </Suspense>

                <Suspense fallback={<Load />}>
                  <div>
                    <Sub2 />
                  </div>
                </Suspense>

                <Suspense fallback={<Load />}>
                  <div>
                    <Grife />
                  </div>
                </Suspense>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)} primary>
              Proceed <Icon name="chevron right" />
            </Button>
          </Modal.Actions>
        </Modal>
      </div>

      <div className="flex w-full">
        <Suspense fallback={<Load />}>
          <div>
            <EstoqueMacro />
          </div>
        </Suspense>

        <Suspense fallback={<Load />}>
          <div>
            <VendaMacro />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default estoque;
