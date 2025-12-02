document.addEventListener('DOMContentLoaded', () => {
    // Adiciona os elementos do lightbox ao corpo do documento uma única vez
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';
    
    const lightboxModal = document.createElement('div');
    lightboxModal.id = 'lightbox-modal';

    const lightboxImage = document.createElement('img');
    const closeButton = document.createElement('span');
    closeButton.id = 'lightbox-close';
    closeButton.innerHTML = '&times;';

    lightboxModal.appendChild(lightboxImage);
    lightboxOverlay.appendChild(lightboxModal);
    lightboxOverlay.appendChild(closeButton);
    document.body.appendChild(lightboxOverlay);

    // Pega todas as imagens que devem ter o efeito de lightbox
    const images = document.querySelectorAll('.lightbox-img');

    images.forEach(image => {
        // Adiciona um cursor de ponteiro para indicar que é clicável
        image.style.cursor = 'pointer';

        image.addEventListener('click', (e) => {
            e.preventDefault();
            // Define a imagem a ser mostrada no modal
            lightboxImage.src = image.src;
            // Exibe o lightbox
            lightboxOverlay.style.display = 'flex';
            lightboxOverlay.classList.add('fade-in');
        });
    });

    // Função para fechar o lightbox
    const closeLightbox = () => {
        lightboxOverlay.style.display = 'none';
        lightboxOverlay.classList.remove('fade-in');
        lightboxImage.src = ''; // Limpa a imagem
    };

    // Adiciona eventos para fechar o lightbox
    closeButton.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        // Fecha somente se o clique for no fundo (overlay) e não no modal da imagem
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Fecha o lightbox com a tecla 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.style.display === 'flex') {
            closeLightbox();
        }
    });
});
