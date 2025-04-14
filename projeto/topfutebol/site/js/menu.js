document.addEventListener("DOMContentLoaded", function() {
  // Seleciona o botão hamburger existente
  const existingHamburger = document.querySelector(".elementor-menu-toggle");

  // Seleciona os elementos do modal
  const modalOverlay = document.getElementById("modal-overlay");
  const modalMenu = document.getElementById("modal-menu");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // Função para abrir o modal
  function openModal() {
    modalMenu.classList.add("open");
    modalOverlay.classList.add("open");
    modalMenu.setAttribute("aria-hidden", "false");
    existingHamburger.setAttribute("aria-expanded", "true");
  }

  // Função para fechar o modal
  function closeModal() {
    modalMenu.classList.remove("open");
    modalOverlay.classList.remove("open");
    modalMenu.setAttribute("aria-hidden", "true");
    existingHamburger.setAttribute("aria-expanded", "false");
  }

  // Se o hamburger existir, adiciona o evento de clique
  if (existingHamburger) {
    existingHamburger.addEventListener("click", function() {
      // Se já estiver aberto, fecha; caso contrário, abre
      if (modalMenu.classList.contains("open")) {
        closeModal();
      } else {
        openModal();
      }
    });
  } else {
    console.error("Não foi possível encontrar o .elementor-menu-toggle");
  }

  // Botão de fechar do modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // Clique no overlay para fechar
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }
});