document.addEventListener("DOMContentLoaded", function() {
  // Seleciona os botões (o original e o novo customizado)
  const hamburgers = document.querySelectorAll(".elementor-menu-toggle, #custom-hamburger-trigger");

  // Seleciona os elementos do modal
  const modalOverlay = document.getElementById("modal-overlay");
  const modalMenu = document.getElementById("modal-menu");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // Função para abrir o modal
  function openModal() {
    if (modalMenu) {
      modalMenu.classList.add("open");
      modalMenu.setAttribute("aria-hidden", "false");
    }
    if (modalOverlay) {
      modalOverlay.classList.add("open");
    }
  }

  // Função para fechar o modal
  function closeModal() {
    if (modalMenu) {
      modalMenu.classList.remove("open");
      modalMenu.setAttribute("aria-hidden", "true");
    }
    if (modalOverlay) {
      modalOverlay.classList.remove("open");
    }
  }

  // Adiciona evento em todos os botões que abrem o menu
  hamburgers.forEach(hamburger => {
    hamburger.addEventListener("click", function(e) {
      if (!modalMenu) return;
      e.preventDefault();
      if (modalMenu.classList.contains("open")) {
        closeModal();
      } else {
        openModal();
      }
    });
  });

  // Botão de fechar do modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // Clique no overlay para fechar
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }
});