// Arquivo JavaScript para verificação de login e autenticação

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    checkLoginStatus();
    
    // Adicionar event listeners para formulários de login e cadastro
    setupAuthForms();
    
    // Configurar botões de logout
    setupLogoutButtons();
});

// Função para verificar o status de login do usuário
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    
    // Se não houver informações de usuário no localStorage e a página atual não é login ou cadastro
    if (!userInfo && 
        !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        
        // Redirecionar para a página de login
        window.location.href = '/login.html';
    } else if (userInfo) {
        // Se houver informações de usuário, exibir elementos para usuários logados
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.style.display = 'block';
        });
        
        // Verificar se é o administrador
        const user = JSON.parse(userInfo);
        if (user.email === 'sonegamerbr@gmail.com') {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'none';
            });
        }
    }
}

// Configurar formulários de autenticação
function setupAuthForms() {
    // Formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Verificar se é o administrador
            if (email === 'sonegamerbr@gmail.com' && password === 'celular') {
                // Salvar informações do usuário no localStorage
                const userInfo = {
                    email: email,
                    name: 'Administrador',
                    isAdmin: true
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // Redirecionar para a página inicial
                window.location.href = '/index.html';
            } else {
                // Verificar se o usuário existe no localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Salvar informações do usuário no localStorage
                    const userInfo = {
                        email: user.email,
                        name: user.name,
                        isAdmin: false
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    
                    // Redirecionar para a página inicial
                    window.location.href = '/index.html';
                } else {
                    alert('Email ou senha incorretos.');
                }
            }
        });
    }
    
    // Formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validar senha
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            
            // Obter usuários existentes ou inicializar array vazio
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Verificar se o email já está em uso
            if (users.some(user => user.email === email)) {
                alert('Este email já está em uso.');
                return;
            }
            
            // Adicionar novo usuário
            users.push({
                name: name,
                email: email,
                password: password
            });
            
            // Salvar usuários atualizados
            localStorage.setItem('users', JSON.stringify(users));
            
            // Redirecionar para a página de login
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = '/login.html';
        });
    }
}

// Configurar botões de logout
function setupLogoutButtons() {
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover informações do usuário do localStorage
            localStorage.removeItem('userInfo');
            
            // Redirecionar para a página de login
            window.location.href = '/login.html';
        });
    });
}

// Função para salvar anotações do usuário
function saveUserNote(pageId, noteText) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('Você precisa estar logado para salvar anotações.');
        return false;
    }
    
    const user = JSON.parse(userInfo);
    
    // Obter anotações existentes ou inicializar objeto vazio
    const userNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`) || '{}');
    
    // Salvar anotação para a página atual
    userNotes[pageId] = noteText;
    
    // Salvar anotações atualizadas
    localStorage.setItem(`notes_${user.email}`, JSON.stringify(userNotes));
    
    return true;
}

// Função para carregar anotações do usuário
function loadUserNote(pageId) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        return '';
    }
    
    const user = JSON.parse(userInfo);
    
    // Obter anotações existentes ou inicializar objeto vazio
    const userNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`) || '{}');
    
    // Retornar anotação para a página atual ou string vazia se não existir
    return userNotes[pageId] || '';
}

// Função para salvar marcações de texto do usuário
function saveUserHighlights(pageId, highlights) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('Você precisa estar logado para salvar marcações.');
        return false;
    }
    
    const user = JSON.parse(userInfo);
    
    // Obter marcações existentes ou inicializar objeto vazio
    const userHighlights = JSON.parse(localStorage.getItem(`highlights_${user.email}`) || '{}');
    
    // Salvar marcações para a página atual
    userHighlights[pageId] = highlights;
    
    // Salvar marcações atualizadas
    localStorage.setItem(`highlights_${user.email}`, JSON.stringify(userHighlights));
    
    return true;
}

// Função para carregar marcações de texto do usuário
function loadUserHighlights(pageId) {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        return [];
    }
    
    const user = JSON.parse(userInfo);
    
    // Obter marcações existentes ou inicializar objeto vazio
    const userHighlights = JSON.parse(localStorage.getItem(`highlights_${user.email}`) || '{}');
    
    // Retornar marcações para a página atual ou array vazio se não existir
    return userHighlights[pageId] || [];
}
