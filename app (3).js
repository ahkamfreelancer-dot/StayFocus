// ============================================
// FOCUS FLOW - APPLICATION TDAH
// Fichier JavaScript principal
// ============================================

// ============================================
// ÉTAT GLOBAL DE L'APPLICATION
// ============================================

let state = {
    currentView: 'dashboard',
    currentDomain: 'all',
    user: {
        name: 'Utilisateur', // À personnaliser pour chaque client
        streak: 0,
        totalCompleted: 0,
        points: 0
    },
    projects: [
        {
            id: 1,
            name: "Devenir web développeuse",
            goal: "Reprendre et compléter la formation",
            progress: 25,
            nextAction: "Faire 1h de cours aujourd'hui",
            impact: "Compétence clé pour ton indépendance",
            revenue: "Potentiel 1500-3000€/mois",
            color: "#6366f1",
            domain: 'pro'
        },
        {
            id: 2,
            name: "Experte en automatisation IA",
            goal: "Maîtriser les outils d'IA no-code",
            progress: 35,
            nextAction: "Créer 1 automatisation démo",
            impact: "Service à forte valeur ajoutée",
            revenue: "Missions 500-2000€",
            color: "#8b5cf6",
            domain: 'pro'
        },
        {
            id: 3,
            name: "Trouver le 1er client",
            goal: "Décrocher le premier contrat payant",
            progress: 15,
            nextAction: "5 messages personnalisés LinkedIn",
            impact: "🔥 PRIORITÉ ABSOLUE pour le 1er mars",
            revenue: "Objectif 600-700€",
            color: "#ef4444",
            domain: 'pro'
        },
        {
            id: 4,
            name: "Développer les réseaux sociaux",
            goal: "Bâtir crédibilité et visibilité",
            progress: 20,
            nextAction: "Poster 1 contenu aujourd'hui",
            impact: "Attire clients sans prospection active",
            revenue: "Pipeline clients récurrent",
            color: "#10b981",
            domain: 'pro'
        },
        {
            id: 5,
            name: "Indépendance 1er mars",
            goal: "Générer 600-700€/mois",
            progress: 30,
            nextAction: "Voir tâches des autres projets",
            impact: "⏰ Dans 15 jours !",
            revenue: "LIBERTÉ FINANCIÈRE",
            color: "#f59e0b",
            domain: 'pro'
        }
    ],
    routines: {
        morning: [
            { id: 'm1', text: '🧘 5 min de méditation/respiration', completed: false },
            { id: 'm2', text: '💧 Boire un grand verre d\'eau', completed: false },
            { id: 'm3', text: '📝 Définir mes 3 priorités du jour', completed: false },
            { id: 'm4', text: '🎯 Regarder mon objectif du 1er mars', completed: false }
        ],
        evening: [
            { id: 'e1', text: '✅ Cocher au moins 1 victoire du jour', completed: false },
            { id: 'e2', text: '📱 Préparer mes vêtements pour demain', completed: false },
            { id: 'e3', text: '📖 Lire 10 pages ou écouter podcast', completed: false },
            { id: 'e4', text: '🌙 Éteindre écrans 30 min avant dodo', completed: false }
        ]
    },
    tasks: {
        home: [
            { id: 'h1', text: 'Lancer une machine de linge', domain: 'home', completed: false },
            { id: 'h2', text: 'Ranger le bureau 15 min', domain: 'home', completed: false }
        ],
        health: [
            { id: 's1', text: '30 min de sport ou marche', domain: 'health', completed: false },
            { id: 's2', text: 'Prendre rendez-vous médecin', domain: 'health', completed: false }
        ],
        admin: [
            { id: 'a1', text: 'Trier les emails importants', domain: 'admin', completed: false },
            { id: 'a2', text: 'Répondre à l\'administration', domain: 'admin', completed: false }
        ],
        personal: [
            { id: 'p1', text: 'Appeler un ami/famille', domain: 'personal', completed: false },
            { id: 'p2', text: '20 min de hobby plaisant', domain: 'personal', completed: false }
        ]
    },
    ideas: [],
    isRecording: false,
    analysisLoading: false
};

