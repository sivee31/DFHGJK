// Arquivo JavaScript para implementar a funcionalidade de quiz interativo

document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial dos quizzes
    setupQuizzes();
    
    // Configuração das abas de conteúdo
    setupTabs();
    
    // Configuração do menu mobile
    setupMobileMenu();
    
    // Configuração dos resumos expandíveis
    setupExpandableContent();
});

// Função para configurar os quizzes interativos
function setupQuizzes() {
    // Carregar as questões do banco de dados
    loadQuestions();
    
    // Adicionar event listeners para as opções de resposta
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            selectAnswer(this);
        });
    });
    
    // Adicionar event listeners para os botões de verificação
    document.querySelectorAll('.btn-check-answer').forEach(button => {
        button.addEventListener('click', function() {
            checkAnswer(this);
        });
    });
    
    // Configurar filtros de categorias de quiz
    document.querySelectorAll('.quiz-category').forEach(category => {
        category.addEventListener('click', function() {
            filterQuizzes(this);
        });
    });
}

// Função para carregar as questões do banco de dados
function loadQuestions() {
    // Aqui seria implementada a lógica para carregar as questões do banco
    // Por enquanto, usaremos as questões estáticas já definidas no HTML
    
    // Exemplo de como seria a estrutura de uma questão
    const questionTemplate = {
        id: 1,
        category: "fisiologia",
        difficulty: "basic",
        question: "Qual célula chega primeiro à ferida para limpar bactérias?",
        options: [
            "Fibroblasto",
            "Macrófago",
            "Neutrófilo",
            "Osteócito"
        ],
        correctAnswer: 2, // índice da resposta correta (0-based)
        explanation: "Os neutrófilos são as primeiras células a chegarem ao local da lesão, geralmente dentro de minutos a horas após o trauma, e são responsáveis pela fagocitose inicial de bactérias e debris."
    };
    
    // Aqui implementaríamos a lógica para renderizar as questões dinamicamente
}

// Função para selecionar uma resposta
function selectAnswer(option) {
    // Remover seleção anterior no mesmo grupo
    const questionContainer = option.closest('.quiz-question');
    questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Adicionar classe de seleção à opção clicada
    option.classList.add('selected');
}

// Função para verificar a resposta selecionada
function checkAnswer(button) {
    const questionContainer = button.closest('.quiz-question');
    const selectedOption = questionContainer.querySelector('.quiz-option.selected');
    
    if (!selectedOption) {
        alert('Por favor, selecione uma resposta antes de verificar.');
        return;
    }
    
    // Determinar se a resposta está correta
    // Na implementação real, isso seria baseado nos dados da questão
    const isCorrect = selectedOption.dataset.correct === "true";
    
    // Mostrar feedback
    const feedbackCorrect = questionContainer.querySelector('.answer-feedback.correct');
    const feedbackIncorrect = questionContainer.querySelector('.answer-feedback.incorrect');
    
    if (isCorrect) {
        feedbackCorrect.style.display = 'flex';
        if (feedbackIncorrect) feedbackIncorrect.style.display = 'none';
        selectedOption.classList.add('correct');
    } else {
        if (feedbackCorrect) feedbackCorrect.style.display = 'none';
        feedbackIncorrect.style.display = 'flex';
        selectedOption.classList.add('incorrect');
        
        // Destacar a resposta correta
        questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
            if (opt.dataset.correct === "true") {
                opt.classList.add('correct');
            }
        });
    }
    
    // Desabilitar outras opções após responder
    questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // Desabilitar o botão de verificação
    button.disabled = true;
    button.textContent = 'Respondido';
    
    // Atualizar o progresso do usuário
    updateProgress();
}

// Função para atualizar o progresso do usuário
function updateProgress() {
    // Contar quantas questões foram respondidas
    const totalQuestions = document.querySelectorAll('.quiz-question').length;
    const answeredQuestions = document.querySelectorAll('.btn-check-answer[disabled]').length;
    
    // Calcular a porcentagem
    const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    // Atualizar a barra de progresso
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
        progressBar.textContent = progressPercentage + '%';
        
        // Atualizar o texto de progresso
        document.querySelector('.quiz-progress p').textContent = 
            `Você completou ${answeredQuestions} de ${totalQuestions} questões disponíveis`;
    }
}

