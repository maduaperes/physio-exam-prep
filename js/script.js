document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       FLASHCARDS
    ====================================== */

    const flashcards = document.querySelectorAll(".flashcard");

    flashcards.forEach(card => {
        card.addEventListener("click", () => {

            const question =
                card.querySelector(".q-front");

            const answer =
                card.querySelector(".a-back");

            question.classList.toggle("d-none");
            answer.classList.toggle("d-none");
        });
    });

    /* ======================================
       BARRA DE PROGRESSO
    ====================================== */

    const progressBar =
        document.getElementById("readingProgress");

    window.addEventListener("scroll", () => {

        const scrollTop =
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress =
            (scrollTop / scrollHeight) * 100;

        progressBar.style.width =
            `${progress}%`;

    });

    /* ======================================
       BOTÃO VOLTAR AO TOPO
    ====================================== */

    const backToTop =
        document.getElementById("backToTop");

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
            behavior: "smooth"
        });

    });

    /* ======================================
    SIMULADO
 ====================================== */

    const submitQuiz =
        document.getElementById("submitQuiz");

    const resetQuiz =
        document.getElementById("resetQuiz");

    const resultsSection =
        document.getElementById("resultsSection");

    const scoreDisplay =
        document.getElementById("scoreDisplay");

    const scoreFeedback =
        document.getElementById("scoreFeedback");

    /* QUESTÕES OBJETIVAS */

    const answers = {
        q1: "B",
        q3: "C",
        q5: "B",
        q7: "B",
        q9: "A"
    };

    /* RESPOSTAS DAS DISSERTATIVAS */

    const essayAnswers = {

        q2: `
    Negligência: deixar de fazer algo que deveria ser feito.
    Imprudência: agir de forma precipitada ou sem cautela.
    Imperícia: falta de conhecimento ou habilidade técnica.
    `,

        q4: `
    1. Antes de tocar o paciente.
    2. Antes de realizar procedimento limpo/asséptico.
    3. Após risco de exposição a fluidos corporais.
    4. Após tocar o paciente.
    5. Após tocar superfícies próximas ao paciente.
    `,

        q6: `
    X = Controle de hemorragias graves.
    A = Vias aéreas e proteção cervical.
    B = Respiração.
    C = Circulação.
    D = Avaliação neurológica.
    E = Exposição e controle térmico.
    `,

        q8: `
    Identificar obstrução total, realizar golpes interescapulares e
    Manobra de Heimlich até expulsão do corpo estranho ou perda de consciência.
    `,

        q10: `
    P = Proteção
    R = Repouso
    I = Ice (Gelo)
    C = Compressão
    E = Elevação
    `
    };

    submitQuiz.addEventListener("click", () => {

        let score = 0;
        let totalObjective = Object.keys(answers).length;

        /* CORREÇÃO DAS OBJETIVAS */

        Object.keys(answers).forEach(question => {

            const selected =
                document.querySelector(
                    `input[name="${question}"]:checked`
                );

            const feedback =
                document.getElementById(
                    `f${question.replace("q", "")}`
                );

            if (!selected) {

                feedback.className =
                    "feedback-box alert alert-warning mt-3";

                feedback.innerHTML =
                    "Nenhuma alternativa selecionada.";

                return;
            }

            if (selected.value === answers[question]) {

                score++;

                feedback.className =
                    "feedback-box alert alert-success mt-3";

                feedback.innerHTML =
                    "Resposta correta.";

            } else {

                feedback.className =
                    "feedback-box alert alert-danger mt-3";

                feedback.innerHTML =
                    `Resposta incorreta. Alternativa correta: <strong>${answers[question]}</strong>`;
            }

        });

        /* MOSTRAR GABARITO DAS DISSERTATIVAS */

        Object.keys(essayAnswers).forEach(question => {

            const textarea =
                document.querySelector(
                    `textarea[name="${question}"]`
                );

            const feedback =
                document.getElementById(
                    `f${question.replace("q", "")}`
                );

            feedback.className =
                "feedback-box alert alert-info mt-3";

            feedback.innerHTML = `
            <strong>Sua resposta:</strong>
            <hr>
            ${textarea.value || "Não respondida"}
            <hr>
            <strong>Resposta esperada:</strong>
            <br>
            ${essayAnswers[question]}
        `;
        });

        /* RESULTADO FINAL */

        const percentage =
            Math.round(
                (score / totalObjective) * 100
            );

        scoreDisplay.textContent =
            `${percentage}%`;

        if (percentage >= 80) {

            scoreFeedback.textContent =
                "Excelente desempenho.";

        } else if (percentage >= 60) {

            scoreFeedback.textContent =
                "Bom desempenho.";

        } else {

            scoreFeedback.textContent =
                "Recomenda-se revisar o conteúdo.";
        }

        resultsSection.classList.remove(
            "d-none"
        );

        resetQuiz.classList.remove(
            "d-none"
        );

        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

    });

    /* ======================================
       REFAZER TESTE
    ====================================== */

    resetQuiz.addEventListener("click", () => {

        document
            .querySelectorAll('input[type="radio"]')
            .forEach(input => {
                input.checked = false;
            });

        document
            .querySelectorAll("textarea")
            .forEach(textarea => {
                textarea.value = "";
            });

        document
            .querySelectorAll(".feedback-box")
            .forEach(box => {

                box.className =
                    "feedback-box alert d-none mt-3";

                box.innerHTML = "";
            });

        resultsSection.classList.add(
            "d-none"
        );

        resetQuiz.classList.add(
            "d-none"
        );

        window.scrollTo({
            top: document.getElementById("quiz")
                .offsetTop - 80,
            behavior: "smooth"
        });

    });

});