// Domaines de vie
const DOMAINS = {
    pro: { name: 'Pro', icon: '💼', color: '#6366f1', rgb: '99, 102, 241' },
    home: { name: 'Maison', icon: '🏠', color: '#ec4899', rgb: '236, 72, 153' },
    health: { name: 'Santé', icon: '💪', color: '#10b981', rgb: '16, 185, 129' },
    admin: { name: 'Admin', icon: '📄', color: '#f59e0b', rgb: '245, 158, 11' },
    personal: { name: 'Perso', icon: '🎯', color: '#8b5cf6', rgb: '139, 92, 246' }
};

// Messages motivationnels
const MOTIVATION_MESSAGES = [
    {
        title: "🎯 Tu as 15 jours pour atteindre ton objectif d'indépendance !",
        sub: "Chaque micro-action compte. Tu y es presque !"
    },
    {
        title: "💰 Ton prochain client = 600-700€ de liberté",
        sub: "Focus sur la prospection aujourd'hui !"
    },
    {
        title: "🚀 Chaque petite action te rapproche de ton objectif",
        sub: "La constance bat le talent à chaque fois."
    },
    {
        title: "⚡ Tu es capable de grandes choses !",
        sub: "Le TDAH est un super-pouvoir quand il est bien canalisé."
    },
    {
        title: "🔥 L'action imparfaite vaut mieux que la perfection immobile",
        sub: "Lance-toi, ajuste ensuite !"
    }
];

// Messages de célébration
const CELEBRATION_MESSAGES = [
    "🎉 Excellent travail !",
    "💪 Tu déchires !",
    "✨ Champion·ne !",
    "🚀 Continue comme ça !",
    "🔥 Incroyable !",
    "⚡ Tu es une machine !",
    "🌟 Bravo à toi !",
    "💎 Tellement fier·e de toi !"
];

// ============================================
// GESTION DU STOCKAGE LOCAL
// ============================================

function saveState() {
    try {
        localStorage.setItem('focusFlowState', JSON.stringify(state));
    } catch (e) {
        console.error('Erreur sauvegarde:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('focusFlowState');
        if (saved) {
            const loaded = JSON.parse(saved);
            // Fusionner avec l'état par défaut pour garder nouvelles fonctionnalités
            state = { ...state, ...loaded };
        }
    } catch (e) {
        console.error('Erreur chargement:', e);
    }
}

// ============================================
// RENDU DE L'INTERFACE
// ============================================

function render() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-header">
            <div class="app-logo">🎯</div>
            <h1 class="app-title">Focus Flow</h1>
            <p class="app-subtitle">Ton copilote TDAH au quotidien</p>
        </div>

        ${renderMotivationBanner()}

        ${renderStats()}

        ${renderNavigation()}

        <div class="content fade-in">
            ${renderCurrentView()}
        </div>
    `;

    attachEventListeners();
}

function renderMotivationBanner() {
    const msg = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
    return `
        <div class="motivation-banner">
            <div class="motivation-text">${msg.title}</div>
            <div class="motivation-sub">${msg.sub}</div>
        </div>
    `;
}

function renderStats() {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${state.user.streak}</div>
                <div class="stat-label">Jours 🔥</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${state.user.totalCompleted}</div>
                <div class="stat-label">Complétés</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${state.user.points}</div>
                <div class="stat-label">Points ⭐</div>
            </div>
        </div>
    `;
}

