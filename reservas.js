document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTOS
  ========================================================= */

  const form = document.getElementById("booking-form");

  const suiteSelect = document.getElementById("suite");

  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  const checkinTime = document.getElementById("checkin-time");
  const checkoutTime = document.getElementById("checkout-time");

  const telefoneInput = document.getElementById("telefone");

  const submitButton = document.querySelector(".booking-submit");


  /* =========================================================
     FUNÇÕES AUXILIARES
  ========================================================= */

  function formatDate(date) {

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }


  function dateFromInput(value) {

    if (!value) {
      return null;
    }

    const [year, month, day] = value
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );

  }


  /* =========================================================
     DATA MÍNIMA = HOJE
  ========================================================= */

  const hoje = new Date();

  hoje.setHours(
    0,
    0,
    0,
    0
  );

  const hojeFormatado = formatDate(hoje);


  if (checkinInput) {

    checkinInput.min =
      hojeFormatado;

  }


  if (checkoutInput) {

    checkoutInput.min =
      hojeFormatado;

  }


  /* =========================================================
     PRÉ-SELECIONAR ACOMODAÇÃO PELA URL

     Exemplos:

     reservas.html?suite=horizonte
     reservas.html?suite=bosque
     reservas.html?suite=villa
  ========================================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const suiteParam =
    params.get("suite");


  const suitesValidas = [

    "horizonte",
    "bosque",
    "pedra",
    "bruma",
    "araucaria",
    "villa"

  ];


  if (
    suiteSelect &&
    suiteParam &&
    suitesValidas.includes(
      suiteParam
    )
  ) {

    suiteSelect.value =
      suiteParam;

  }


  /* =========================================================
     CHECK-IN
     CHECKOUT PRECISA SER DEPOIS
  ========================================================= */

  if (
    checkinInput &&
    checkoutInput
  ) {

    checkinInput.addEventListener(
      "change",
      () => {

        if (!checkinInput.value) {
          return;
        }


        const checkinDate =
          dateFromInput(
            checkinInput.value
          );


        /*
         * Checkout mínimo:
         * dia seguinte ao check-in
         */

        const checkoutMin =
          new Date(
            checkinDate
          );

        checkoutMin.setDate(
          checkoutMin.getDate() + 1
        );


        checkoutInput.min =
          formatDate(
            checkoutMin
          );


        /*
         * Se o checkout atual ficou
         * inválido, limpamos.
         */

        if (
          checkoutInput.value
        ) {

          const checkoutDate =
            dateFromInput(
              checkoutInput.value
            );


          if (
            checkoutDate <=
            checkinDate
          ) {

            checkoutInput.value =
              "";

          }

        }


        atualizarResumo();

      }
    );


    checkoutInput.addEventListener(
      "change",
      atualizarResumo
    );

  }


  /* =========================================================
     TELEFONE / WHATSAPP
     MÁSCARA BRASILEIRA
  ========================================================= */

  if (telefoneInput) {

    telefoneInput.addEventListener(
      "input",
      () => {

        let numero =
          telefoneInput.value
            .replace(/\D/g, "")
            .slice(0, 11);


        if (
          numero.length > 10
        ) {

          numero =
            numero.replace(
              /^(\d{2})(\d{5})(\d{4})$/,
              "($1) $2-$3"
            );

        }

        else if (
          numero.length > 6
        ) {

          numero =
            numero.replace(
              /^(\d{2})(\d{4})(\d{0,4})$/,
              "($1) $2-$3"
            );

        }

        else if (
          numero.length > 2
        ) {

          numero =
            numero.replace(
              /^(\d{2})(\d+)/,
              "($1) $2"
            );

        }

        else if (
          numero.length > 0
        ) {

          numero =
            numero.replace(
              /^(\d*)/,
              "($1"
            );

        }


        telefoneInput.value =
          numero;

      }
    );

  }


  /* =========================================================
     RESUMO DA RESERVA
  ========================================================= */

  let resumo =
    document.querySelector(
      ".booking-summary"
    );


  /*
   * O resumo é criado automaticamente
   * pelo JS. Não precisa alterar o HTML.
   */

  if (
    form &&
    !resumo
  ) {

    resumo =
      document.createElement(
        "div"
      );

    resumo.className =
      "booking-summary";

    resumo.innerHTML = `

      <span class="booking-summary-label">
        RESUMO DA ESTADIA
      </span>

      <div class="booking-summary-content">

        <div>

          <span>
            ACOMODAÇÃO
          </span>

          <strong
            data-summary="suite"
          >
            —
          </strong>

        </div>


        <div>

          <span>
            PERÍODO
          </span>

          <strong
            data-summary="periodo"
          >
            —
          </strong>

        </div>


        <div>

          <span>
            NOITES
          </span>

          <strong
            data-summary="noites"
          >
            —
          </strong>

        </div>

      </div>

    `;


    const checkbox =
      form.querySelector(
        ".booking-checkbox"
      );


    if (checkbox) {

      form.insertBefore(
        resumo,
        checkbox
      );

    }

  }


  /* =========================================================
     CALCULAR NOITES
  ========================================================= */

  function calcularNoites() {

    if (
      !checkinInput?.value ||
      !checkoutInput?.value
    ) {

      return null;

    }


    const entrada =
      dateFromInput(
        checkinInput.value
      );

    const saida =
      dateFromInput(
        checkoutInput.value
      );


    const diferenca =
      saida - entrada;


    const noites =
      Math.round(
        diferenca /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    if (noites <= 0) {
      return null;
    }


    return noites;

  }


  /* =========================================================
     FORMATAR DATA PARA PT-BR
  ========================================================= */

  function formatarDataBR(
    value
  ) {

    const date =
      dateFromInput(
        value
      );


    if (!date) {
      return "";
    }


    return new Intl.DateTimeFormat(
      "pt-BR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    ).format(date);

  }


  /* =========================================================
     ATUALIZAR RESUMO
  ========================================================= */

  function atualizarResumo() {

    if (!resumo) {
      return;
    }


    const suiteResumo =
      resumo.querySelector(
        '[data-summary="suite"]'
      );

    const periodoResumo =
      resumo.querySelector(
        '[data-summary="periodo"]'
      );

    const noitesResumo =
      resumo.querySelector(
        '[data-summary="noites"]'
      );


    /* ACOMODAÇÃO */

    if (
      suiteSelect &&
      suiteSelect.value
    ) {

      suiteResumo.textContent =
        suiteSelect.options[
          suiteSelect.selectedIndex
        ].text;

    }

    else {

      suiteResumo.textContent =
        "—";

    }


    /* PERÍODO */

    if (
      checkinInput?.value &&
      checkoutInput?.value
    ) {

      periodoResumo.textContent =
        `${formatarDataBR(
          checkinInput.value
        )} — ${formatarDataBR(
          checkoutInput.value
        )}`;

    }

    else {

      periodoResumo.textContent =
        "—";

    }


    /* NOITES */

    const noites =
      calcularNoites();


    if (noites) {

      noitesResumo.textContent =
        noites === 1
          ? "1 noite"
          : `${noites} noites`;

    }

    else {

      noitesResumo.textContent =
        "—";

    }

  }


  /* =========================================================
     ALTERAÇÃO DA SUÍTE
  ========================================================= */

  if (suiteSelect) {

    suiteSelect.addEventListener(
      "change",
      atualizarResumo
    );

  }


  /* =========================================================
     PRIMEIRA ATUALIZAÇÃO
  ========================================================= */

  atualizarResumo();


  /* =========================================================
     ENVIO DO FORMULÁRIO
  ========================================================= */

  if (form) {

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        /* =============================================
           VALIDAÇÃO NATIVA DO HTML
        ============================================= */

        if (
          !form.checkValidity()
        ) {

          form.reportValidity();

          return;

        }


        /* =============================================
           VALIDAR PERÍODO
        ============================================= */

        const noites =
          calcularNoites();


        if (!noites) {

          alert(
            "A data de check-out precisa ser posterior à data de check-in."
          );

          return;

        }


        /* =============================================
           FEEDBACK VISUAL
        ============================================= */

        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.classList.add(
            "is-loading"
          );


          const texto =
            submitButton.querySelector(
              "span:first-child"
            );


          if (texto) {

            texto.textContent =
              "Enviando solicitação...";

          }

        }


        /*
         * SIMULAÇÃO DE ENVIO
         *
         * Por enquanto não existe backend.
         * Portanto, simulamos o retorno.
         */

        setTimeout(
          () => {

            mostrarSucesso();

          },
          900
        );

      }
    );

  }


  /* =========================================================
     MENSAGEM DE SUCESSO
  ========================================================= */

  function mostrarSucesso() {

    if (!form) {
      return;
    }


    const suiteNome =
      suiteSelect &&
      suiteSelect.value
        ? suiteSelect.options[
            suiteSelect.selectedIndex
          ].text
        : "sua acomodação";


    form.innerHTML = `

      <div class="booking-success">

        <span class="booking-success-number">
          ✓
        </span>

        <span class="booking-label">
          SOLICITAÇÃO RECEBIDA
        </span>

        <h2>

          Agora deixe
          o restante

          <em>
            conosco.
          </em>

        </h2>

        <p>

          Recebemos sua solicitação para
          <strong>
            ${suiteNome}
          </strong>.

          Nossa equipe entrará em contato
          para confirmar disponibilidade,
          valores e os detalhes da estadia.

        </p>

        <a href="index.html">

          Voltar para a AURÉA

          <span>
            →
          </span>

        </a>

      </div>

    `;


    window.scrollTo({
      top:
        form.getBoundingClientRect().top +
        window.scrollY -
        130,

      behavior:
        "smooth"
    });

  }

});