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

    const answers = {
        q1: "B",
        q2: "C",
        q3: "A"
    };

    const explanations = {

        q1: {
            correct:
                "Correto! Tuberculose exige precaução por aerossóis, máscara N95/PFF2 e ambiente adequado.",
            incorrect:
                "Resposta incorreta. A tuberculose é transmitida por aerossóis, exigindo máscara N95/PFF2."
        },

        q2: {
            correct:
                "Correto! Imperícia ocorre quando há falta de conhecimento ou habilidade técnica.",
            incorrect:
                "Resposta incorreta. O caso descreve falta de conhecimento técnico, caracterizando imperícia."
        },

        q3: {
            correct:
                "Correto! A retenção de CO₂ leva à acidose respiratória.",
            incorrect:
                "Resposta incorreta. O acúmulo de CO₂ provoca acidose respiratória."
        }
    };

    submitQuiz.addEventListener("click", () => {

        let score = 0;

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
                    "feedback-box alert alert-warning mt-2 py-2 small";

                feedback.innerHTML =
                    "Selecione uma alternativa.";

                return;
            }

            if (
                selected.value === answers[question]
            ) {

                score++;

                feedback.className =
                    "feedback-box alert alert-success mt-2 py-2 small";

                feedback.innerHTML =
                    explanations[question].correct;

            } else {

                feedback.className =
                    "feedback-box alert alert-danger mt-2 py-2 small";

                feedback.innerHTML =
                    explanations[question].incorrect;
            }

        });

        const percentage =
            Math.round(
                (score / 3) * 100
            );

        scoreDisplay.textContent =
            `${percentage}%`;

        let feedbackText = "";

        if (percentage === 100) {

            feedbackText =
                "Excelente! Você domina os principais tópicos da revisão.";

        } else if (percentage >= 70) {

            feedbackText =
                "Muito bom! Revise apenas alguns detalhes.";

        } else if (percentage >= 50) {

            feedbackText =
                "Bom desempenho, mas vale reforçar alguns conteúdos.";

        } else {

            feedbackText =
                "Recomenda-se revisar todo o material antes da prova.";
        }

        scoreFeedback.textContent =
            feedbackText;

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
            .querySelectorAll(
                'input[type="radio"]'
            )
            .forEach(input => {
                input.checked = false;
            });

        document
            .querySelectorAll(".feedback-box")
            .forEach(box => {

                box.className =
                    "feedback-box alert d-none mt-2 py-2 small";

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