/* Aktualizuje licznik ciekawostek */
export function updateFactsCounter(counterElement, label) {
    if (!counterElement) return;
    counterElement.textContent = label;
}
/* Moduł renderowania elementów DOM */
/* Odpowiada za tworzenie i wyświetlanie elementów HTML */

/* Tworzenie HTML dla karty ciekawostki */
/* @param {Object} fact - Obiekt ciekawostki */
/* @returns {string} HTML string */
export function createFactCard(fact){
    const userBadge = fact.userAdded 
        ? '<span class="user-badge">Dodane przez Ciebie</span>' 
        : '';

    const deleteButton = fact.userAdded
        ? `<button class="btn-delete" data-id="${fact.id}" title="Usuń ciekawostkę">
              <span class="delete-icon">🗑️</span>
           </button>`
        : '';

    return `
        <article class="fact-card ${fact.userAdded ? 'user-fact' : ''}" data-fact-id="${fact.id}">
            ${deleteButton}
            <div class="fact-header">
                <span class="fact-category" data-category="${fact.category}">${fact.category}</span>
                <span class="fact-date">${fact.date}</span>
            </div>
            ${userBadge}
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-description">${fact.description}</p>
            <div class="fact-footer">
                <button class="btn-read-more" data-id="${fact.id}">Czytaj więcej</button>
            </div>
            <p class="fact-source">${fact.source}</p>
        </article>
    `;
}

/* Renderowanie listy ciekawostek w kontenerze */
/* @param {HTMLElement} container - Kontener na ciekawostki */
/* @param {Array} facts - Tablica ciekawostek do wyrenderowania */
export function renderFacts(container, facts){
    if(!container){
        console.error('Container element not found');
        return;
    }

    // Zachowanie nagłówka sekcji
    const heading = container.querySelector('h2');
    
    container.innerHTML = '';
    
    if(heading){
        container.appendChild(heading);
    }

    if(facts.length === 0){
        renderEmptyState(container);
        return;
    }

    facts.forEach(fact => {
        const cardHTML = createFactCard(fact);
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    console.log(`Rendered ${facts.length} facts.`);
}

/* Renderuje stan pusty (brak ciekawostek) */
/* @param {HTMLElement} container - Kontener */
function renderEmptyState(container){
    const emptyMessage = document.createElement('p');
    emptyMessage.style.color = '#ccc';
    emptyMessage.textContent = 'Brak ciekawostek do wyświetlenia.';
    container.appendChild(emptyMessage);
}

/* Aktualizowanie informacji o wynikach wyszukiwania */
/* @param {HTMLElement} infoElement - Element z informacją */
/* @param {number} count - Liczba znalezionych ciekawostek */
/* @param {string} searchQuery - Zapytanie wyszukiwania */
/* @param {string} currentFilter - Aktualny filtr kategorii */
export function updateSearchInfo(infoElement, count, searchQuery, currentFilter){
    if(!infoElement) return;

    if(searchQuery.trim() !== '' || currentFilter !== 'all'){
        infoElement.textContent = `Znaleziono ${count} ciekawostek.`;
    } 
    else{
        infoElement.textContent = '';
    }
}

/* Pokazywanie komunikatu formularza */
/* @param {HTMLElement} messageElement - Element na komunikat */
/* @param {string} message - Treść komunikatu */
/* @param {string} type - Typ: 'success' lub 'error' */
/* @param {number} duration - Czas wyświetlania w ms (domyślnie 5000)*/
export function showFormMessage(messageElement, message, type = 'success', duration = 5000){
    if(!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, duration);
}

/* Aktualizowanie licznika znaków w polu formularza */
/* @param {HTMLInputElement} input - Pole input/textarea */
export function updateCharCount(input){
    if (!input) return;

    const maxLength = input.getAttribute('maxlength');
    const currentLength = input.value.length;
    const counter = input.parentElement.querySelector('.char-count');
    
    if(counter && maxLength){
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if(currentLength > maxLength * 0.9){
            counter.style.color = '#ef4444';
        } 
        else if(currentLength > maxLength * 0.7){
            counter.style.color = '#f59e0b';
        } 
        else{
            counter.style.color = '#9ca3af';
        }
    }
}

/* Animowanie usunięcia karty ciekawostki */
/* @param {HTMLElement} card - Element karty do usunięcia */
/* @param {Function} callback - Funkcja wywoływana po animacji */
export function animateCardRemoval(card, callback){
    if (!card) return;

    card.classList.add('removing');
    
    setTimeout(() => {
        if (callback) callback();
    }, 300);
}