document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const typingIndicator = document.getElementById('typingIndicator');
    const suggestedList = document.getElementById('suggestedList');
    const categoryPills = document.getElementById('categoryPills');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const exportChatBtn = document.getElementById('exportChatBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const exitChatBtn = document.getElementById('exitChatBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const viewDatasetBtn = document.getElementById('viewDatasetBtn');
    const datasetModal = document.getElementById('datasetModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const datasetList = document.getElementById('datasetList');
    const datasetSearch = document.getElementById('datasetSearch');
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');
    const initTime = document.getElementById('initTime');
    const serverStatusBadge = document.getElementById('serverStatusBadge');
    const userProfileBadge = document.getElementById('userProfileBadge');
    const userNameDisplay = document.getElementById('userNameDisplay');

    // State Variables
    let soundEnabled = true;
    let currentThemeIndex = 0;
    const themes = ['theme-dark', 'theme-cyber', 'theme-light'];
    let isFlaskServerOnline = false;

    // User Session Check
    const savedUserJson = localStorage.getItem('eduquery_user');
    if (savedUserJson) {
        try {
            const userObj = JSON.parse(savedUserJson);
            if (userProfileBadge && userNameDisplay) {
                userNameDisplay.textContent = `${userObj.name} (${userObj.role || 'Student'})`;
                userProfileBadge.style.display = 'flex';
            }
        } catch(e) {}
    }

    // Default Knowledge Base Dataset
    let fullDataset = [
        {
            "tag": "greeting", "category": "General",
            "patterns": ["hi", "hello", "hey", "good morning", "good afternoon", "greetings", "hi chatbot"],
            "responses": ["Hello! Welcome to the Student Query Portal. How can I assist you today with courses, fees, timings, or admissions?"]
        },
        {
            "tag": "goodbye", "category": "General",
            "patterns": ["bye", "goodbye", "quit", "exit", "stop", "close", "see you later"],
            "responses": ["Goodbye! Thank you for visiting the Student Query Portal. Good luck with your studies!"]
        },
        {
            "tag": "thanks", "category": "General",
            "patterns": ["thanks", "thank you", "that's helpful", "awesome thanks", "appreciate it"],
            "responses": ["You're very welcome! Let me know if you need anything else."]
        },
        {
            "tag": "courses_offered", "category": "Courses",
            "patterns": ["what courses do you offer?", "list of available courses", "which degrees are available?", "tell me about undergraduate programs", "what postgraduate courses are offered?", "can i study btech or bsc here?"],
            "responses": ["We offer Undergraduate (B.Tech Computer Science, B.Sc Data Science, BBA, BCA) and Postgraduate (M.Tech AI, MCA, MBA) programs along with specialized Diploma courses."]
        },
        {
            "tag": "course_duration", "category": "Courses",
            "patterns": ["how long are the courses?", "what is the duration of btech?", "duration of mca degree", "how many years does mba take?"],
            "responses": ["Undergraduate engineering (B.Tech) programs are 4 years. B.Sc, BCA, and BBA are 3-year programs. Postgraduate degrees (M.Tech, MCA, MBA) take 2 years."]
        },
        {
            "tag": "course_eligibility", "category": "Admissions",
            "patterns": ["what is the eligibility criteria?", "who can apply for btech?", "eligibility for mca program", "what marks are required for admission?"],
            "responses": ["For B.Tech/B.Sc: Minimum 60% aggregate in 10+2 with Mathematics/Physics. For MCA/MBA: Bachelor's degree in relevant discipline with at least 55% aggregate marks."]
        },
        {
            "tag": "fee_structure", "category": "Fees",
            "patterns": ["what is the fee structure?", "how much are the tuition fees?", "fee per semester for btech", "what is the cost of studying mca?", "tell me about total course fees"],
            "responses": ["Tuition fees are approximately ₹45,000 per semester for B.Tech, ₹35,000 per semester for BCA/B.Sc, and ₹50,000 per semester for MCA/MBA. Installment options are available."]
        },
        {
            "tag": "scholarships", "category": "Fees",
            "patterns": ["are scholarships available?", "how can i apply for a scholarship?", "merit scholarship criteria", "is financial assistance provided?"],
            "responses": ["Yes! Merit-based scholarships up to 50% tuition waiver are awarded to students scoring over 90% in qualifying entrance exams. Need-based aid is also available."]
        },
        {
            "tag": "class_timings", "category": "Timings",
            "patterns": ["what are the class timings?", "college hours", "when do lectures start and end?", "morning shift timing"],
            "responses": ["Regular classes run from Monday to Friday, 9:00 AM to 4:30 PM. Lab sessions are scheduled between 1:30 PM and 4:30 PM."]
        },
        {
            "tag": "library_timings", "category": "Timings",
            "patterns": ["what are the library hours?", "is the library open on weekends?", "when does the library close?"],
            "responses": ["The Central Library is open Monday to Saturday from 8:00 AM to 8:00 PM. During examination months, it remains open 24/7."]
        },
        {
            "tag": "exam_schedule", "category": "Exams",
            "patterns": ["when are the semester exams held?", "exam schedule", "mid term examination dates", "where can i find the exam timetable?"],
            "responses": ["Mid-term exams take place in October (Odd semester) and March (Even semester). End-semester final exams are conducted in December and May."]
        },
        {
            "tag": "contact_info", "category": "Contact",
            "patterns": ["how can i contact administration?", "admission office phone number", "helpdesk email address", "college phone number"],
            "responses": ["You can reach the Student Helpdesk at admissions@university.edu or call +91-1800-555-0199. Office hours: Mon-Fri, 9:00 AM - 5:00 PM."]
        },
        {
            "tag": "campus_location", "category": "Contact",
            "patterns": ["where is the campus located?", "what is the college address?", "how to reach the university campus?"],
            "responses": ["The main campus is located at University Tech Park, Knowledge Corridor, City Center. It is easily accessible via Metro Line 2 (Station: Tech Campus)."]
        },
        {
            "tag": "hostel_facility", "category": "Facilities",
            "patterns": ["is hostel accommodation provided?", "hostel fees and facilities", "are there separate hostels for boys and girls?"],
            "responses": ["Yes, separate high-security hostels with Wi-Fi, mess facilities, and AC/non-AC rooms are available for boys and girls. Hostel fee ranges from ₹30,000 to ₹50,000 per semester."]
        },
        {
            "tag": "placements", "category": "Placements",
            "patterns": ["what is the placement record?", "top recruiting companies", "average salary package offered", "highest placement package"],
            "responses": ["Our placement cell has a 92% placement record. Top recruiters include Google, Microsoft, TCS, Infosys, and Amazon. The average package is ₹6.5 LPA, with a highest package of ₹42 LPA."]
        }
    ];

    if (initTime) {
        initTime.textContent = getCurrentTime();
    }

    initKnowledgeBase();

    // ----------------------------------------------------
    // Event Listeners
    // ----------------------------------------------------

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = userInput.value.trim();
        if (query) {
            sendMessage(query);
            userInput.value = '';
        }
    });

    clearChatBtn.addEventListener('click', () => {
        chatWindow.innerHTML = '';
        appendBotMessage("Chat history cleared. How can I assist you today?", "General", 100.0, false, []);
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                localStorage.removeItem('eduquery_user');
                window.location.href = 'login.html';
            }
        });
    }

    exitChatBtn.addEventListener('click', () => {
        sendMessage("exit");
    });

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.remove(themes[currentThemeIndex]);
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.classList.add(themes[currentThemeIndex]);
    });

    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggleBtn.classList.toggle('active', soundEnabled);
        if (soundEnabled) playChime();
    });

    exportChatBtn.addEventListener('click', () => {
        exportChatTranscript();
    });

    // Voice Input (Speech Recognition)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        let isListening = false;
        voiceBtn.addEventListener('click', () => {
            if (!isListening) {
                recognition.start();
                voiceBtn.classList.add('listening');
                isListening = true;
            } else {
                recognition.stop();
                voiceBtn.classList.remove('listening');
                isListening = false;
            }
        });

        recognition.onresult = (event) => {
            userInput.value = event.results[0][0].transcript;
            voiceBtn.classList.remove('listening');
            isListening = false;
        };

        recognition.onerror = () => voiceBtn.classList.remove('listening');
        recognition.onend = () => voiceBtn.classList.remove('listening');
    } else {
        voiceBtn.style.display = 'none';
    }

    // Category Pills Filter
    categoryPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;

        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.getAttribute('data-category');
        filterSuggestionsByCategory(category);
    });

    // Sidebar Live Search Input
    sidebarSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (!searchTerm) {
            renderSuggestedQuestions(fullDataset);
            return;
        }
        const filtered = fullDataset.filter(intent => {
            const tag = (intent.tag || '').toLowerCase();
            const category = (intent.category || '').toLowerCase();
            const patterns = (intent.patterns || []).join(' ').toLowerCase();
            return tag.includes(searchTerm) || category.includes(searchTerm) || patterns.includes(searchTerm);
        });
        renderSuggestedQuestions(filtered);
    });

    // Knowledge Base Modal Controls
    viewDatasetBtn.addEventListener('click', () => {
        datasetModal.classList.add('active');
        renderDatasetCards('');
    });

    closeModalBtn.addEventListener('click', () => {
        datasetModal.classList.remove('active');
    });

    datasetModal.addEventListener('click', (e) => {
        if (e.target === datasetModal) datasetModal.classList.remove('active');
    });

    datasetSearch.addEventListener('input', (e) => {
        renderDatasetCards(e.target.value.toLowerCase());
    });

    // ----------------------------------------------------
    // Functions & NLP Matching Engine
    // ----------------------------------------------------

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function playChime() {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {}
    }

    function initKnowledgeBase() {
        fetch('./dataset.json')
            .then(res => res.json())
            .then(data => {
                if (data.intents && data.intents.length > 0) {
                    fullDataset = data.intents;
                }
                renderSuggestedQuestions(fullDataset);
            })
            .catch(err => {
                renderSuggestedQuestions(fullDataset);
            });

        fetch('/api/categories')
            .then(res => {
                if (res.ok) {
                    isFlaskServerOnline = true;
                    if (serverStatusBadge) {
                        serverStatusBadge.innerHTML = `<span class="status-dot"></span> Flask API Online`;
                    }
                } else {
                    setOfflineBadge();
                }
            })
            .catch(err => {
                setOfflineBadge();
            });
    }

    function setOfflineBadge() {
        isFlaskServerOnline = false;
        if (serverStatusBadge) {
            serverStatusBadge.innerHTML = `<span class="status-dot" style="background:#10b981"></span> Web NLP Engine Active`;
        }
    }

    function sendMessage(query) {
        appendUserMessage(query);
        showTyping(true);

        if (isFlaskServerOnline) {
            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            })
            .then(res => {
                if (!res.ok) throw new Error("Flask endpoint unreachable");
                return res.json();
            })
            .then(data => {
                showTyping(false);
                playChime();
                const { response, confidence, category, is_exit, suggestions } = data;
                appendBotMessage(response, category, confidence, is_exit, suggestions);
            })
            .catch(err => {
                processClientSideQuery(query);
            });
        } else {
            setTimeout(() => {
                processClientSideQuery(query);
            }, 300);
        }
    }

    function processClientSideQuery(query) {
        showTyping(false);
        playChime();
        const result = clientSideNlpMatch(query);
        appendBotMessage(result.response, result.category, result.confidence, result.is_exit, result.suggestions);
    }

    function clientSideNlpMatch(userQuery) {
        const stopWords = new Set(["a", "about", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for", "from", "how", "i", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "what", "when", "where", "which", "who", "why", "will", "with", "you", "your"]);
        
        const cleaned = userQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        if (!cleaned) {
            return {
                response: "Please ask a question so I can assist you!",
                confidence: 0.0, category: "General", is_exit: false,
                suggestions: getLocalSuggestions()
            };
        }

        const exitWords = ["exit", "quit", "bye", "goodbye", "stop", "close"];
        if (exitWords.includes(cleaned) || exitWords.some(w => cleaned.split(/\s+/).includes(w))) {
            return {
                response: "Thank you for visiting the Student Query Portal. Good luck with your studies!",
                confidence: 100.0, category: "General", is_exit: true, suggestions: []
            };
        }

        const rawWords = cleaned.split(/\s+/);
        const filteredWords = rawWords.filter(w => !stopWords.has(w) && w.length > 1);
        const queryWords = filteredWords.length > 0 ? filteredWords : rawWords;

        let bestIntent = null;
        let bestScore = 0.0;
        let bestCategory = "General";

        fullDataset.forEach(intent => {
            const cat = intent.category || "General";
            (intent.patterns || []).forEach(pattern => {
                const patCleaned = pattern.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                const patWords = patCleaned.split(/\s+/).filter(w => !stopWords.has(w));
                
                if (patCleaned === cleaned) {
                    bestScore = 1.0;
                    bestIntent = intent;
                    bestCategory = cat;
                    return;
                }

                let matchCount = 0;
                queryWords.forEach(qw => {
                    if (patWords.includes(qw) || patCleaned.includes(qw)) {
                        matchCount++;
                    }
                });

                if (matchCount > 0) {
                    const overlapScore = matchCount / Math.max(queryWords.length, 1);
                    if (overlapScore > bestScore) {
                        bestScore = overlapScore;
                        bestIntent = intent;
                        bestCategory = cat;
                    }
                }
            });
        });

        if (bestIntent && bestScore >= 0.2) {
            const conf = Math.min(Math.round(bestScore * 100), 100);
            const resp = bestIntent.responses[Math.floor(Math.random() * bestIntent.responses.length)];
            return {
                response: resp,
                confidence: conf,
                category: bestCategory,
                is_exit: (bestIntent.tag === "goodbye"),
                suggestions: getLocalSuggestions()
            };
        } else {
            return {
                response: "I'm sorry, I couldn't find an exact match for your question. You can ask about course details, fee structures, class timings, eligibility, or contact info.",
                confidence: Math.round(bestScore * 100),
                category: "General",
                is_exit: false,
                suggestions: getLocalSuggestions()
            };
        }
    }

    function getLocalSuggestions() {
        const pool = [
            "What courses do you offer?",
            "What is the fee structure for B.Tech?",
            "What are the class timings?",
            "Is hostel accommodation provided?",
            "What is the eligibility criteria?"
        ];
        return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.innerHTML = `
            <div class="avatar user-avatar">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">You</span>
                    <span class="timestamp">${getCurrentTime()}</span>
                </div>
                <div class="message-text">${escapeHtml(text)}</div>
            </div>
        `;
        chatWindow.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendBotMessage(text, category = "General", confidence = 0.0, isExit = false, suggestions = []) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';

        let confBadgeClass = 'badge-conf-low';
        if (confidence >= 70) confBadgeClass = 'badge-conf-high';
        else if (confidence >= 40) confBadgeClass = 'badge-conf-medium';

        let contextualFollowups = '';
        if (category === 'Courses') {
            contextualFollowups = `
                <div class="contextual-followups">
                    <button class="followup-btn" onclick="sendQuickQuery('What is the fee structure?')">💰 View Fees</button>
                    <button class="followup-btn" onclick="sendQuickQuery('What is the eligibility criteria?')">📋 Eligibility</button>
                    <button class="followup-btn" onclick="sendQuickQuery('How to contact administration?')">📞 Contact</button>
                </div>`;
        } else if (category === 'Fees') {
            contextualFollowups = `
                <div class="contextual-followups">
                    <button class="followup-btn" onclick="sendQuickQuery('Are scholarships available?')">🎓 Scholarships</button>
                    <button class="followup-btn" onclick="sendQuickQuery('What courses do you offer?')">📚 Programs</button>
                </div>`;
        } else if (category === 'Timings') {
            contextualFollowups = `
                <div class="contextual-followups">
                    <button class="followup-btn" onclick="sendQuickQuery('What are the library hours?')">📖 Library Hours</button>
                    <button class="followup-btn" onclick="sendQuickQuery('When are the semester exams held?')">📝 Exam Schedule</button>
                </div>`;
        }

        let suggestionsHtml = '';
        if (suggestions && suggestions.length > 0 && confidence < 50 && !isExit) {
            suggestionsHtml = `
                <div style="margin-top: 10px; font-size: 0.8rem; color: #a5b4fc;">
                    <strong>Did you mean:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
                        ${suggestions.map(s => `<button class="action-chip" onclick="sendQuickQuery('${escapeHtml(s)}')">${escapeHtml(s)}</button>`).join('')}
                    </div>
                </div>
            `;
        }

        msgDiv.innerHTML = `
            <div class="avatar bot-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">EduQuery Bot</span>
                    <span class="badge ${confBadgeClass}">${confidence}% Match</span>
                    <span class="badge badge-nlp">${category}</span>
                    <span class="timestamp">${getCurrentTime()}</span>
                </div>
                <div class="message-text">
                    ${text}
                    ${suggestionsHtml}
                </div>
                ${contextualFollowups}
                <div class="message-actions">
                    <button class="action-chip" onclick="copyToClipboard('${escapeHtml(text)}')"><i class="fa-solid fa-copy"></i> Copy</button>
                    <button class="action-chip" onclick="speakText('${escapeHtml(text)}')"><i class="fa-solid fa-volume-high"></i> Listen</button>
                    <button class="action-chip" onclick="rateResponse(this, true)"><i class="fa-solid fa-thumbs-up"></i> Helpful</button>
                </div>
            </div>
        `;
        chatWindow.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTyping(show) {
        typingIndicator.style.display = show ? 'flex' : 'none';
        if (show) scrollToBottom();
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function renderSuggestedQuestions(intents) {
        suggestedList.innerHTML = '';
        let count = 0;
        intents.forEach(intent => {
            if (count >= 7) return;
            if (intent.tag !== 'greeting' && intent.tag !== 'goodbye' && intent.patterns && intent.patterns.length > 0) {
                const q = intent.patterns[0];
                const btn = document.createElement('button');
                btn.className = 'suggest-item';
                btn.textContent = q;
                btn.onclick = () => sendMessage(q);
                suggestedList.appendChild(btn);
                count++;
            }
        });
    }

    function filterSuggestionsByCategory(category) {
        if (category === 'All') {
            renderSuggestedQuestions(fullDataset);
            return;
        }
        const filtered = fullDataset.filter(i => i.category === category);
        renderSuggestedQuestions(filtered);
    }

    function renderDatasetCards(searchFilter) {
        datasetList.innerHTML = '';
        fullDataset.forEach(intent => {
            const tag = intent.tag || '';
            const category = intent.category || 'General';
            const patterns = (intent.patterns || []).join(', ');
            const response = (intent.responses || [])[0] || '';

            if (searchFilter && !patterns.toLowerCase().includes(searchFilter) && !response.toLowerCase().includes(searchFilter) && !tag.toLowerCase().includes(searchFilter)) {
                return;
            }

            const card = document.createElement('div');
            card.className = 'dataset-card';
            card.innerHTML = `
                <div class="dataset-card-header">
                    <span class="dataset-tag"><i class="fa-solid fa-tag"></i> ${tag}</span>
                    <span class="badge badge-nlp">${category}</span>
                </div>
                <div class="dataset-patterns"><strong>Sample Queries:</strong> ${escapeHtml(patterns)}</div>
                <div class="dataset-response"><strong>Predefined Response:</strong> ${escapeHtml(response)}</div>
            `;
            datasetList.appendChild(card);
        });
    }

    function exportChatTranscript() {
        const messages = chatWindow.querySelectorAll('.message');
        let transcript = "===========================================\n";
        transcript += "     EduQuery AI Chatbot Transcript        \n";
        transcript += "     Date: " + new Date().toLocaleString() + "\n";
        transcript += "===========================================\n\n";

        messages.forEach(msg => {
            const sender = msg.querySelector('.sender-name')?.textContent || 'User';
            const text = msg.querySelector('.message-text')?.innerText || '';
            const time = msg.querySelector('.timestamp')?.textContent || '';
            transcript += `[${time}] ${sender}: ${text}\n\n`;
        });

        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chat_Transcript_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    // Global Window Helpers
    window.sendQuickQuery = (query) => {
        sendMessage(query);
    };

    window.copyToClipboard = (text) => {
        const cleanText = text.replace(/<[^>]*>?/gm, '');
        navigator.clipboard.writeText(cleanText).then(() => {
            alert("Copied to clipboard!");
        });
    };

    window.speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/<[^>]*>?/gm, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            window.speechSynthesis.speak(utterance);
        }
    };

    window.rateResponse = (btn, isPositive) => {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Thank you!`;
        btn.style.color = '#10b981';
        btn.style.borderColor = '#10b981';
    };
});