function renderNavigation() {
    const tabs = [
        { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
        { id: 'routines', icon: '🌅', label: 'Routines' },
        { id: 'tasks', icon: '✅', label: 'Tâches' },
        { id: 'ideas', icon: '💡', label: `Idées (${state.ideas.length})` }
    ];

    return `
        <div class="nav-tabs">
            ${tabs.map(tab => `
                <button class="nav-tab ${state.currentView === tab.id ? 'active' : ''}" 
                        onclick="switchView('${tab.id}')">
                    ${tab.icon} ${tab.label}
                </button>
            `).join('')}
        </div>
    `;
}

function renderCurrentView() {
    switch (state.currentView) {
        case 'dashboard':
            return renderDashboard();
        case 'routines':
            return renderRoutines();
        case 'tasks':
            return renderTasks();
        case 'ideas':
            return renderIdeas();
        default:
            return renderDashboard();
    }
}

// ============================================
// VUE : TABLEAU DE BORD
// ============================================

function renderDashboard() {
    return `
        <div class="section-header">
            <span class="section-icon">🎯</span>
            <h2 class="section-title">Mes Projets Prioritaires</h2>
            <span class="section-count">${state.projects.length}</span>
        </div>

        ${state.projects.map(project => renderProjectCard(project)).join('')}
    `;
}

function renderProjectCard(project) {
    return `
        <div class="glass-card task-card" style="--accent-color: ${project.color}">
            <div class="task-header">
                <div class="task-color-dot" style="background: ${project.color}"></div>
                <div class="task-info">
                    <div class="task-name">${project.name}</div>
                    <div class="task-goal">${project.goal}</div>
                </div>
                <div class="task-progress">${project.progress}%</div>
            </div>

            <div class="progress-container">
                <div class="progress-bar" style="width: ${project.progress}%; background: linear-gradient(90deg, ${project.color}, ${project.color}dd)"></div>
            </div>

            <div class="task-meta">
                <div class="meta-item">
                    <span class="meta-icon">💰</span>
                    <span class="meta-text meta-highlight">${project.revenue}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">🎯</span>
                    <span class="meta-text">${project.impact}</span>
                </div>
            </div>

            <div class="next-action">
                <div class="next-action-label">Prochaine action</div>
                <div class="next-action-text">${project.nextAction}</div>
            </div>

            <div class="btn-group">
                <button class="btn btn-success" onclick="completeTask('project', ${project.id})">
                    ✅ Fait !
                </button>
                <button class="btn btn-secondary" onclick="updateProgress(${project.id}, 10)">
                    +10%
                </button>
            </div>
        </div>
    `;
}

// ============================================
// VUE : ROUTINES
// ============================================

function renderRoutines() {
    return `
        <div class="section-header">
            <span class="section-icon">🌅</span>
            <h2 class="section-title">Mes Routines</h2>
        </div>

        <div class="routine-card glass-card">
            <div class="routine-title">
                <span>☀️</span>
                <span>Routine du Matin</span>
            </div>
            <div class="routine-items">
                ${state.routines.morning.map(item => renderRoutineItem(item, 'morning')).join('')}
            </div>
        </div>

        <div class="routine-card glass-card">
            <div class="routine-title">
                <span>🌙</span>
                <span>Routine du Soir</span>
            </div>
            <div class="routine-items">
                ${state.routines.evening.map(item => renderRoutineItem(item, 'evening')).join('')}
            </div>
        </div>

        <div class="glass-card" style="margin-top: 2rem; text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                💡 Les routines créent une structure apaisante pour ton cerveau TDAH
            </p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
                Commence petit : 2-3 actions suffisent. Ajoute-en quand c'est devenu automatique !
            </p>
        </div>
    `;
}

function renderRoutineItem(item, type) {
    return `
        <div class="routine-item ${item.completed ? 'completed' : ''}" onclick="toggleRoutine('${type}', '${item.id}')">
            <div class="routine-checkbox">
                ${item.completed ? '✓' : ''}
            </div>
            <div class="routine-item-text">${item.text}</div>
        </div>
    `;
}

// ============================================
// VUE : TÂCHES PAR DOMAINE
// ============================================

function renderTasks() {
    return `
        <div class="section-header">
            <span class="section-icon">✅</span>
            <h2 class="section-title">Tâches par Domaine</h2>
        </div>

        <div class="domain-selector">
            ${Object.entries(DOMAINS).map(([key, domain]) => `
                <button class="domain-btn ${state.currentDomain === key ? 'active' : ''}" 
                        style="--domain-color: ${domain.color}; --domain-color-rgb: ${domain.rgb}"
                        onclick="switchDomain('${key}')">
                    <div class="domain-icon">${domain.icon}</div>
                    <div class="domain-name">${domain.name}</div>
                </button>
            `).join('')}
        </div>

        ${renderDomainTasks()}
    `;
}

function renderDomainTasks() {
    const allTasks = Object.values(state.tasks).flat();
    const filteredTasks = state.currentDomain === 'all' 
        ? allTasks 
        : state.tasks[state.currentDomain] || [];

    if (filteredTasks.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <div class="empty-title">Aucune tâche pour le moment</div>
                <div class="empty-text">Utilise le micro pour ajouter tes tâches vocalement !</div>
            </div>
        `;
    }

    return filteredTasks.map(task => renderTaskCard(task)).join('');
}

function renderTaskCard(task) {
    const domain = DOMAINS[task.domain];
    return `
        <div class="task-card glass-card ${task.completed ? 'completed' : ''}" 
             style="--accent-color: ${domain.color}">
            <div class="task-header">
                <div class="task-color-dot" style="background: ${domain.color}"></div>
                <div class="task-info">
                    <div class="task-name">${task.text}</div>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-success" onclick="completeTask('task', '${task.id}')">
                    ✅ Fait !
                </button>
            </div>
        </div>
    `;
}

// ============================================
// VUE : IDÉES CAPTURÉES
// ============================================

function renderIdeas() {
    if (state.ideas.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">💡</div>
                <div class="empty-title">Aucune idée capturée</div>
                <div class="empty-text">Appuie sur le micro pour capturer ta première idée !</div>
            </div>
        `;
    }

    return `
        <div class="section-header">
            <span class="section-icon">💡</span>
            <h2 class="section-title">Mes Idées Analysées</h2>
            <span class="section-count">${state.ideas.length}</span>
        </div>

        ${state.ideas.map(idea => renderIdeaCard(idea)).join('')}
    `;
}

function renderIdeaCard(idea) {
    const verdictColors = {
        'FOCUS': { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', icon: '🚀' },
        'PARKING': { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', icon: '⏸️' },
        'ABANDON': { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', icon: '🛑' }
    };
    const colors = verdictColors[idea.analysis.verdict] || verdictColors.PARKING;

    return `
        <div class="glass-card">
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    ${idea.timestamp}
                </div>
                <div style="font-style: italic; margin-bottom: 1rem;">
                    "${idea.text}"
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
                <div style="background: rgba(236, 72, 153, 0.1); padding: 0.75rem; border-radius: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.85rem; font-weight: 600;">❤️ Passion</span>
                        <span style="font-size: 1.1rem; font-weight: 800; color: #ec4899;">${idea.analysis.passion}/10</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${idea.analysis.passionReason}</div>
                </div>

                <div style="background: rgba(99, 102, 241, 0.1); padding: 0.75rem; border-radius: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.85rem; font-weight: 600;">⚙️ Faisabilité</span>
                        <span style="font-size: 1.1rem; font-weight: 800; color: #6366f1;">${idea.analysis.faisabilite}/10</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${idea.analysis.faisabiliteReason}</div>
                </div>

                <div style="background: rgba(16, 185, 129, 0.1); padding: 0.75rem; border-radius: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.85rem; font-weight: 600;">💰 Rentabilité</span>
                        <span style="font-size: 1.1rem; font-weight: 800; color: #10b981;">${idea.analysis.rentabilite}/10</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${idea.analysis.rentabiliteReason}</div>
                </div>

                <div style="background: rgba(139, 92, 246, 0.1); padding: 0.75rem; border-radius: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.85rem; font-weight: 600;">🎯 Alignement</span>
                        <span style="font-size: 1.1rem; font-weight: 800; color: #8b5cf6;">${idea.analysis.alignment}/10</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${idea.analysis.alignmentReason}</div>
                </div>
            </div>

            <div style="background: ${colors.bg}; border: 2px solid ${colors.border}; border-radius: 0.75rem; padding: 1rem;">
                <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">
                    ${colors.icon} ${idea.analysis.verdict}
                </div>
                <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${idea.analysis.verdictReason}
                </div>
                ${idea.analysis.verdict === 'FOCUS' ? `
                    <div style="background: white; color: #0f0f23; padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.75rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; color: #10b981;">
                            Action immédiate :
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 600;">
                            ${idea.analysis.action}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================
// INTERACTIONS UTILISATEUR
// ============================================

function switchView(view) {
    state.currentView = view;
    render();
}

function switchDomain(domain) {
    state.currentDomain = domain;
    render();
}

function updateProgress(projectId, increment) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        project.progress = Math.min(100, project.progress + increment);
        saveState();
        render();
        
        if (project.progress >= 100) {
            celebrate("🎉 Projet terminé ! Tu es incroyable !");
        }
    }
}

function completeTask(type, id) {
    if (type === 'project') {
        updateProgress(id, 10);
    } else if (type === 'task') {
        const allTasks = Object.values(state.tasks).flat();
        const task = allTasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            state.user.totalCompleted++;
            state.user.points += 10;
            saveState();
            celebrate();
            render();
        }
    }
}

function toggleRoutine(type, id) {
    const routine = state.routines[type].find(r => r.id === id);
    if (routine) {
        routine.completed = !routine.completed;
        
        if (routine.completed) {
            state.user.points += 5;
            celebrate();
        }
        
        saveState();
        render();
    }
}

// ============================================
// SYSTÈME DE CÉLÉBRATION
// ============================================

function celebrate(customMessage) {
    const message = customMessage || CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
    
    // Confettis
    createConfetti();
    
    // Message temporaire
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 2rem 3rem;
        border-radius: 1.5rem;
        font-size: 1.5rem;
        font-weight: 800;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: celebPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    overlay.textContent = message;
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 2000);
}

function createConfetti() {
    const overlay = document.getElementById('celebrationOverlay');
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        overlay.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ============================================
// ENREGISTREMENT VOCAL ET ANALYSE IA
// ============================================

let recognition = null;
let finalTranscript = '';

function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        updateRecordingDisplay(finalTranscript + interimTranscript);
    };
    
    recognition.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        if (event.error !== 'no-speech') {
            stopRecording();
        }
    };
    
    recognition.onend = () => {
        if (state.isRecording) {
            try {
                recognition.start();
            } catch (e) {
                console.log('Fin enregistrement');
            }
        }
    };
    
    return true;
}

