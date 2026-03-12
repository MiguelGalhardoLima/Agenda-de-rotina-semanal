const headers = document.querySelectorAll(".day");
const addButtons = document.querySelectorAll(".add");
const blur2 = document.querySelector(".blur");
const modaledit = document.querySelector(".modal");

let currentColumn = null;
let taskSendoEditada = null;

const closeModal = () => {
    blur2.style.display = "none";
    modaledit.style.display = "none";
    taskSendoEditada = null;
};

// 1. MODAL DE VISUALIZAÇÃO (Onde você pode marcar o círculo)
const abrirModalVisualizacao = (title, time, desc, checklist) => {
    modaledit.innerHTML = `
        <div class="modal-view">
            <section class="modal-info">
                <h2 class="view-title" style="margin:0; font-size:32px;">${title}</h2>
                <span style="font-size:32px; margin:0 10px;">-</span>
                <span class="view-time" style="font-size:32px;">${time}</span>
            </section>
            <section class="description" style="margin-top:15px;">
                <p class="view-description" style="font-size:18px; color:#ccc;">${desc || "Sem descrição."}</p>
            </section>
            <div class="divider" style="height:1px; background:#ffffff40; margin:20px 0;"></div>
            <div class="checklist">
                ${checklist.map((item, index) => `
                    <div class="check-item-view" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <input type="checkbox" class="view-check" data-index="${index}" ${item.checked ? 'checked' : ''} 
                            style="width:22px; height:22px; appearance:none; border:2px solid #fff; border-radius:50%; cursor:pointer; background-color: ${item.checked ? '#fff' : 'transparent'}; transition: 0.2s;">
                        <p style="margin:0; font-size:18px; color: ${item.checked ? '#888' : '#fff'}; text-decoration: ${item.checked ? 'line-through' : 'none'};">${item.text}</p>
                    </div>
                `).join('')}
            </div>
            <div class="modal-actions-view" style="display:flex; justify-content:flex-end; gap:10px; margin-top:30px;">
                <button class="btn-modal-edit-trigger" style="background:#5570f1; color:white; border:none; padding:12px 20px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:bold;">Editar <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                <button class="btn-modal-delete-trigger" style="background:#e55d5d; color:white; border:none; padding:12px 20px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:bold;">Excluir <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
            </div>
        </div>
    `;
    blur2.style.display = "flex";
    modaledit.style.display = "flex";
};

// 2. MODAL DE EDIÇÃO (Círculos apenas ilustrativos aqui)
const abrirModalEdicao = (title = "", time = "", desc = "", checklist = []) => {
    modaledit.innerHTML = `
        <section class="modal-info">
            <input type="text" class="edit-title" placeholder="Título" value="${title}" style="background:transparent; border:none; color:white; font-size:32px; font-weight:bold; outline:none; width:70%;">
            <span>-</span>
            <input type="time" class="edit-time" value="${time}" style="background:transparent; border:none; color:white; font-size:32px; outline:none;">
        </section>
        <section class="description">
            <textarea class="edit-description" placeholder="Descrição da tarefa" style="width:100%; background:transparent; color:white; border:none; outline:none; resize:none; font-size:18px; margin-top:15px; min-height:80px;">${desc}</textarea>
        </section>
        <div class="divider" style="height:1px; background:#ffffff40; margin:20px 0;"></div>
        <form class="checklist-edit" style="max-height: 200px; overflow-y: auto;">
            ${checklist.map(item => `
                <div class="check-item" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                    <div style="width:22px; height:22px; border:2px solid #fff; border-radius:50%;"></div>
                    <label contentEditable="true" style="outline:none; color:white; font-size:18px; flex:1; max-width: 35rem;">${item.text}</label>
                </div>
            `).join('')}
        </form>
        <button class="add-check" style="width:100%; background:#1a1d2e; border:none; color:white; padding:12px; cursor:pointer; border-radius:8px; margin-top:15px; font-size:20px;">+</button>
        <div class="modal-controls" style="display:flex; justify-content:flex-end; gap:10px; margin-top:25px;">
            <button class="discard" style="background:#2d41b5; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer; font-weight:bold;">Descartar</button>
            <button class="confirm" style="background:#5570f1; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer; font-weight:bold;">Confirmar</button>
        </div>
    `;
    blur2.style.display = "flex";
    modaledit.style.display = "flex";
};

