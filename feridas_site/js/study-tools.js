// Arquivo JavaScript para implementação das ferramentas de estudo (marca-texto e anotações)

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ferramentas de estudo
    initializeStudyTools();
    
    // Carregar anotações salvas do usuário
    loadSavedNotes();
    
    // Carregar marcações de texto salvas do usuário
    loadSavedHighlights();
});

// Inicializar ferramentas de estudo
function initializeStudyTools() {
    // Configurar ferramenta de marca-texto
    setupHighlighter();
    
    // Configurar sistema de anotações
    setupNotes();
    
    // Configurar painel de ferramentas de estudo
    setupStudyToolsPanel();
}

// Configurar ferramenta de marca-texto
function setupHighlighter() {
    const highlightMenu = document.querySelector('.highlight-menu');
    const colorOptions = document.querySelectorAll('.highlight-color-option');
    
    if (!highlightMenu || !colorOptions.length) return;
    
    // Adicionar event listener para seleção de texto
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        
        if (selection.toString().length > 0) {
            // Posicionar menu de marca-texto próximo à seleção
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            highlightMenu.style.top = `${window.scrollY + rect.bottom + 10}px`;
            highlightMenu.style.left = `${window.scrollX + rect.left}px`;
            highlightMenu.style.display = 'flex';
        } else {
            highlightMenu.style.display = 'none';
        }
    });
    
    // Adicionar event listeners para opções de cores
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            if (color === 'remove') {
                removeHighlight();
            } else {
                applyHighlight(color);
            }
            
            highlightMenu.style.display = 'none';
        });
    });
    
    // Esconder menu quando clicar fora da seleção
    document.addEventListener('mousedown', function(e) {
        if (!highlightMenu.contains(e.target)) {
            highlightMenu.style.display = 'none';
        }
    });
}

// Aplicar marca-texto à seleção atual
function applyHighlight(color) {
    const selection = window.getSelection();
    
    if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = `highlighted highlight-${color}`;
        span.dataset.color = color;
        
        try {
            range.surroundContents(span);
            
            // Salvar marcações
            saveHighlights();
        } catch (e) {
            console.error('Erro ao aplicar marca-texto:', e);
        }
        
        selection.removeAllRanges();
    }
}

// Remover marca-texto da seleção atual
function removeHighlight() {
    const selection = window.getSelection();
    
    if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const highlightedParent = findHighlightedParent(range.commonAncestorContainer);
        
        if (highlightedParent) {
            const parent = highlightedParent.parentNode;
            
            // Substituir o elemento span pelo seu conteúdo
            while (highlightedParent.firstChild) {
                parent.insertBefore(highlightedParent.firstChild, highlightedParent);
            }
            
            parent.removeChild(highlightedParent);
            
            // Salvar marcações
            saveHighlights();
        }
        
        selection.removeAllRanges();
    }
}

// Encontrar o elemento pai com marca-texto
function findHighlightedParent(element) {
    let current = element;
    
    while (current) {
        if (current.nodeType === 1 && current.classList && current.classList.contains('highlighted')) {
            return current;
        }
        
        current = current.parentNode;
    }
    
    return null;
}

// Salvar marcações de texto
function saveHighlights() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;
    
    const user = JSON.parse(userInfo);
    const pageId = getPageId();
    
    // Coletar todas as marcações na página
    const highlights = [];
    document.querySelectorAll('.highlighted').forEach(el => {
        highlights.push({
            text: el.textContent,
            color: el.dataset.color,
            path: getElementPath(el)
        });
    });
    
    // Salvar marcações no localStorage
    const userHighlights = JSON.parse(localStorage.getItem(`highlights_${user.email}`) || '{}');
    userHighlights[pageId] = highlights;
    localStorage.setItem(`highlights_${user.email}`, JSON.stringify(userHighlights));
}

// Carregar marcações de texto salvas
function loadSavedHighlights() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;
    
    const user = JSON.parse(userInfo);
    const pageId = getPageId();
    
    // Obter marcações salvas
    const userHighlights = JSON.parse(localStorage.getItem(`highlights_${user.email}`) || '{}');
    const highlights = userHighlights[pageId] || [];
    
    // Aplicar marcações
    highlights.forEach(highlight => {
        try {
            const element = getElementByPath(highlight.path);
            if (element) {
                const span = document.createElement('span');
                span.className = `highlighted highlight-${highlight.color}`;
                span.dataset.color = highlight.color;
                span.textContent = highlight.text;
                
                element.parentNode.replaceChild(span, element);
            }
        } catch (e) {
            console.error('Erro ao carregar marca-texto:', e);
        }
    });
}

