// Arquivo JavaScript para o painel administrativo

document.addEventListener('DOMContentLoaded', function() {
    console.log("Carregando painel administrativo");
    
    // Inicializar navegação do painel
    setupAdminNavigation();
    
    // Inicializar formulários
    setupForms();
    
    // Inicializar editores de conteúdo
    setupContentEditors();
    
    // Carregar estatísticas iniciais
    loadDashboardStats();
});

// Navegação do painel administrativo
function setupAdminNavigation() {
    console.log("Configurando navegação do painel admin");
    
    const sidebarLinks = document.querySelectorAll('.admin-sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Mostrar seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            console.log(`Navegando para seção admin: ${targetId}`);
            
            document.querySelectorAll('.admin-section').forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
    
    // Ativar primeiro link por padrão
    const firstLink = document.querySelector('.admin-sidebar-menu a');
    if (firstLink) {
        firstLink.click();
    }
}

// Configurar formulários
function setupForms() {
    console.log("Configurando formulários administrativos");
    
    // Formulário de adição de resumo
    const resumoForm = document.getElementById('add-resumo-form');
    if (resumoForm) {
        resumoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Enviando formulário de resumo");
            
            const categoria = document.getElementById('resumo-categoria').value;
            const subcategoria = document.getElementById('resumo-subcategoria').value;
            const titulo = document.getElementById('resumo-titulo').value;
            const conteudo = document.getElementById('resumo-conteudo').value;
            
            // Simulação de envio bem-sucedido
            showNotification('Resumo adicionado com sucesso!', 'success');
            
            // Limpar formulário
            resumoForm.reset();
        });
    }
    
    // Formulário de adição de questão
    const questaoForm = document.getElementById('add-questao-form');
    if (questaoForm) {
        questaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Enviando formulário de questão");
            
            const categoria = document.getElementById('questao-categoria').value;
            const subcategoria = document.getElementById('questao-subcategoria').value;
            const enunciado = document.getElementById('questao-enunciado').value;
            
            // Simulação de envio bem-sucedido
            showNotification('Questão adicionada com sucesso!', 'success');
            
            // Limpar formulário
            questaoForm.reset();
        });
    }
    
    // Formulário de upload de imagem
    const imagemForm = document.getElementById('add-imagem-form');
    if (imagemForm) {
        imagemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Enviando formulário de imagem");
            
            const categoria = document.getElementById('imagem-categoria').value;
            const titulo = document.getElementById('imagem-titulo').value;
            const arquivo = document.getElementById('imagem-arquivo').value;
            
            // Simulação de envio bem-sucedido
            showNotification('Imagem adicionada com sucesso!', 'success');
            
            // Limpar formulário
            imagemForm.reset();
        });
    }
}

// Configurar editores de conteúdo
function setupContentEditors() {
    console.log("Configurando editores de conteúdo");
    
    // Simulação de editor de texto rico
    const editorElements = document.querySelectorAll('.rich-text-editor');
    
    editorElements.forEach(editor => {
        // Adicionar barra de ferramentas básica
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <button type="button" class="toolbar-btn bold-btn" title="Negrito"><i class="fas fa-bold"></i></button>
            <button type="button" class="toolbar-btn italic-btn" title="Itálico"><i class="fas fa-italic"></i></button>
            <button type="button" class="toolbar-btn underline-btn" title="Sublinhado"><i class="fas fa-underline"></i></button>
            <button type="button" class="toolbar-btn heading-btn" title="Título"><i class="fas fa-heading"></i></button>
            <button type="button" class="toolbar-btn list-btn" title="Lista"><i class="fas fa-list"></i></button>
            <button type="button" class="toolbar-btn link-btn" title="Link"><i class="fas fa-link"></i></button>
            <button type="button" class="toolbar-btn image-btn" title="Imagem"><i class="fas fa-image"></i></button>
        `;
        
        // Inserir barra de ferramentas antes do editor
        editor.parentNode.insertBefore(toolbar, editor);
        
        // Adicionar eventos aos botões da barra de ferramentas
        toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log(`Clicou no botão: ${this.title}`);
                showNotification(`Função "${this.title}" aplicada ao texto`, 'info');
            });
        });
    });
}

// Carregar estatísticas do dashboard
function loadDashboardStats() {
    console.log("Carregando estatísticas do dashboard");
    
    // Simulação de dados estatísticos
    const stats = {
        resumos: 45,
        questoes: 120,
        imagens: 30,
        acessos: 1250
    };
    
    // Atualizar contadores
    document.querySelectorAll('[data-stat]').forEach(element => {
        const statName = element.getAttribute('data-stat');
        if (stats[statName] !== undefined) {
            element.textContent = stats[statName];
        }
    });
    
    // Simulação de gráfico de acessos
    const chartElement = document.getElementById('acessos-chart');
    if (chartElement) {
        // Aqui seria implementado um gráfico real com biblioteca como Chart.js
        chartElement.innerHTML = `
            <div class="chart-placeholder">
                <div class="chart-bar" style="height: 60%;" title="Segunda: 180 acessos"></div>
                <div class="chart-bar" style="height: 80%;" title="Terça: 240 acessos"></div>
                <div class="chart-bar" style="height: 100%;" title="Quarta: 300 acessos"></div>
                <div class="chart-bar" style="height: 70%;" title="Quinta: 210 acessos"></div>
                <div class="chart-bar" style="height: 50%;" title="Sexta: 150 acessos"></div>
                <div class="chart-bar" style="height: 30%;" title="Sábado: 90 acessos"></div>
                <div class="chart-bar" style="height: 40%;" title="Domingo: 120 acessos"></div>
            </div>
            <div class="chart-labels">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
            </div>
        `;
    }
}

// Função para exibir notificações
function showNotification(message, type = 'info') {
    console.log(`Notificação (${type}): ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Função para confirmar ações importantes
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Inicializar botões de ação
document.addEventListener('DOMContentLoaded', function() {
    // Botões de exclusão
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemType = this.getAttribute('data-type');
            const itemId = this.getAttribute('data-id');
            
            confirmAction(`Tem certeza que deseja excluir este item?`, () => {
                console.log(`Excluindo ${itemType} com ID ${itemId}`);
                showNotification(`Item excluído com sucesso!`, 'success');
                
                // Remover item da lista (simulação)
                const listItem = this.closest('li, tr');
                if (listItem) {
                    listItem.remove();
                }
            });
        });
    });
    
    // Botões de edição
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemType = this.getAttribute('data-type');
            const itemId = this.getAttribute('data-id');
            
            console.log(`Editando ${itemType} com ID ${itemId}`);
            showNotification(`Editando item...`, 'info');
            
            // Aqui seria implementada a lógica para carregar o item no formulário
        });
    });
    
    // Botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            confirmAction('Tem certeza que deseja sair?', () => {
                console.log('Realizando logout');
                showNotification('Logout realizado com sucesso!', 'success');
                
                // Redirecionar para a página inicial após logout
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            });
        });
    }
});
