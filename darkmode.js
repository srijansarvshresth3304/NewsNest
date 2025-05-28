// Dark Mode Toggle with Newspaper-Style Dark Theme
document.addEventListener('DOMContentLoaded', function() {
    // Create toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.title = 'Toggle Dark Mode';
    darkModeToggle.innerHTML = '🌓';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #8b0000;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    // Add button to body
    document.body.appendChild(darkModeToggle);

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        enableDarkMode();
    }

    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Dark mode styles
    const darkModeStyles = `
        .dark-mode {
            --paper-color: #1a1a1a;
            --ink-color: #e0e0e0;
            --accent-color: #c62828;
            --highlight-color: #e53935;
            background-color: #121212;
        }

        .dark-mode .newspaper-container {
            background: #1e1e1e;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            border-color: #333;
        }

        .dark-mode .news-card {
            background-color: #2d2d2d;
            border-color: #444;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><rect fill="none" stroke="gray" stroke-width="2" x="0" y="0" width="100" height="100" /></svg>');
        }

        .dark-mode #headline {
            color: #f5f5f5;
            border-bottom-color: var(--accent-color);
        }

        .dark-mode #description {
            color: #e0e0e0;
        }

        .dark-mode .newspaper-header {
            border-bottom-color: var(--accent-color);
        }

        .dark-mode .current-date {
            color: var(--accent-color);
        }

        .dark-mode #datePicker {
            background-color: #333;
            color: #fff;
            border-color: #555;
        }

        .dark-mode button {
            background: var(--accent-color);
        }

        .dark-mode button:hover {
            background: var(--highlight-color);
        }

        .dark-mode .breaking-news {
            background: linear-gradient(to right, #8b0000, #6d0000);
        }

        .dark-mode .article-footer {
            border-top-color: #444;
            color: #aaa;
        }

        .dark-mode .newspaper-footer {
            border-top-color: #444;
            color: #777;
        }

        .dark-mode .dropcap {
            color: var(--accent-color);
        }

        .dark-mode .weather-widget {
            background: rgba(30,30,30,0.7);
            border-color: #444;
        }
    `;

    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.id = 'darkModeStyles';
    styleElement.textContent = darkModeStyles;
    document.head.appendChild(styleElement);

    // Dark mode functions
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '☀️';
        darkModeToggle.style.background = '#333';
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '🌓';
        darkModeToggle.style.background = '#8b0000';
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
});