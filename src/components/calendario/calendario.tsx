import React, { useState } from "react";
import Calendar from "react-calendar";
import "./calendario.css";

function Calendario() {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h2>Calendário</h2>
      <Calendar onChange={Date} value={date} className="meu-calendario" />
      <p>Data selecionada: {date.toLocaleDateString("pt-BR")}</p>
    </div>
  );
}

export default Calendario;