// Obter caminho do elemento no DOM
function getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
        let index = 0;
        let sibling = current;
        
        while (sibling) {
            if (sibling.nodeName === current.nodeName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }
        
        path.unshift(`${current.nodeName.toLowerCase()}:nth-of-type(${index})`);
        current = current.parentNode;
    }
    
    return path.join(' > ');
}

// Obter elemento pelo caminho no DOM
function getElementByPath(path) {
    return document.querySelector(path);
}

// Configurar sistema de anotações
function setupNotes() {
    const noteInputs = document.querySelectorAll('.note-input');
    const noteSaveButtons = document.querySelectorAll('.note-save-btn');
    const noteCancelButtons = document.querySelectorAll('.note-cancel-btn');
    
    if (!noteInputs.length) return;
    
    // Adicionar event listeners para botões de salvar anotações
    noteSaveButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const noteInput = noteInputs[index];
            const noteText = noteInput.value.trim();
            
            if (noteText) {
                // Salvar anotação
                const pageId = getPageId();
                const sectionId = getNoteSection(noteInput);
                
                if (saveUserNote(pageId, sectionId, noteText)) {
                    // Atualizar exibição de anotações salvas
                    const savedNotesContainer = noteInput.closest('.notes-container').querySelector('.saved-notes');
                    if (savedNotesContainer) {
                        const noteElement = document.createElement('div');
                        noteElement.className = 'saved-note';
                        noteElement.innerHTML = `
                            <div class="note-content">${noteText}</div>
                            <div class="note-actions">
                                <button class="btn btn-sm btn-secondary note-edit-btn">Editar</button>
                                <button class="btn btn-sm btn-danger note-delete-btn">Excluir</button>
                            </div>
                        `;
                        
                        savedNotesContainer.appendChild(noteElement);
                        
                        // Limpar campo de entrada
                        noteInput.value = '';
                        
                        // Adicionar event listeners para botões de editar e excluir
                        const editButton = noteElement.querySelector('.note-edit-btn');
                        const deleteButton = noteElement.querySelector('.note-delete-btn');
                        
                        editButton.addEventListener('click', function() {
                            noteInput.value = noteElement.querySelector('.note-content').textContent;
                            savedNotesContainer.removeChild(noteElement);
                        });
                        
                        deleteButton.addEventListener('click', function() {
                            savedNotesContainer.removeChild(noteElement);
                            deleteUserNote(pageId, sectionId);
                        });
                    }
                }
            }
        });
    });
    
    // Adicionar event listeners para botões de cancelar anotações
    noteCancelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            noteInputs[index].value = '';
        });
    });
}

// Obter ID da seção de anotação
function getNoteSection(noteInput) {
    const container = noteInput.closest('.notes-container');
    return container ? container.id || 'default' : 'default';
}

// Salvar anotação do usuário
function saveUserNote(pageId, sectionId, noteText) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('Você precisa estar logado para salvar anotações.');
        return false;
    }
    
    const user = JSON.parse(userInfo);
    
    // Obter anotações existentes ou inicializar objeto vazio
    const userNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`) || '{}');
    
    // Inicializar objeto para a página atual se não existir
    if (!userNotes[pageId]) {
        userNotes[pageId] = {};
    }
    
    // Salvar anotação para a seção atual
    userNotes[pageId][sectionId] = noteText;
    
    // Salvar anotações atualizadas
    localStorage.setItem(`notes_${user.email}`, JSON.stringify(userNotes));
    
    return true;
}

// Excluir anotação do usuário
function deleteUserNote(pageId, sectionId) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return false;
    
    const user = JSON.parse(userInfo);
    
    // Obter anotações existentes
    const userNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`) || '{}');
    
    // Verificar se existem anotações para a página atual
    if (userNotes[pageId] && userNotes[pageId][sectionId]) {
        // Remover anotação
        delete userNotes[pageId][sectionId];
        
        // Salvar anotações atualizadas
        localStorage.setItem(`notes_${user.email}`, JSON.stringify(userNotes));
        
        return true;
    }
    
    return false;
}

