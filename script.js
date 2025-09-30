/*
SCRIPT DO SPRINT 01
*/

//abre o modal
function abrirLogin() {
    const modal = document.getElementById("modalLogin");
    if (modal && typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        alert("Modal não suportado nesse navegador");
    }
}
//rola suavemente até formulário rápido

function rolarParaRapido() {
    const formRapido = document.querySelector(".formRapido");
    if (formRapido) {
        formRapido.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

//validação simples da reserva rápida
(function inicializarValidacao() {
    const form = document.querySelector(".formRapido");
    if (!form) return;

    const seletorRecurso = form.querySelector("select");

    const campoData = form.querySelector('input[type="date"]');
    const campoInicio = form.querySelector('input[placeholder="Início"]');
    const campoFim = form.querySelector('input[placeholder="Fim"]');

    //remover a marcação de erro ao digitar/mudar
    [seletorRecurso, campoData, campoInicio, campoFim].forEach(el => {
        if (!el) return;
        el.addEventListener("input", () => el.style.borderColor = "");
        el.addEventListener("change", () => el.style.borderColor = "");
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let valido = true;

        //valida recurso selecionado

        if (seletorRecurso && seletorRecurso.selectedIndex === 0) {
            seletorRecurso.style.borderColor = "red";
            valido = false;
        }

        //valida data
        if (campoData && !campoData.value) {
            campoData.style.borderColor = "red";
            valido = false;
        }

        //valida horarios
        const hInicio = campoInicio?.value || "";
        const hFim = campoFim?.value || "";

        if (!hInicio) {
            campoInicio.style.borderColor = "red";
            valido = false;
        }
        
        if (!hFim) {
            campoFim.style.borderColor = "red";
            valido = false;
        }

        if (hInicio && hFim && hFim <= hInicio) {
            campoInicio.style.borderColor = "red";
            campoFim.style.borderColor = "red";
            alert("O horário final precisa ser maior que o horário inicial");
            return;
        }

         if(!valido){
            alert("Por favor prencha todos os campos obrigatorios.");
            return;
         }

         //sucesso (simulado)
         alert("Reserva simulada com sucesso ! integração real será feita nos proximos sprints");
         form.reset();

    });

})();

