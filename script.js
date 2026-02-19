document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggle = document.getElementById('theme-toggle');
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Humanizer Elements
    const humanizerInput = document.getElementById('humanizer-input');
    const humanizeBtn = document.getElementById('humanize-btn');
    const humanizerOutput = document.getElementById('humanizer-output');
    const inputWordCount = document.getElementById('input-word-count');
    const toneSelect = document.getElementById('tone-select');
    const readabilitySelect = document.getElementById('readability-select');
    
    // Checker Elements
    const checkerInput = document.getElementById('checker-input');
    const checkBtn = document.getElementById('check-btn');
    const checkerResults = document.getElementById('checker-results');
    const checkerWordCount = document.getElementById('checker-word-count');
    const scoreCirclePath = document.getElementById('score-circle-path');
    const scoreText = document.getElementById('score-text');
    const verdictLabel = document.getElementById('verdict-label');
    const perplexityScore = document.getElementById('perplexity-score');
    const burstinessScore = document.getElementById('burstiness-score');

    // --- State ---
    let isDark = localStorage.getItem('theme') === 'dark';

    // --- Initialization ---
    applyTheme();

    // --- Event Listeners ---
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme();
    });

    // Tab Switching
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // Update buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Word Counts
    humanizerInput.addEventListener('input', () => updateWordCount(humanizerInput, inputWordCount));
    checkerInput.addEventListener('input', () => updateWordCount(checkerInput, checkerWordCount));

    // Copy Button
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const text = document.getElementById(targetId).innerText;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalIcon = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => btn.innerHTML = originalIcon, 2000);
                });
            }
        });
    });

    // Humanize Action
    humanizeBtn.addEventListener('click', () => {
        const text = humanizerInput.value.trim();
        if (!text) return;

        humanizeBtn.disabled = true;
        humanizeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

        // Simulate API delay
        setTimeout(() => {
            const result = humanizeText(text, toneSelect.value, readabilitySelect.value);
            humanizerOutput.innerText = result;
            humanizeBtn.disabled = false;
            humanizeBtn.innerHTML = '<i class="fa-solid fa-sparkles"></i> Humanize Text';
        }, 1000);
    });

    // Check Action
    checkBtn.addEventListener('click', () => {
        const text = checkerInput.value.trim();
        if (!text) return;

        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        checkerResults.style.display = 'none';

        // Simulate API delay
        setTimeout(() => {
            const analysis = analyzeText(text);
            displayResults(analysis);
            checkerResults.style.display = 'flex';
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Check for AI';
        }, 1500);
    });

    // --- Helper Functions ---

    function applyTheme() {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    function updateWordCount(input, display) {
        const words = input.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        display.innerText = `${words} words`;
    }

    // --- Logic Implementation (Heuristics) ---

    // Expanded dictionary for targeted AI removal
    const synonymMap = {
        'utilize': 'use',
        'demonstrate': 'show',
        'subsequently': 'later',
        'nevertheless': 'still',
        'furthermore': 'also',
        'consequently': 'so',
        'initially': 'at first',
        'approximately': 'about',
        'monitor': 'watch',
        'implement': 'start',
        'sufficient': 'enough',
        'verify': 'check',
        'commence': 'start',
        'termination': 'end',
        'endeavor': 'try',
        'moreover': 'plus',
        'therefore': 'so',
        'however': 'but',
        'additionally': 'also',
        'significantly': 'a lot',
        'fundamental': 'basic',
        'crucial': 'key',
        'examine': 'look at',
        'facilitate': 'help',
        'delve': 'dig',
        'tapestry': 'mix',
        'landscape': 'scene',
        'underscores': 'highlights',
        'testament': 'proof',
        'realm': 'world',
        'dynamic': 'active',
        'meticulous': 'careful',
        'comprehensive': 'full',
        'foster': 'grow',
        'nuance': 'detail',
        'evolving': 'changing',
        'pivotal': 'key',
        'intricate': 'complex',
        'leverage': 'use',
        'optimize': 'fix',
        'seamless': 'smooth',
        'vital': 'key',
        'notably': 'mainly',
        'emphasis': 'focus',
        'transformative': 'big',
        'robust': 'strong',
        'echo': 'repeat',
        'resonate': 'stick',
        'poignant': 'sad',
        'stark': 'sharp'
    };

    const phraseReplacements = {
        'it is important to note': 'note that',
        'in summary': 'basically',
        'in the world of': 'in',
        'plays a significant role': 'matters a lot',
        'testament to the': 'proof of',
        'delve into': 'look into',
        'rich tapestry': 'mix',
        'ever-evolving': 'changing',
        'let\'s explore': 'let\'s see',
        'can be characterized by': 'is like',
        'serves as a reminder': 'reminds us',
        'silence followed': 'it got quiet',
        'knew better': 'wasn\'t fooled',
        'just as suddenly': 'suddenly',
        'not peace, but': 'not peace, just',
        'began to': 'started to',
        'a sense of': 'a feeling of',
        'darkness fell': 'it got dark',
        'in the end': 'finally',
        'only to find': 'but found',
        'met with silence': 'heard nothing'
    };

    function humanizeText(text, tone, readability) {
        let processedText = text;

        // 1. Remove Em Dashes (High AI signal)
        processedText = processedText.replace(/—/g, ', ').replace(/--/g, ', ');

        // 2. Replace AI Phrases
        for (const [phrase, replacement] of Object.entries(phraseReplacements)) {
            const regex = new RegExp(phrase, 'gi');
            processedText = processedText.replace(regex, replacement);
        }

        // 3. Word-level processing
        let words = processedText.split(/\s+/);
        let processedWords = words.map(word => {
            let cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
            let punctuation = word.slice(cleanWord.length);
            
            // Check synonym map
            if (synonymMap[cleanWord]) {
                // 80% chance to replace common AI words
                if (Math.random() > 0.2) {
                    let replacement = synonymMap[cleanWord];
                    // Match capitalization
                    if (word[0] === word[0].toUpperCase()) {
                        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
                    }
                    return replacement + punctuation;
                }
            }
            return word;
        });

        processedText = processedWords.join(' ');

        // 4. Structure Variation (Burstiness)
        // Split text into sentences
        let sentences = processedText.match(/[^.!?]+[.!?]+/g) || [processedText];
        
        let newSentences = [];
        for (let i = 0; i < sentences.length; i++) {
            let s = sentences[i].trim();
            
            // Randomly merge short sentences (if next exists)
            if (i < sentences.length - 1 && s.split(' ').length < 8 && Math.random() > 0.6) {
                let nextS = sentences[i+1].trim();
                // Remove punctuation from first sentence
                s = s.replace(/[.!?]+$/, '');
                // Lowercase next sentence start
                nextS = nextS.charAt(0).toLowerCase() + nextS.slice(1);
                newSentences.push(`${s} and ${nextS}`);
                i++; // Skip next sentence
            } 
            // Randomly split long sentences (simple heuristic at 'and' or 'but')
            else if (s.split(' ').length > 20 && Math.random() > 0.5) {
                let parts = s.split(/ (and|but) /);
                if (parts.length > 1) {
                    newSentences.push(parts[0] + '.');
                    newSentences.push(parts[1].charAt(0).toUpperCase() + parts[1].slice(1) + parts.slice(2).join(' '));
                } else {
                    newSentences.push(s);
                }
            } else {
                newSentences.push(s);
            }
        }

        // 5. Tone Adjustments (Add "Human Noise")
        if (tone === 'casual') {
            newSentences = newSentences.map(s => {
                // Contractions
                s = s.replace(/ cannot /gi, " can't ")
                     .replace(/ do not /gi, " don't ")
                     .replace(/ is not /gi, " isn't ")
                     .replace(/ will not /gi, " won't ")
                     .replace(/ I am /gi, " I'm ");
                
                // Filler words start
                if (Math.random() > 0.85) {
                    const fillers = ['Honestly, ', 'Basically, ', 'You know, ', 'Look, '];
                    return fillers[Math.floor(Math.random() * fillers.length)] + s.charAt(0).toLowerCase() + s.slice(1);
                }
                return s;
            });
        }

        return newSentences.join(' ');
    }

    function analyzeText(text) {
        // Advanced Heuristic Analysis for AI Probability
        // AI text (especially ChatGPT) has specific fingerprints:
        // 1. Uniform sentence length (low standard deviation).
        // 2. High frequency of specific "AI words" (delve, tapestry, crucial).
        // 3. Overuse of transition words.
        
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
        
        if (sentenceLengths.length === 0) return { score: 0, perplexity: 0, burstiness: 0 };

        // 1. Burstiness (Sentence Length Variance)
        const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
        const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length;
        const stdDev = Math.sqrt(variance);
        
        // AI is very uniform (Low StdDev). Humans are bursty (High StdDev).
        // If StdDev is < 4, it's very likely AI. If > 10, likely human.
        // We calculate a "Human Variance Score" (0 = Robotic, 100 = Very Bursty)
        let varianceScore = Math.min(100, (stdDev / 12) * 100);
        
        // 2. Vocabulary Diversity (Perplexity Proxy)
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        if (words.length === 0) return { score: 0, perplexity: 0, burstiness: 0 };

        const uniqueWords = new Set(words).size;
        // TTR penalizes long text naturally, so we adjust.
        // A low TTR means repetition.
        const ttr = words.length > 0 ? uniqueWords / words.length : 0; 
        let diversityScore = Math.min(100, ttr * 100 * 1.8); 

        // 3. Specific AI Vocabulary & Phrasing Fingerprinting
        const aiWords = [
            'delve', 'tapestry', 'landscape', 'crucial', 'underscores', 
            'testament', 'realm', 'dynamic', 'meticulous', 'comprehensive',
            'utilize', 'foster', 'moreover', 'furthermore', 'consequently',
            'in conclusion', 'lastly', 'additionally', 'nuance', 'evolving',
            'pivotal', 'intricate', 'leverage', 'optimize', 'seamless',
            'vital', 'notably', 'emphasis', 'transformative', 'robust',
            'echo', 'resonate', 'poignant', 'stark', 'testimony'
        ];

        const aiPhrases = [
            'it is important to note', 'in summary', 'in the world of',
            'plays a significant role', 'testament to the', 'delve into',
            'rich tapestry', 'ever-evolving', 'let\'s explore',
            'can be characterized by', 'serves as a reminder',
            'silence followed', 'knew better', 'just as suddenly',
            'not peace, but', 'began to', 'a sense of', 'darkness fell',
            'in the end', 'only to find', 'met with silence'
        ];

        let aiHits = 0;
        const lowerText = text.toLowerCase();
        
        // Check Words
        words.forEach(w => {
            if (aiWords.includes(w)) aiHits += 2; // Words count as 2 points
        });

        // Check Phrases
        aiPhrases.forEach(phrase => {
            if (lowerText.includes(phrase)) aiHits += 6; // Phrases count as 6 points
        });

        // Check for Em Dashes (Common in AI creative writing)
        const emDashCount = (text.match(/—/g) || []).length + (text.match(/--/g) || []).length;
        if (emDashCount > 0) {
            // AI tends to use em dashes more frequently for dramatic effect
            aiHits += (emDashCount * 3);
        }

        // Normalize AI Hits by length. 
        // 5 hits per 100 words is considered "High AI"
        const aiPatternScore = Math.min(100, (aiHits / words.length) * 2000);

        // --- Final Scoring ---
        // AI Score increases if:
        // - Variance is LOW (Low burstiness)
        // - Diversity is LOW (Repetitive)
        // - AI Patterns are HIGH
        
        const aiScoreBurstiness = 100 - varianceScore; 
        const aiScoreDiversity = 100 - diversityScore;
        
        // Weights: Patterns are the strongest indicator for ChatGPT
        let totalAiScore = (aiScoreBurstiness * 0.20) + (aiScoreDiversity * 0.10) + (aiPatternScore * 0.70);
        
        // Boost score if variance is extremely low (very robotic)
        if (stdDev < 3) totalAiScore += 15;
        
        // Boost score if specific strong phrases are found
        if (lowerText.includes("regenerate response") || lowerText.includes("as an ai language model")) {
            totalAiScore = 100;
        }

        return {
            score: Math.round(Math.max(0, Math.min(100, totalAiScore))),
            perplexity: Math.round(diversityScore), // Human-ness metric
            burstiness: Math.round(varianceScore)   // Variance metric
        };
    }

    function displayResults(data) {
        // Update Circle
        const circumference = 100; 
        // Ensure dasharray is set to circumference to allow the stroke to be visible
        scoreCirclePath.style.strokeDasharray = `${circumference}, ${circumference}`;
        const offset = circumference - (data.score / 100) * circumference;
        scoreCirclePath.style.strokeDashoffset = offset;
        scoreText.textContent = `${data.score}%`;
        
        // Color & Verdict
        scoreCirclePath.classList.remove('score-low', 'score-mid', 'score-high');
        let verdict = '';
        let desc = '';
        
        if (data.score < 30) {
            scoreCirclePath.classList.add('score-low'); // Human
            verdict = 'Likely Human';
            desc = 'This text has high variance and natural patterns.';
        } else if (data.score < 70) {
            scoreCirclePath.classList.add('score-mid'); // Mixed
            verdict = 'Mixed / Unsure';
            desc = 'Contains elements of both AI and human writing.';
        } else {
            scoreCirclePath.classList.add('score-high'); // AI
            verdict = 'Likely AI';
            desc = 'Shows uniform sentence structure and robotic patterns.';
        }
        
        verdictLabel.innerText = verdict;
        document.querySelector('.verdict-desc').innerText = desc;
        
        // Metrics
        perplexityScore.innerText = data.perplexity; // Showing TTR/Diversity as score
        burstinessScore.innerText = data.burstiness; // Showing StdDev as score
    }
});
