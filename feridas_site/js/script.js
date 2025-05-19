// Arquivo JavaScript principal para o site

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado completamente");
    
    // Inicializar navegação do menu
    setupNavigation();
    
    // Inicializar abas
    setupTabs();
    
    // Inicializar quizzes
    setupQuizzes();
    
    // Inicializar galeria
    setupGallery();
    
    // Inicializar conteúdo expansível
    setupExpandableContent();
    
    // Verificar se há hash na URL para navegação direta
    checkUrlHash();
    
    // Garantir que a primeira aba esteja ativa em cada seção
    activateDefaultTabs();
});

// Navegação do menu
function setupNavigation() {
    console.log("Configurando navegação do menu");
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`Clicou em link para: ${targetId}`);
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Fechar menu móvel se estiver aberto
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
                
                // Se for um link para uma seção com abas, ativar a primeira aba
                if (targetId === '#resumos' || targetId === '#questoes') {
                    setTimeout(() => {
                        const section = document.querySelector(targetId);
                        if (section) {
                            const firstTab = section.querySelector('.tab-item');
                            if (firstTab) {
                                console.log(`Ativando primeira aba da seção ${targetId}`);
                                firstTab.click();
                            }
                        }
                    }, 500);
                }
            }
        });
    });
}

// Ativar abas padrão em todas as seções
function activateDefaultTabs() {
    console.log("Ativando abas padrão");
    
    // Ativar primeira aba em cada container de abas
    document.querySelectorAll('.tabs-container').forEach(container => {
        const firstTab = container.querySelector('.tab-item');
        if (firstTab) {
            console.log(`Ativando aba padrão: ${firstTab.textContent.trim()}`);
            firstTab.click();
        }
    });
}

// Sistema de abas
function setupTabs() {
    console.log("Configurando sistema de abas");
    
    const tabItems = document.querySelectorAll('.tab-item');
    console.log(`Encontradas ${tabItems.length} abas`);
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log(`Clicou na aba: ${this.textContent.trim()}`);
            
            // Remover classe active de todas as abas
            const tabContainer = this.closest('.tabs-container');
            tabContainer.querySelectorAll('.tab-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe active à aba clicada
            this.classList.add('active');
            
            // Mostrar conteúdo da aba
            const tabId = this.getAttribute('data-tab');
            console.log(`ID da aba: ${tabId}`);
            
            // Esconder todos os conteúdos de abas
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Mostrar conteúdo da aba selecionada
            const tabContent = document.getElementById(tabId + '-content');
            if (tabContent) {
                console.log(`Exibindo conteúdo: ${tabId}-content`);
                tabContent.classList.add('active');
                tabContent.style.display = 'block';
                
                // Ativar primeiro item da sidebar por padrão
                const firstSidebarLink = tabContent.querySelector('.sidebar-menu a');
                if (firstSidebarLink) {
                    console.log(`Ativando primeiro link da sidebar: ${firstSidebarLink.textContent.trim()}`);
                    firstSidebarLink.click();
                }
            } else {
                console.error(`Conteúdo não encontrado: ${tabId}-content`);
            }
        });
    });
    
    // Navegação na sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Clicou no link da sidebar: ${this.textContent.trim()}`);
            
            // Remover classe active de todos os links
            const sidebarMenu = this.closest('.sidebar-menu');
            sidebarMenu.querySelectorAll('a').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Mostrar seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            console.log(`ID do alvo: ${targetId}`);
            const container = this.closest('.content-with-sidebar');
            
            container.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                console.log(`Exibindo seção: ${targetId}`);
                targetSection.style.display = 'block';
            } else {
                console.error(`Seção não encontrada: ${targetId}`);
            }
        });
    });
}

// Sistema de quizzes
function setupQuizzes() {
    console.log("Configurando sistema de quizzes");
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    console.log(`Encontradas ${quizOptions.length} opções de quiz`);
    
    // Adicionar evento de clique às opções
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log(`Clicou na opção: ${this.querySelector('.option-text').textContent.trim()}`);
            
            // Remover seleção de outras opções na mesma questão
            const questionContainer = this.closest('.quiz-question');
            questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Selecionar esta opção
            this.classList.add('selected');
        });
    });
    
    // Adicionar evento de clique aos botões de verificação
    const checkButtons = document.querySelectorAll('.btn-check-answer');
    console.log(`Encontrados ${checkButtons.length} botões de verificação`);
    
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("Clicou em verificar resposta");
            checkAnswer(this);
        });
    });
}