document.addEventListener("click", (e) => {
    const taskElement = e.target.closest(".tasks");

    // Lógica para preencher o círculo no modal de visualização
    if (e.target.classList.contains("view-check")) {
        const checkbox = e.target;
        const isChecked = checkbox.checked;
        const textElement = checkbox.nextElementSibling;
        
        // Aplica o estilo visual na hora
        checkbox.style.backgroundColor = isChecked ? "#fff" : "transparent";
        textElement.style.textDecoration = isChecked ? "line-through" : "none";
        textElement.style.color = isChecked ? "#888" : "#fff";

        // Salva o estado no dataset da tarefa original para não perder
        const checklist = JSON.parse(taskSendoEditada.dataset.checklist);
        checklist[checkbox.dataset.index].checked = isChecked;
        taskSendoEditada.dataset.checklist = JSON.stringify(checklist);
    }

    // Abrir Visualização
    if (taskElement && !e.target.closest(".actions")) {
        taskSendoEditada = taskElement;
        const title = taskElement.querySelector(".task-name").textContent;
        const time = taskElement.querySelector(".time").textContent;
        const desc = taskElement.dataset.desc || "";
        const checklist = JSON.parse(taskElement.dataset.checklist || "[]");
        abrirModalVisualizacao(title, time, desc, checklist);
    }

    // Confirmar Edição/Criação
    if (e.target.classList.contains("confirm")) {
        const title = document.querySelector(".edit-title").value || "Sem título";
        const time = document.querySelector(".edit-time").value || "00:00";
        const desc = document.querySelector(".edit-description").value || "";
        const items = Array.from(document.querySelectorAll(".check-item")).map(container => ({
            text: container.querySelector("label").textContent,
            checked: false // Inicia desmarcado na criação/edição
        }));

        if (taskSendoEditada) {
            taskSendoEditada.querySelector(".task-name").textContent = title;
            taskSendoEditada.querySelector(".time").textContent = time;
            taskSendoEditada.dataset.desc = desc;
            taskSendoEditada.dataset.checklist = JSON.stringify(items);
        } else {
            const newTask = document.createElement("article");
            newTask.className = "tasks";
            newTask.dataset.desc = desc;
            newTask.dataset.checklist = JSON.stringify(items);
            newTask.innerHTML = `
                <div class="actions">
                    <button class="btn-edit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button class="btn-delete"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
                </div>
                <div class="info-task">
                    <p class="task-name">${title}</p>
                    <time datetime="${time}" class="time">${time}</time>
                </div>
            `;
            currentColumn.appendChild(newTask);
        }
        closeModal();
    }

    // Funções de suporte (Lápis de edição, Deletar, Adicionar Check, etc)
    if (e.target.closest(".btn-edit") || e.target.closest(".btn-modal-edit-trigger")) {
        const t = e.target.closest(".tasks") || taskSendoEditada;
        abrirModalEdicao(t.querySelector(".task-name").textContent, t.querySelector(".time").textContent, t.dataset.desc, JSON.parse(t.dataset.checklist || "[]"));
    }
    if (e.target.closest(".btn-delete") || e.target.closest(".btn-modal-delete-trigger")) {
        const t = e.target.closest(".tasks") || taskSendoEditada;
        if (t) t.remove();
        closeModal();
    }
    if (e.target.closest(".add-check")) {
        const div = document.createElement("div");
        div.className = "check-item";
        div.style = "display:flex; align-items:center; gap:10px; margin-bottom:12px;";
        div.innerHTML = `<div style="width:22px; height:22px; border:2px solid #fff; border-radius:50%;"></div><label contentEditable="true" style="outline:none; color:white; font-size:18px; flex:1; max-width: 35rem;"></label>`;
        document.querySelector(".checklist-edit").appendChild(div);
        div.querySelector("label").focus();
    }
    if (e.target.classList.contains("discard")) closeModal();
    if (e.target.closest(".day")) e.target.closest(".day-column").classList.toggle("active");
});

addButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentColumn = btn.closest(".day-column").querySelector(".hidden-content");
        taskSendoEditada = null;
        abrirModalEdicao();
    });
});

blur2.addEventListener("click", (e) => { if (e.target === blur2) closeModal(); });