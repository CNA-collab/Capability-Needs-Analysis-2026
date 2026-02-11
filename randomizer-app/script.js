document.getElementById('randomizer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const uppercase = document.getElementById('uppercase').value;
    const lowercase = document.getElementById('lowercase').value;
    const numbers = document.getElementById('numbers').value;

    const symbols = document.getElementById('symbols').value;
    const length = parseInt(document.getElementById('length').value);
    const count = parseInt(document.getElementById('count').value);
    
    // Combine all inputs into a pool
    let pool = (uppercase + lowercase + numbers + symbols).split('');
    
    // Remove duplicates from pool
    pool = [...new Set(pool)];
    
    if (pool.length < length) {
        alert('Jumlah karakter unik dalam pool kurang dari panjang yang diminta. Harap tambahkan lebih banyak karakter.');
        return;
    }
    
    const results = [];
    for (let i = 0; i < count; i++) {
        // Shuffle the pool and take first 'length' characters
        const shuffled = pool.sort(() => 0.5 - Math.random());
        const result = shuffled.slice(0, length).join('');
        results.push(result);
    }
    
    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    results.forEach(result => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'result-item';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = result;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Salin';
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(result).then(() => {
                alert('Disalin ke clipboard!');
            });
        });
        
        itemDiv.appendChild(textSpan);
        itemDiv.appendChild(copyBtn);
        resultsDiv.appendChild(itemDiv);
    });
    
    document.getElementById('copy-all').style.display = 'block';
}

document.getElementById('copy-all').addEventListener('click', function() {
    const results = Array.from(document.querySelectorAll('#results .result-item span')).map(span => span.textContent).join('\n');
    navigator.clipboard.writeText(results).then(() => {
        alert('Semua hasil disalin ke clipboard!');
    });
});