// Carregar anotações salvas
function loadSavedNotes() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;
    
    const user = JSON.parse(userInfo);
    const pageId = getPageId();
    
    // Obter anotações salvas
    const userNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`) || '{}');
    const pageNotes = userNotes[pageId] || {};
    
    // Exibir anotações salvas
    Object.keys(pageNotes).forEach(sectionId => {
        const noteText = pageNotes[sectionId];
        const container = document.getElementById(sectionId);
        
        if (container) {
            const savedNotesContainer = container.querySelector('.saved-notes');
            const noteInput = container.querySelector('.note-input');
            
            if (savedNotesContainer && noteInput) {
                const noteElement = document.createElement('div');
                noteElement.className = 'saved-note';
                noteElement.innerHTML = `
                    <div class="note-content">${noteText}</div>
                    <div class="note-actions">
                        <button class="btn btn-sm btn-secondary note-edit-btn">Editar</button>
                        <button class="btn btn-sm btn-danger note-delete-btn">Excluir</button>
                    </div>
                `;
                
                savedNotesContainer.appendChild(noteElement);
                
                // Adicionar event listeners para botões de editar e excluir
                const editButton = noteElement.querySelector('.note-edit-btn');
                const deleteButton = noteElement.querySelector('.note-delete-btn');
                
                editButton.addEventListener('click', function() {
                    noteInput.value = noteElement.querySelector('.note-content').textContent;
                    savedNotesContainer.removeChild(noteElement);
                });
                
                deleteButton.addEventListener('click', function() {
                    savedNotesContainer.removeChild(noteElement);
                    deleteUserNote(pageId, sectionId);
                });
            }
        }
    });
}

// Configurar painel de ferramentas de estudo
function setupStudyToolsPanel() {
    const toolsToggle = document.querySelector('.study-tools-toggle');
    const toolsPanel = document.querySelector('.study-tools-panel');
    const toolsClose = document.querySelector('.study-tools-close');
    const toolOptions = document.querySelectorAll('.study-tool-option');
    
    if (!toolsToggle || !toolsPanel) return;
    
    // Abrir painel de ferramentas
    toolsToggle.addEventListener('click', function() {
        toolsPanel.classList.toggle('active');
    });
    
    // Fechar painel de ferramentas
    if (toolsClose) {
        toolsClose.addEventListener('click', function() {
            toolsPanel.classList.remove('active');
        });
    }
    
    // Opções de ferramentas
    if (toolOptions.length) {
        toolOptions.forEach(option => {
            option.addEventListener('click', function() {
                const tool = this.getAttribute('data-tool');
                
                // Ativar ferramenta selecionada
                activateTool(tool);
                
                // Fechar painel
                toolsPanel.classList.remove('active');
            });
        });
    }
}

// Ativar ferramenta de estudo
function activateTool(tool) {
    switch (tool) {
        case 'highlighter':
            // Ativar modo de marca-texto
            document.body.classList.toggle('highlighter-mode');
            break;
            
        case 'notes':
            // Focar no campo de anotações mais próximo
            const noteInput = document.querySelector('.note-input');
            if (noteInput) {
                noteInput.focus();
            }
            break;
            
        case 'bookmark':
            // Adicionar página aos favoritos
            addBookmark();
            break;
            
        case 'settings':
            // Abrir configurações
            openSettings();
            break;
    }
}

// Adicionar página aos favoritos
function addBookmark() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('Você precisa estar logado para adicionar favoritos.');
        return;
    }
    
    const user = JSON.parse(userInfo);
    const pageId = getPageId();
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    
    // Obter favoritos existentes ou inicializar array vazio
    const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.email}`) || '[]');
    
    // Verificar se a página já está nos favoritos
    const existingIndex = userBookmarks.findIndex(bookmark => bookmark.pageId === pageId);
    
    if (existingIndex >= 0) {
        // Remover dos favoritos
        userBookmarks.splice(existingIndex, 1);
        alert('Página removida dos favoritos.');
    } else {
        // Adicionar aos favoritos
        userBookmarks.push({
            pageId,
            title: pageTitle,
            url: pageUrl,
            date: new Date().toISOString()
        });
        alert('Página adicionada aos favoritos.');
    }
    
    // Salvar favoritos atualizados
    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(userBookmarks));
}

// Abrir configurações
function openSettings() {
    alert('Configurações em desenvolvimento.');
}

// Obter ID da página atual
function getPageId() {
    // Usar o caminho da URL como ID da página
    return window.location.pathname.replace(/\//g, '_').replace(/\.html$/, '') || 'index';
}