function toggleRecording() {
    if (state.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    if (!recognition) {
        const supported = initSpeechRecognition();
        if (!supported) {
            // Fallback : saisie texte
            const text = prompt("🎤 Raconte ton idée ici :");
            if (text && text.trim()) {
                analyzeIdea(text);
            }
            return;
        }
    }
    
    finalTranscript = '';
    state.isRecording = true;
    
    const micBtn = document.getElementById('micButton');
    micBtn.classList.add('recording');
    micBtn.textContent = '⏹️';
    
    showRecordingOverlay();
    
    try {
        recognition.start();
    } catch (e) {
        console.error('Erreur démarrage:', e);
        stopRecording();
    }
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
    
    state.isRecording = false;
    
    const micBtn = document.getElementById('micButton');
    micBtn.classList.remove('recording');
    micBtn.textContent = '🎤';
    
    hideRecordingOverlay();
    
    const textToAnalyze = finalTranscript.trim();
    if (textToAnalyze) {
        analyzeIdea(textToAnalyze);
    }
}

function showRecordingOverlay() {
    const existing = document.getElementById('recordingOverlay');
    if (existing) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'recordingOverlay';
    overlay.className = 'recording-overlay';
    overlay.innerHTML = `
        <div class="recording-header">
            <div class="recording-dot"></div>
            <div class="recording-label">Enregistrement en cours...</div>
        </div>
        <div class="transcript-display" id="transcriptDisplay">
            Parle maintenant...
        </div>
        <div class="recording-hint">Appuie à nouveau pour arrêter</div>
    `;
    
    document.body.appendChild(overlay);
}

function hideRecordingOverlay() {
    const overlay = document.getElementById('recordingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function updateRecordingDisplay(text) {
    const display = document.getElementById('transcriptDisplay');
    if (display) {
        display.textContent = text || 'Parle maintenant...';
    }
}

// ============================================
// ANALYSE IA DES IDÉES
// ============================================

async function analyzeIdea(text) {
    state.analysisLoading = true;
    
    // Sauvegarde immédiate
    localStorage.setItem('lastIdea', text);
    
    const micBtn = document.getElementById('micButton');
    micBtn.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        // Délai simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const analysis = analyzeLocally(text);
        
        const newIdea = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString('fr-FR'),
            analysis: analysis
        };

        state.ideas.unshift(newIdea);
        localStorage.removeItem('lastIdea');
        
        saveState();
        
        state.analysisLoading = false;
        micBtn.textContent = '🎤';
        
        state.currentView = 'ideas';
        render();
        
        if (analysis.verdict === 'FOCUS') {
            celebrate("💡 Excellente idée ! À faire maintenant !");
        }
        
    } catch (error) {
        console.error("Erreur analyse:", error);
        
        const fallbackIdea = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString('fr-FR'),
            analysis: {
                passion: 7,
                passionReason: "Idée sauvegardée",
                faisabilite: 7,
                faisabiliteReason: "À évaluer",
                rentabilite: 7,
                rentabiliteReason: "À évaluer",
                alignment: 7,
                alignmentReason: "À évaluer",
                verdict: "PARKING",
                verdictReason: "Ton idée est sauvegardée !",
                action: "Reviens dessus plus tard"
            }
        };
        
        state.ideas.unshift(fallbackIdea);
        saveState();
        
        state.analysisLoading = false;
        micBtn.textContent = '🎤';
        
        state.currentView = 'ideas';
        render();
    }
}

