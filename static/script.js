document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    lucide.createIcons();

    // Elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const charCount = document.getElementById('char-count');
    
    // Sections
    const inputSection = document.querySelector('.input-section');
    const loadingSection = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');
    const errorSection = document.getElementById('error-section');
    
    // Result Elements
    const sentimentBadge = document.getElementById('sentiment-badge');
    
    // Probabilities
    const valPos = document.getElementById('val-positive');
    const barPos = document.getElementById('bar-positive');
    const valNeu = document.getElementById('val-neutral');
    const barNeu = document.getElementById('bar-neutral');
    const valNeg = document.getElementById('val-negative');
    const barNeg = document.getElementById('bar-negative');

    // Buttons
    const resetBtn = document.getElementById('reset-btn');
    const retryBtn = document.getElementById('retry-btn');
    const errorMessage = document.getElementById('error-message');

    // Character Count feature
    textInput.addEventListener('input', () => {
        const count = textInput.value.length;
        charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
        analyzeBtn.disabled = count === 0;
    });

    // Helper to switch view states
    const showState = (state) => {
        [inputSection, loadingSection, resultSection, errorSection].forEach(el => el.classList.add('hidden'));
        
        if (state === 'input') inputSection.classList.remove('hidden');
        if (state === 'loading') loadingSection.classList.remove('hidden');
        if (state === 'result') resultSection.classList.remove('hidden');
        if (state === 'error') errorSection.classList.remove('hidden');
    };

    // Analyze Action
    const analyzeText = async () => {
        const text = textInput.value.trim();
        if (!text) return;

        showState('loading');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to fetch analysis.');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error("Analysis Error:", error);
            errorMessage.textContent = error.message;
            showState('error');
        }
    };

    const displayResults = (data) => {
        const sentiment = data.sentiment;
        const probs = data.probabilities || { Positive: 0, Neutral: 0, Negative: 0 };
        
        // Update Badge
        sentimentBadge.textContent = sentiment;
        sentimentBadge.className = 'badge'; // reset
        
        if (sentiment === 'Positive') sentimentBadge.classList.add('badge-positive');
        else if (sentiment === 'Negative') sentimentBadge.classList.add('badge-negative');
        else sentimentBadge.classList.add('badge-neutral');

        // Show UI
        showState('result');

        // Animate progress bars, add slight delay for effect
        setTimeout(() => {
            const updateBar = (valEl, barEl, numVal) => {
                const p = (numVal * 100).toFixed(1);
                valEl.textContent = `${p}%`;
                barEl.style.width = `${p}%`;
            };

            updateBar(valPos, barPos, probs.Positive || 0);
            updateBar(valNeu, barNeu, probs.Neutral || 0);
            updateBar(valNeg, barNeg, probs.Negative || 0);
        }, 100);
    };

    // Event Listeners
    analyzeBtn.addEventListener('click', analyzeText);
    
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            analyzeText();
        }
    });

    const resetState = () => {
        textInput.value = '';
        textInput.dispatchEvent(new Event('input')); // trigger char count update
        
        // Reset bars visually instantly for next time
        barPos.style.width = '0%';
        barNeu.style.width = '0%';
        barNeg.style.width = '0%';
        
        showState('input');
        textInput.focus();
    };

    resetBtn.addEventListener('click', resetState);
    retryBtn.addEventListener('click', resetState);
});
