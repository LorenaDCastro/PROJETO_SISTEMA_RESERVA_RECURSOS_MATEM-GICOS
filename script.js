/*
SCRIPT DO SPRINT 01
*/

/*
SCRIPT DO SPRINT 02
MANTER O QUE HAVIA NO SPRINT 1 E ADICIONA FLUXO FUNCIONAL
*/
// 1) TOAST ACESSÍVEL (feedback não bloqueante)
// Por quê? Substitui o alert() por UX moderna e acessível
const $toast = document.getElementById('toast');

let __toastTimer = null;

function mostrarToast(mensagem, tipo = 'ok') {
    //fallback se $toast não existir (ambiente antigo)
    if (!$toast) {
        alert(mensagem);
        return;
    }

    $toast.classList.remove('warn', 'err', 'visivel');
    if (tipo === 'warn') $toast.classList.add('warn');
    if (tipo === 'err') $toast.classList.add('err');
    $toast.textContent = mensagem;

    void $toast.offsetWidth;
    $toast.classList.add('visivel');

    clearTimeout(__toastTimer);
    __toastTimer = setTimeout(() => $toast.classList.remove('visivel'), 2800);

}


/* ======================================================================
1) FUNÇÕES ORIGINAIS - Sprint 1 (mantidas)
=========================================================================
 */

//abre o modal
function abrirLogin() {
    const modal = document.getElementById("modalLogin");
    if (modal && typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        //ALTERAÇÃO SPRINT 2: usar toast no lugar de alert, quando possível
        mostrarToast("Modal não suportado neste navegador", "warn");
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
//fluxo do sprint 2 - Login - Pesquisa - Solicitar
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
        if (seletorRecurso && seletorRecurso.selectIndex === 0) {
            seletorRecurso.style.borderColor = "red";
            valido = false;
        }

        //valida data 
        if (campoData && !campoData.value) {
            campoData.style.borderColor = "red";
            valido = false;
        }

        //valida horários
        const hInicio = campoInicio?.value || "";
        const hFim = campoFim?.value || "";

        if (!hInicio) {
            campoInicio.style.borderColor = "red";
            valido = false
        }

        if (!hFim) {
            campoFim.style.borderColor = "red";
            valido = false;
        }

        if (hInicio && hFim && hFim <= hInicio) {
            campoInicio.style.borderColor = "red";
            campoFim.style.borderColor = "red";
            //ALTERAÇÃO SPRINT 2 - Trocar o alert pelo toast
            mostrarToast("O horário final precisa ser maior que o horário inicial", "warn");
            return;
        }

        if (!valido) {
            mostrarToast("Por favor, preencha todos os campos obrigatórios.", "warn")
            return;
        }

        //sucesso (simulado)
        mostrarToast("Reserva simulada com sucesso! (fluxo rápido/legado)");
        form.reset();
    });
})();

/*=======================================================================
2) AJUDANTES E ESTADO (Sprint 2)
-------------------------------------------------------------------------
Por quê? Preparar 'estado mínimo' e leitura formData
 =======================================================================*/

//ALTERAÇÃO DO SPRINT 2: helper para transformar formData em objetos simples
function dadosDoForm(form) {
    return Object.fromEntries(new FormData(form).entries());
}

//ALTERAÇÃO SPRINT 2: estado mínimo de aplicação (simulado)
let usuarioAtual = null; //{login, professor:boolean}
let ultimoFiltroPesquisa = null; //{recurso, data, horário}
const reservas = []; //histórico em memória

/*=======================================================================
3) MENU ATIVO POR HASH (acessibilidade) (Sprint 2)
-------------------------------------------------------------------------
Por quê? Destacar a seção atual sem roteador.
=======================================================================*/

//ALTERAÇÃO DO SPRINT 2: destacar link ativo do menu
const menuLinks = document.querySelectorAll('.menu a, header .acoesNav a');
function atualizarMenuAtivo() {
    const hash = location.hash || '#secLogin';
    menuLinks.forEach(a => {
        const ativo = a.getAttribute('href') === hash;
        a.setAttribute('aria-current', ativo ? 'true' : 'false');
    })
}
window.addEventListener('hashchange', atualizarMenuAtivo);
document.addEventListener('DOMContentLoaded', atualizarMenuAtivo);

/*=======================================================================
4) FLUXO LOGIN - PESQUISA - SOLICITAR - HISTÓRICO (Sprint 2)
-------------------------------------------------------------------------
Por quê? Implementar o fluxo da Sprint 2, com RN simulada:
usuários cujo login contém "prof" com aprovação automática
na solicitação
=======================================================================*/

//ALTERAÇÃO DO SPRINT 2: seletores das seções
const formLogin = document.getElementById('formLogin');
const formPesquisa = document.getElementById('formPesquisa');
const formSolicitar = document.getElementById('formSolicitar');
const listaReservas = document.getElementById('listaReservas');

//4.1 - LOGIN
//Valida credenciais simples e define perfil simulado
formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    const { usuario, senha } = dadosDoForm(formLogin);

    if (!usuario || (senha || '').length < 3) {
        mostrarToast('Usuario/senha inválidos (mín 3 caracteres)', 'warn')
        return;
    }

    const professor = /prof/i.test(usuario); //RN4
    usuarioAtual = { login: usuario, professor };

    mostrarToast(`Bem-vindo, ${usuarioAtual.login}!`);
    location.hash = "#secPesquisa";
    atualizarMenuAtivo();
});

//4.2 - PESQUISAR DISPONIBILIDADE
//guarda filtro pesquisa (simulação de disponibilidade)
formPesquisa?.addEventListener('subimit', (e) => {
    e.preventDefault();

    if (!usuarioAtual) {
        mostrarToast("Faça login antes de pesquisar", "warn");
        location.hash = "#secLogin";
        atualizarMenuAtivo();
        return;
    }

    const { recurso, data, hora } = dadosDoForm(formPesquisa);
    if (!recurso || data || hora) {
        mostrarToast("preencha recurso, data e horário", "warn");
        return;
    }

    ultimoFiltroPesquisa = { recurso, data, hora };
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-br');
    mostrarToast(`Disponível: ${recurso} em ${quando}`);
    location.hash = '#secSolicitar';
    atualizarMenuAtivo();
});