// Função para verificar resposta
function checkAnswer(button) {
    const questionContainer = button.closest('.quiz-question');
    const selectedOption = questionContainer.querySelector('.quiz-option.selected');
    
    if (!selectedOption) {
        alert('Por favor, selecione uma alternativa.');
        return;
    }
    
    console.log("Verificando resposta...");
    
    // Desabilitar seleção após verificação
    questionContainer.querySelectorAll('.quiz-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Desabilitar botão de verificação
    button.disabled = true;
    
    // Verificar se a resposta está correta
    const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
    console.log(`Resposta ${isCorrect ? 'correta' : 'incorreta'}`);
    
    // Destacar opção correta
    questionContainer.querySelectorAll('.quiz-option').forEach(option => {
        if (option.getAttribute('data-correct') === 'true') {
            option.classList.add('correct');
        }
    });
    
    // Destacar opção incorreta selecionada
    if (!isCorrect) {
        selectedOption.classList.add('incorrect');
    }
    
    // Mostrar feedback
    if (isCorrect) {
        const correctFeedback = questionContainer.querySelector('.answer-feedback.correct');
        if (correctFeedback) {
            correctFeedback.style.display = 'block';
        }
    } else {
        const incorrectFeedback = questionContainer.querySelector('.answer-feedback.incorrect');
        if (incorrectFeedback) {
            incorrectFeedback.style.display = 'block';
        }
    }
    
    // Mostrar botão de explicação
    const explanationBtn = questionContainer.querySelector('.explanation-btn');
    if (explanationBtn) {
        explanationBtn.style.display = 'block';
    }
}

// Filtros da galeria
function setupGallery() {
    console.log("Configurando galeria");
    
    const filters = document.querySelectorAll('.gallery-filter');
    console.log(`Encontrados ${filters.length} filtros de galeria`);
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            console.log(`Clicou no filtro: ${this.textContent.trim()}`);
            
            // Remover classe active de todos os filtros
            document.querySelectorAll('.gallery-filter').forEach(f => {
                f.classList.remove('active');
            });
            
            // Adicionar classe active ao filtro clicado
            this.classList.add('active');
            
            // Filtrar itens da galeria
            const category = this.getAttribute('data-filter');
            console.log(`Categoria: ${category}`);
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Conteúdo expansível
function setupExpandableContent() {
    console.log("Configurando conteúdo expansível");
    
    const expandButtons = document.querySelectorAll('.btn-expand');
    console.log(`Encontrados ${expandButtons.length} botões de expansão`);
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("Clicou em expandir/recolher");
            
            const expandableContent = this.closest('.expandable-content');
            expandableContent.classList.toggle('expanded');
            
            if (expandableContent.classList.contains('expanded')) {
                this.innerHTML = 'Ler menos <i class="fas fa-chevron-up"></i>';
            } else {
                this.innerHTML = 'Ler mais <i class="fas fa-chevron-down"></i>';
            }
        });
    });
}

// Verificar hash na URL para navegação direta
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash) {
        console.log(`Hash na URL: ${hash}`);
        
        // Se o hash corresponder a uma aba
        const tabMatch = hash.match(/#(.*?)-content/);
        if (tabMatch) {
            const tabId = tabMatch[1];
            console.log(`ID da aba: ${tabId}`);
            
            // Encontrar e clicar na aba correspondente
            const tab = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
            if (tab) {
                console.log(`Clicando na aba: ${tab.textContent.trim()}`);
                tab.click();
            }
        }
        
        // Se o hash corresponder a uma seção de conteúdo
        const sectionId = hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            console.log(`Encontrada seção: ${sectionId}`);
            
            // Encontrar a aba pai
            const tabContent = section.closest('.tab-content');
            if (tabContent) {
                const tabId = tabContent.id.replace('-content', '');
                console.log(`ID da aba pai: ${tabId}`);
                
                // Ativar a aba
                const tab = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
                if (tab) {
                    console.log(`Ativando aba pai: ${tab.textContent.trim()}`);
                    tab.click();
                }
                
                // Ativar o link da sidebar
                const sidebarLink = document.querySelector(`.sidebar-menu a[href="#${sectionId}"]`);
                if (sidebarLink) {
                    console.log(`Ativando link da sidebar: ${sidebarLink.textContent.trim()}`);
                    sidebarLink.click();
                }
            }
        }
    }
}
