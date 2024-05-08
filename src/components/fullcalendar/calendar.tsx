"use client";
import React, { useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

const MyCalendar: React.FC = () => {
  useEffect(() => {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "pt-BR",
      initialView: "dayGridMonth",
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      events: "http://192.168.30.252:9091/api_crm/crm/list_eventos.php",
      extraParams: function () {
        return {
          cachebuster: new Date().valueOf(),
        };
      },
    });
    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, []);
  import React, { useEffect } from "react";

  const CalendarPage: React.FC = () => {
    useEffect(() => {
      document.addEventListener("DOMContentLoaded", function () {
        var calendarEl = document.getElementById("calendar");
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: ["interaction", "dayGrid"],
          locale: "pt-br",
          header: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          },
          events: "http://192.168.30.252:9091/api_crm/crm/list_eventos.php",

          eventClick: function (info) {
            $("#visualizar #id").text(info.event.id);
            $("#visualizar #title").text(info.event.title);
            $("#visualizar #start").text(
              moment(info.event.start).format("LLL")
            );
            $("#visualizar #end").text(moment(info.event.end).format("LLL"));
            $("#visualizar").modal("show");
          },
        });

        calendar.render();
      });
    }, []);

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <link href="css/core/main.min.css" rel="stylesheet" />
          <link href="css/daygrid/main.min.css" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />
          <link rel="stylesheet" href="css/personalizado.css" />

          <script src="js/core/main.min.js"></script>
          <script src="js/interaction/main.min.js"></script>
          <script src="js/daygrid/main.min.js"></script>
          <script src="js/core/locales/pt-br.js"></script>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
          <script src="js/personalizado.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
        </head>
        <body>
          <div id="calendar"></div>

          <div
            className="modal fade"
            id="visualizar"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Detalhes do Evento
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <dl className="row">
                    <dt className="col-sm-3">ID do evento</dt>
                    <dd className="col-sm-9" id="id"></dd>

                    <dt className="col-sm-3">Título do evento</dt>
                    <dd className="col-sm-9" id="title"></dd>

                    <dt className="col-sm-3">Início do evento</dt>
                    <dd className="col-sm-9" id="start"></dd>

                    <dt className="col-sm-3">Fim do evento</dt>
                    <dd className="col-sm-9" id="end"></dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  };

  export default CalendarPage;

  return (
    <div>
      <div id="calendar"></div>
    </div>
  );
};

export default MyCalendar;
