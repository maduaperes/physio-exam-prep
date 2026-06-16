document.addEventListener("DOMContentLoaded", () => {
  /* ======================================
        ACCORDION CUSTOM
        Bypassa o Bootstrap completamente.
        Anima so opacity — roda no compositor
        do Safari/iPhone sem reflow de height.
    ====================================== */
  document.querySelectorAll("[data-bs-toggle='collapse']").forEach((btn) => {
    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const targetId = btn.getAttribute("data-bs-target");
        const target = document.querySelector(targetId);
        if (!target) return;

        const parentId = target.getAttribute("data-bs-parent");
        const isOpen = target.classList.contains("acc-open");

        // Fecha irmaos do mesmo grupo
        if (parentId) {
          document
            .querySelectorAll(parentId + " .accordion-collapse")
            .forEach((el) => {
              el.classList.remove("acc-open", "show");
              const sibBtn = el
                .closest(".accordion-item")
                ?.querySelector(".accordion-button");
              if (sibBtn) sibBtn.classList.add("collapsed");
            });
        }

        // Abre o alvo (se estava fechado)
        if (!isOpen) {
          target.classList.add("acc-open", "show");
          btn.classList.remove("collapsed");
        }
      },
      true,
    ); // capture: intercepta antes do Bootstrap
  });

  /* ======================================
        FLASHCARDS
    ====================================== */
  const flashcards = document.querySelectorAll(".flashcard");

  flashcards.forEach((card) => {
    card.addEventListener("click", () => {
      const question = card.querySelector(".q-front");
      const answer = card.querySelector(".a-back");

      if (question && answer) {
        question.classList.toggle("d-none");
        answer.classList.toggle("d-none");
      }
    });
  });

  /* ======================================
        BARRA DE PROGRESSO + BOTAO TOPO
    ====================================== */
  const progressBar = document.getElementById("readingProgress");
  const backToTop = document.getElementById("backToTop");

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (progressBar) {
        const progress =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + "%";
      }

      if (backToTop) {
        backToTop.style.display = scrollTop > 500 ? "block" : "none";
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ======================================
        SIMULADO (19 QUESTOES)
    ====================================== */
  const submitQuiz = document.getElementById("submitQuiz");
  const resetQuiz = document.getElementById("resetQuiz");
  const resultsSection = document.getElementById("resultsSection");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const scoreFeedback = document.getElementById("scoreFeedback");

  /* GABARITO OFICIAL - QUESTOES OBJETIVAS (1 a 15) */
  const answers = {
    q1: "B",
    q2: "B",
    q3: "A",
    q4: "B",
    q5: "A",
    q6: "C",
    q7: "A",
    q8: "C",
    q9: "B",
    q10: "B",
    q11: "A",
    q12: "C",
    q13: "A",
    q14: "B",
    q15: "B",
  };

  /* RESPOSTAS DISSERTATIVAS (16 a 19) */
  const essayAnswers = {
    q16: `
        1. Olhar o local: Ver se a cena est\u00e1 segura para voc\u00ea agir.
        2. Chamar ajuda: Ligar r\u00e1pido para o SAMU (192) ou Bombeiros (193).
        3. Primeira avalia\u00e7\u00e3o: Checar se a v\u00edtima responde, respira e tem pulso (XABCDE).
        4. Segunda avalia\u00e7\u00e3o: Procurar outros machucados menores e saber o que houve.
        `,
    q17: `
        - Hipovol\u00eamico: Perda de muito sangue ou l\u00edquidos (hemorragia).
        - Cardiog\u00eanico: O cora\u00e7\u00e3o falha e n\u00e3o consegue bombear o sangue.
        - Obstrutivo: Algo entope ou bloqueia a passagem do sangue (ex: co\u00e1gulo).
        - Distributivo: As veias relaxam demais e o sangue n\u00e3o circula (alergia ou infec\u00e7\u00e3o grave).
        `,
    q18: `
        \u00c9 o esgotamento f\u00edsico e mental completo causado por excesso de estresse e cansa\u00e7o no trabalho ou estudos. Sintomas: falta de for\u00e7as, irrita\u00e7\u00e3o, des\u00e2nimo e queda no rendimento.
        `,
    q19: `
        \u00c9 a perda r\u00e1pida da consci\u00eancia porque faltou sangue e oxig\u00eanio no c\u00e9rebro. Principais causas: ficar sem comer (hipoglicemia), fortes emo\u00e7\u00f5es/sustos, calor excessivo ou muito tempo de p\u00e9.
        `,
  };

  if (submitQuiz) {
    submitQuiz.addEventListener("click", () => {
      let score = 0;
      const totalObjective = Object.keys(answers).length;

      Object.keys(answers).forEach((question) => {
        const selected = document.querySelector(
          'input[name="' + question + '"]:checked',
        );
        const feedback = document.getElementById(
          "f" + question.replace("q", ""),
        );

        if (!feedback) return;

        feedback.classList.remove("d-none");

        if (!selected) {
          feedback.className = "feedback-box alert alert-warning mt-3";
          feedback.innerHTML = "Voc\u00ea n\u00e3o escolheu nenhuma resposta.";
          return;
        }

        if (selected.value === answers[question]) {
          score++;
          feedback.className = "feedback-box alert alert-success mt-3";
          feedback.innerHTML =
            "<strong>Parab\u00e9ns!</strong> Voc\u00ea acertou.";
        } else {
          feedback.className = "feedback-box alert alert-danger mt-3";
          feedback.innerHTML =
            "<strong>Ah, voc\u00ea errou.</strong> A resposta certa \u00e9 a letra <strong>" +
            answers[question] +
            "</strong>.";
        }
      });

      /* Dissertativas */
      Object.keys(essayAnswers).forEach((question) => {
        const textarea = document.querySelector(
          'textarea[name="' + question + '"]',
        );
        const feedback = document.getElementById(
          "f" + question.replace("q", ""),
        );

        if (!feedback || !textarea) return;

        feedback.classList.remove("d-none");
        feedback.className = "feedback-box alert alert-info mt-3";
        feedback.innerHTML =
          "<strong>Sua resposta:</strong>" +
          '<p class="mb-2 text-secondary" style="white-space: pre-wrap;">' +
          (textarea.value.trim() || "Voc\u00ea deixou em branco.") +
          '</p><hr class="my-2">' +
          "<strong>Resposta correta esperada (resumo):</strong>" +
          '<p class="mb-0 text-dark" style="white-space: pre-wrap;">' +
          essayAnswers[question].trim() +
          "</p>";
      });

      /* Resultado */
      const percentage = Math.round((score / totalObjective) * 100);

      if (scoreDisplay) scoreDisplay.textContent = percentage + "%";

      if (scoreFeedback) {
        if (percentage >= 80) {
          scoreFeedback.textContent =
            "Muito bem! Voc\u00ea conhece \u00f3timo o assunto.";
        } else if (percentage >= 60) {
          scoreFeedback.textContent =
            "Bom trabalho! D\u00ea uma olhadinha nas que errou para aprender ainda mais.";
        } else {
          scoreFeedback.textContent =
            "Vale a pena dar mais uma estudada nos t\u00f3picos de Biosseguran\u00e7a e Sinais Vitais.";
        }
      }

      if (resultsSection) resultsSection.classList.remove("d-none");
      if (resetQuiz) resetQuiz.classList.remove("d-none");

      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ======================================
        REFAZER TESTE
    ====================================== */
  if (resetQuiz) {
    resetQuiz.addEventListener("click", () => {
      document
        .querySelectorAll('#quizForm input[type="radio"]')
        .forEach((input) => {
          input.checked = false;
        });

      document.querySelectorAll("#quizForm textarea").forEach((textarea) => {
        textarea.value = "";
      });

      document.querySelectorAll("#quizForm .feedback-box").forEach((box) => {
        box.className = "feedback-box alert d-none mt-3";
        box.innerHTML = "";
      });

      if (resultsSection) resultsSection.classList.add("d-none");
      resetQuiz.classList.add("d-none");

      const quizForm = document.getElementById("quizForm");
      if (quizForm) {
        window.scrollTo({ top: quizForm.offsetTop - 40, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
