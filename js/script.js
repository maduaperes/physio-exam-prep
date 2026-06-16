document.addEventListener("DOMContentLoaded", () => {
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
        BARRA DE PROGRESSO
    ====================================== */
  const progressBar = document.getElementById("readingProgress");

  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      progressBar.style.width = `${progress}%`;
    });
  }

  /* ======================================
        BOTÃO VOLTAR AO TOPO
    ====================================== */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ======================================
        SIMULADO (19 QUESTÕES)
    ====================================== */
  const submitQuiz = document.getElementById("submitQuiz");
  const resetQuiz = document.getElementById("resetQuiz");
  const resultsSection = document.getElementById("resultsSection");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const scoreFeedback = document.getElementById("scoreFeedback");

  /* GABARITO OFICIAL - QUESTÕES OBJETIVAS (1 a 15) */
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

  /* RESPOSTAS BEM CURTAS E RESUMIDAS - DISSERTATIVAS (16 a 19) */
  const essayAnswers = {
    q16: `
        1. Olhar o local: Ver se a cena está segura para você agir.
        2. Chamar ajuda: Ligar rápido para o SAMU (192) ou Bombeiros (193).
        3. Primeira avaliação: Checar se a vítima responde, respira e tem pulso (XABCDE).
        4. Segunda avaliação: Procurar outros machucados menores e saber o que houve.
        `,
    q17: `
        - Hipovolêmico: Perda de muito sangue ou líquidos (hemorragia).
        - Cardiogênico: O coração falha e não consegue bombear o sangue.
        - Obstrutivo: Algo entope ou bloqueia a passagem do sangue (ex: coágulo).
        - Distributivo: As veias relaxam demais e o sangue não circula (alergia ou infecção grave).
        `,
    q18: `
        É o esgotamento físico e mental completo causado por excesso de estresse e cansaço no trabalho ou estudos. Sintomas: falta de forças, irritação, desânimo e queda no rendimento.
        `,
    q19: `
        É a perda rápida da consciência porque faltou sangue e oxigênio no cérebro. Principais causas: ficar sem comer (hipoglicemia), fortes emoções/sustos, calor excessivo ou muito tempo de pé.
        `,
  };

  if (submitQuiz) {
    submitQuiz.addEventListener("click", () => {
      let score = 0;
      let totalObjective = Object.keys(answers).length;

      /* CORREÇÃO DAS OBJETIVAS */
      Object.keys(answers).forEach((question) => {
        const selected = document.querySelector(
          `input[name="${question}"]:checked`,
        );
        const feedback = document.getElementById(
          `f${question.replace("q", "")}`,
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
          feedback.innerHTML = "<strong>Parabéns!</strong> Você acertou.";
        } else {
          feedback.className = "feedback-box alert alert-danger mt-3";
          feedback.innerHTML = `<strong>Ah, você errou.</strong> A resposta certa é a letra <strong>${answers[question]}</strong>.`;
        }
      });

      /* MOSTRAR GABARITO DAS DISSERTATIVAS */
      Object.keys(essayAnswers).forEach((question) => {
        const textarea = document.querySelector(`textarea[name="${question}"]`);
        const feedback = document.getElementById(
          `f${question.replace("q", "")}`,
        );

        if (!feedback || !textarea) return;

        feedback.classList.remove("d-none");
        feedback.className = "feedback-box alert alert-info mt-3";

        feedback.innerHTML = `
                    <strong>Sua resposta:</strong>
                    <p class="mb-2 text-secondary" style="white-space: pre-wrap;">${textarea.value.trim() || "Você deixou em branco."}</p>
                    <hr class="my-2">
                    <strong>Resposta correta esperada (resumo):</strong>
                    <p class="mb-0 text-dark" style="white-space: pre-wrap;">${essayAnswers[question].trim()}</p>
                `;
      });

      /* EXIBIÇÃO DO DESEMPENHO NO TOPO / SESSÃO DE RESULTADOS */
      const percentage = Math.round((score / totalObjective) * 100);

      if (scoreDisplay) scoreDisplay.textContent = `${percentage}%`;

      if (scoreFeedback) {
        if (percentage >= 80) {
          scoreFeedback.textContent =
            "Muito bem! Você conhece ótimo o assunto.";
        } else if (percentage >= 60) {
          scoreFeedback.textContent =
            "Bom trabalho! Dê uma olhadinha nas que errou para aprender ainda mais.";
        } else {
          scoreFeedback.textContent =
            "Vale a pena dar mais uma estudada nos tópicos de Biossegurança e Sinais Vitais.";
        }
      }

      if (resultsSection) resultsSection.classList.remove("d-none");
      if (resetQuiz) resetQuiz.classList.remove("d-none");

      // Rolagem suave até os resultados
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ======================================
        REFAZER TESTE (LIMPAR TUDO)
    ====================================== */
  if (resetQuiz) {
    resetQuiz.addEventListener("click", () => {
      // Limpa as bolinhas de seleção (radio)
      document
        .querySelectorAll('#quizForm input[type="radio"]')
        .forEach((input) => {
          input.checked = false;
        });

      // Limpa o que foi digitado nas caixas de texto
      document.querySelectorAll("#quizForm textarea").forEach((textarea) => {
        textarea.value = "";
      });

      // Esconde todos os alertas de correção
      document.querySelectorAll("#quizForm .feedback-box").forEach((box) => {
        box.className = "feedback-box alert d-none mt-3";
        box.innerHTML = "";
      });

      // Esconde o painel de notas do topo
      if (resultsSection) resultsSection.classList.add("d-none");
      resetQuiz.classList.add("d-none");

      // Sobe a tela de volta para o começo das perguntas
      const quizForm = document.getElementById("quizForm");
      if (quizForm) {
        window.scrollTo({
          top: quizForm.offsetTop - 40,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