// Função para filtrar quizzes por categoria
function filterQuizzes(categoryElement) {
    // Remover classe ativa de todas as categorias
    document.querySelectorAll('.quiz-category').forEach(cat => {
        cat.classList.remove('active');
    });
    
    // Adicionar classe ativa à categoria selecionada
    categoryElement.classList.add('active');
    
    // Obter o tipo de categoria
    const categoryType = categoryElement.dataset.category;
    
    // Filtrar os cards de quiz
    document.querySelectorAll('.quiz-card').forEach(card => {
        if (categoryType === 'all' || card.dataset.category === categoryType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Função para configurar as abas de conteúdo
function setupTabs() {
    document.querySelectorAll('.demo-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe ativa de todas as abas
            document.querySelectorAll('.demo-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Adicionar classe ativa à aba clicada
            this.classList.add('active');
            
            // Esconder todos os conteúdos
            document.querySelectorAll('.demo-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar o conteúdo correspondente
            const tabId = this.dataset.tab;
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });
}

// Função para configurar o menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Animar as barras do menu
            const bars = document.querySelectorAll('.menu-toggle .bar');
            bars[0].classList.toggle('rotate-45');
            bars[1].classList.toggle('opacity-0');
            bars[2].classList.toggle('rotate-negative-45');
        });
    }
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
        });
    });
}

// Função para configurar os conteúdos expandíveis
function setupExpandableContent() {
    document.querySelectorAll('.btn-expand').forEach(button => {
        button.addEventListener('click', function() {
            const expandableContent = this.parentElement;
            expandableContent.classList.toggle('expanded');
            
            if (expandableContent.classList.contains('expanded')) {
                this.innerHTML = 'Ler menos <i class="fas fa-chevron-up"></i>';
            } else {
                this.innerHTML = 'Ler mais <i class="fas fa-chevron-down"></i>';
            }
        });
    });
}

// Função para carregar mais questões
function loadMoreQuestions(category) {
    // Simulação de carregamento de mais questões
    const quizContainer = document.querySelector('.quiz-cards');
    
    // Mostrar indicador de carregamento
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mais questões...';
    quizContainer.appendChild(loadingIndicator);
    
    // Simular delay de carregamento
    setTimeout(() => {
        // Remover indicador de carregamento
        loadingIndicator.remove();
        
        // Aqui seria implementada a lógica para carregar mais questões do banco de dados
        // Por enquanto, apenas exibimos uma mensagem
        alert('Mais questões seriam carregadas aqui na implementação completa.');
    }, 1000);
}

// Função para iniciar um quiz
function startQuiz(quizId) {
    // Redirecionar para a página do quiz ou abrir modal
    window.location.href = `quiz.html?id=${quizId}`;
}

// Função para filtrar imagens da galeria
function filterGallery(filter) {
    // Remover classe ativa de todos os filtros
    document.querySelectorAll('.gallery-filter').forEach(f => {
        f.classList.remove('active');
    });
    
    // Adicionar classe ativa ao filtro selecionado
    filter.classList.add('active');
    
    // Obter o tipo de filtro
    const filterType = filter.dataset.filter;
    
    // Filtrar os itens da galeria
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (filterType === 'all' || item.dataset.category === filterType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Adicionar mais questões ao banco
function addMoreQuestions() {
    // Esta função seria implementada para adicionar dinamicamente mais questões ao site
    // Aqui seria a lógica para carregar questões do banco de dados e renderizá-las no DOM
    
    const questionsData = [
        {
            id: "q1",
            category: "fisiologia",
            difficulty: "basic",
            question: "Qual fase da cicatrização ocorre imediatamente após a lesão?",
            options: [
                "Inflamação",
                "Hemostasia",
                "Proliferação",
                "Remodelação"
            ],
            correctIndex: 1,
            explanation: "A hemostasia é a primeira fase da cicatrização e ocorre imediatamente após a lesão, envolvendo vasoconstrição e formação de coágulo para estancar o sangramento."
        },
        {
            id: "q2",
            category: "patologia",
            difficulty: "intermediate",
            question: "Qual característica define uma úlcera por pressão estágio 3?",
            options: [
                "Eritema não branqueável",
                "Perda parcial da espessura da pele",
                "Perda total da espessura da pele",
                "Perda total da espessura com exposição óssea"
            ],
            correctIndex: 2,
            explanation: "A úlcera por pressão estágio 3 é caracterizada pela perda total da espessura da pele, com dano ou necrose do tecido subcutâneo, mas sem exposição de osso, tendão ou músculo."
        },
        {
            id: "q3",
            category: "farmacologia",
            difficulty: "advanced",
            question: "Qual curativo é mais indicado para feridas com grande quantidade de exsudato?",
            options: [
                "Filme transparente",
                "Hidrocoloide",
                "Alginato de cálcio",
                "Gaze simples"
            ],
            correctIndex: 2,
            explanation: "O alginato de cálcio tem alta capacidade de absorção, sendo ideal para feridas com grande quantidade de exsudato. Ele forma um gel ao entrar em contato com o exsudato, mantendo o meio úmido ideal para cicatrização."
        }
    ];
    
    // Aqui seria implementada a lógica para renderizar essas questões no DOM
}
