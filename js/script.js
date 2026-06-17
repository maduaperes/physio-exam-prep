document.addEventListener("DOMContentLoaded", () => {

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

        if (parentId) {
          document
            .querySelectorAll(parentId + " .accordion-collapse")
            .forEach((el) => {
              el.classList.remove("acc-open", "show");
              const sibBtn = el
                .closest(".accordion-item")
                .querySelector(".accordion-button");
              if (sibBtn) sibBtn.classList.add("collapsed");
            });
        }

        if (!isOpen) {
          target.classList.add("acc-open", "show");
          btn.classList.remove("collapsed");
        }
      },
      true,
    ); 
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

      let ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ======================================
        SIMULADO ATUALIZADO (15 OBJ + 4 DISS)
    ====================================== */
  const submitQuiz = document.getElementById("submitQuiz");
  const resetQuiz = document.getElementById("resetQuiz");
  const resultsSection = document.getElementById("resultsSection");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const scoreFeedback = document.getElementById("scoreFeedback");

  const answers = {
    q1: "D",
    q2: "D",
    q3: "A",
    q4: "C",
    q5: "D",
    q6: "B",
    q7: "C",
    q8: "E",
    q9: "B",
    q10: "B",
    q11: "A",
    q12: "C",
    q13: "B",
    q14: "B",
    q15: "C",
  };

  const essayAnswers = {
    q16a: "Cinesioterapia.",
    q16b: "I. (V) | II. (V) | III. (V) | IV. (V)",
    q17: "COFFITO: Cria as leis federais (nacional).\nCREFITOs: Fiscalizam e dão o registro (regional).",
    q18: "- Serpentes: Sabedoria.\n- Raio: Energia/Eletroterapia.\n- Verde: Saúde.\n- Amarelo: Luz/Claridade.",
    q19: "Fisioterapia Traumato-Ortopédica e Desportiva.",
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
          feedback.innerHTML = "Você não escolheu nenhuma resposta.";
          return;
        }

        if (selected.value === answers[question]) {
          score++;
          feedback.className = "feedback-box alert alert-success mt-3";
          feedback.innerHTML =
            "<strong>Parabéns!</strong> Você acertou.";
        } else {
          feedback.className = "feedback-box alert alert-danger mt-3";
          feedback.innerHTML =
            "<strong>Ah, você errou.</strong> A resposta certa é a letra <strong>" +
            answers[question] +
            "</strong>.";
        }
      });

      Object.keys(essayAnswers).forEach((question) => {
        const field = document.querySelector(
          'textarea[name="' + question + '"], input[name="' + question + '"]',
        );
        const feedback = document.getElementById("f" + question.replace("q", ""));

        if (!feedback || !field) return;

        feedback.classList.remove("d-none");
        feedback.className = "feedback-box alert alert-info mt-3";
        feedback.innerHTML =
          "<strong>Sua resposta:</strong>" +
          '<p class="mb-2 text-secondary" style="white-space: pre-wrap;">' +
          (field.value.trim() || "Você deixou em branco.") +
          '</p><hr class="my-2">' +
          "<strong>Resposta correta esperada (resumo):</strong>" +
          '<p class="mb-0 text-dark" style="white-space: pre-wrap;">' +
          essayAnswers[question].trim() +
          "</p>";
      });

      const percentage = Math.round((score / totalObjective) * 100);

      if (scoreDisplay) scoreDisplay.textContent = percentage + "%";

      if (scoreFeedback) {
        if (percentage >= 80) {
          scoreFeedback.textContent =
            "Muito bem! Você conhece ótimo o assunto de História da Fisioterapia.";
        } else if (percentage >= 60) {
          scoreFeedback.textContent =
            "Bom trabalho! Dê uma olhadinha nas resoluções e decretos que errou para fixar o conteúdo.";
        } else {
          scoreFeedback.textContent =
            "Vale a pena dar mais uma estudada na evolução histórica, no Decreto-Lei 938/69 e nas Leis Federais.";
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
        REFAZER TESTE (RESET COMPLETO)
    ====================================== */
  if (resetQuiz) {
    resetQuiz.addEventListener("click", () => {
      document
        .querySelectorAll('#quizForm input[type="radio"]')
        .forEach((input) => {
          input.checked = false;
        });

      document.querySelectorAll("#quizForm textarea, #quizForm input[type='text']").forEach((field) => {
        field.value = "";
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