function analyzeLocally(text) {
    const textLower = text.toLowerCase();
    
    // Détection mots-clés
    const webDevKeywords = ['code', 'dev', 'web', 'html', 'css', 'javascript', 'react', 'formation'];
    const iaKeywords = ['ia', 'automatisation', 'make', 'zapier', 'chatbot', 'ai', 'claude'];
    const clientKeywords = ['client', 'vente', 'prospection', 'linkedin', 'contact', 'pitch'];
    const reseauxKeywords = ['post', 'contenu', 'instagram', 'facebook', 'twitter', 'social'];
    
    const hasWebDev = webDevKeywords.some(kw => textLower.includes(kw));
    const hasIA = iaKeywords.some(kw => textLower.includes(kw));
    const hasClient = clientKeywords.some(kw => textLower.includes(kw));
    const hasReseaux = reseauxKeywords.some(kw => textLower.includes(kw));
    
    let alignment = 5;
    if (hasWebDev) alignment += 2;
    if (hasIA) alignment += 2;
    if (hasClient) alignment += 2;
    if (hasReseaux) alignment += 1;
    alignment = Math.min(10, alignment);
    
    const urgentKeywords = ['urgent', 'rapide', 'maintenant', 'aujourd\'hui', 'vite'];
    const moneyKeywords = ['€', 'euro', 'argent', 'payant', 'client', 'vente', 'revenu'];
    const isUrgent = urgentKeywords.some(kw => textLower.includes(kw));
    const isMoney = moneyKeywords.some(kw => textLower.includes(kw));
    
    const rentabilite = isMoney ? 8 : (hasClient ? 7 : 5);
    const faisabilite = text.length < 200 ? 8 : 6;
    const passion = text.includes('!') || text.includes('❤️') || textLower.includes('j\'adore') ? 9 : 7;
    
    let verdict = 'PARKING';
    let verdictReason = 'Idée intéressante à explorer quand tu auras plus de temps.';
    let action = 'Note-la dans un document pour y revenir après le 1er mars.';
    
    if ((hasClient || isMoney) && alignment >= 7) {
        verdict = 'FOCUS';
        verdictReason = 'Cette idée est alignée avec ton objectif urgent de trouver un client avant le 1er mars. Elle peut générer des revenus rapidement.';
        action = 'Définis la toute première micro-étape (15 min max) pour commencer cette idée aujourd\'hui.';
    } else if (alignment >= 8) {
        verdict = 'FOCUS';
        verdictReason = 'Excellente synergie avec tes projets actuels. Cette idée renforce tes compétences clés.';
        action = 'Bloque 30 minutes aujourd\'hui pour faire une première action concrète.';
    } else if (alignment <= 4) {
        verdict = 'ABANDON';
        verdictReason = 'Cette idée ne s\'aligne pas avec ton objectif d\'indépendance du 1er mars. Risque de dispersion.';
        action = 'Archive cette idée. Focus sur trouver ton 1er client avant tout.';
    }
    
    return {
        passion,
        passionReason: passion >= 8 ? "Tu sembles vraiment enthousiaste pour cette idée !" : "Intérêt modéré détecté",
        faisabilite,
        faisabiliteReason: faisabilite >= 7 ? "Projet réalisable rapidement avec tes compétences" : "Nécessitera du temps et de l'apprentissage",
        rentabilite,
        rentabiliteReason: rentabilite >= 7 ? "Potentiel de revenus identifié" : "Rentabilité indirecte ou à long terme",
        alignment,
        alignmentReason: alignment >= 7 ? "Forte synergie avec tes 5 projets prioritaires" : "Lien faible avec tes objectifs du 1er mars",
        verdict,
        verdictReason,
        action
    };
}

// ============================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================

function attachEventListeners() {
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
        micBtn.onclick = toggleRecording;
    }
}

// ============================================
// INITIALISATION
// ============================================

function init() {
    loadState();
    render();
    
    // Mise à jour du streak quotidien
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        if (lastVisit) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                state.user.streak++;
            } else {
                state.user.streak = 1;
            }
        } else {
            state.user.streak = 1;
        }
        
        localStorage.setItem('lastVisit', today);
        saveState();
    }
}

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', init);
