/* Moduł zarządzania motywem aplikacji */
/* Obsługuje przełączanie między trybem jasnym i ciemnym */

import { getSavedTheme, saveTheme } from './storage.js';

let themeToggleButton = null;

/* Inicjalizowanie modułu motywu */
/* @param {HTMLElement} toggleButton - Przycisk przełączania motywu */
export function initTheme(toggleButton){
    themeToggleButton = toggleButton;
    
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    
    if(themeToggleButton){
        themeToggleButton.addEventListener('click', toggleTheme);
    }
    
    console.log(`Theme initialized to: ${savedTheme}`);
}

/* Aplikowanie wybranego motywu do dokumentu */
/* @param {string} theme - 'light' lub 'dark' */
export function applyTheme(theme){
    if(theme === 'light'){
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeButton('☀️', 'Przełącz na motyw ciemny');
    } 
    else{
        document.documentElement.removeAttribute('data-theme');
        updateThemeButton('🌙', 'Przełącz na motyw jasny');
    }

    saveTheme(theme);
}

/* Przełączanie między motywem jasnym i ciemnym */
export function toggleTheme(){
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    
    console.log(`Theme changed to: ${newTheme}`);
}

/* Aktualizowanie ikony i aria-label przycisku motywu */
/* @param {string} icon - Emoji ikony */
/* @param {string} ariaLabel - Tekst dla czytników ekranu */
function updateThemeButton(icon, ariaLabel){
    if(themeToggleButton){
        const iconElement = themeToggleButton.querySelector('.theme-icon');
        if (iconElement){
            iconElement.textContent = icon;
        }
        themeToggleButton.setAttribute('aria-label', ariaLabel);
    }
}

/* Pobieranie aktualnego motywu */
/* @returns {string} 'light' lub 'dark' */
export function getCurrentTheme(){
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}