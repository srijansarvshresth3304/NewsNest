const datePicker = document.getElementById("datePicker");
const currentDateElement = document.getElementById("currentDate");
const headline = document.getElementById("headline");
const description = document.getElementById("description");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const printBtn = document.getElementById("printBtn"); // Added print button reference
const articleSource = document.getElementById("articleSource");
const articleDate = document.getElementById("articleDate");

// Set today's date as default
const today = new Date();
const todayFormatted = formatDate(today);
datePicker.value = todayFormatted;
datePicker.max = todayFormatted;
currentDateElement.textContent = formatDisplayDate(today);

let articles = [];
let currentIndex = 0;

// Get your free API key from https://newsapi.org/
const apiKey = '93adcb5dfa1049eea78e130e38b66811';

// Format date as YYYY-MM-DD for API
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display (e.g., "May 28, 2023")
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchNews(date) {
    const monthYear = today.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long'
    });
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(monthYear)}&from=${date}&sortBy=publishedAt&apiKey=${apiKey}`;
    
    headline.textContent = "Loading news...";
    description.textContent = "";
    articleSource.textContent = "";
    articleDate.textContent = "";
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            articles = data.articles;
            currentIndex = 0;
            showArticle(currentIndex);
        } else {
            headline.textContent = "No news found";
            description.textContent = "Try searching for a different date";
            articles = [];
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        headline.textContent = "Error loading news";
        description.textContent = "Please check your connection";
    }
}

function showArticle(index) {
    if (articles[index]) {
        const article = articles[index];
        
        headline.textContent = article.title || "No title available";
        
        let content = article.description || article.content || "No content available";
        // Clean up content
        content = content.split('[')[0].trim();
        content = content.replace(/\[\+[0-9]+ chars\]/, '');
        
        // Create newspaper-style content with drop cap
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        let htmlContent = '';
        
        paragraphs.forEach((para, i) => {
            if (i === 0) {
                const firstChar = para.charAt(0);
                const rest = para.slice(1);
                htmlContent += `<p><span class="dropcap">${firstChar}</span>${rest}</p>`;
            } else {
                htmlContent += `<p>${para}</p>`;
            }
        });
        
        description.innerHTML = htmlContent;
        
        // Add source information if available
        if (article.source?.name) {
            articleSource.textContent = `Source: ${article.source.name}`;
        }
        
        // Add published date if available
        if (article.publishedAt) {
            const pubDate = new Date(article.publishedAt);
            articleDate.textContent = `Published: ${formatDisplayDate(pubDate)}`;
        }
    }
}

// Print functionality
printBtn.addEventListener("click", () => {
    if (articles.length === 0) {
        alert("No article to print!");
        return;
    }

    const printContent = `
        <html>
            <head>
                <title>${headline.textContent}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
                    body { font-family: 'Libre Baskerville', serif; padding: 20px; }
                    h1 { font-size: 24px; border-bottom: 1px solid #000; padding-bottom: 10px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .title { font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; }
                    .date { font-style: italic; margin-bottom: 20px; }
                    .dropcap { float: left; font-size: 3em; line-height: 0.8; padding-right: 5px; }
                    .source { font-style: italic; margin-top: 20px; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">THE DAILY CHRONICLE</div>
                    <div class="date">${currentDateElement.textContent}</div>
                </div>
                <h1>${headline.textContent}</h1>
                ${description.innerHTML}
                <div class="source">${articleSource.textContent}</div>
                <div class="date">${articleDate.textContent}</div>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
});

// Existing event listeners
datePicker.addEventListener("change", (e) => {
    const selectedDate = new Date(e.target.value);
    currentDateElement.textContent = formatDisplayDate(selectedDate);
    fetchNews(formatDate(selectedDate));
});

nextBtn.addEventListener("click", () => {
    if (articles.length > 0) {
        currentIndex = (currentIndex + 1) % articles.length;
        showArticle(currentIndex);
    }
});

prevBtn.addEventListener("click", () => {
    if (articles.length > 0) {
        currentIndex = (currentIndex - 1 + articles.length) % articles.length;
        showArticle(currentIndex);
    }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        nextBtn.click();
    } else if (e.key === "ArrowLeft") {
        prevBtn.click();
    }
});

// Load today's news initially
fetchNews(todayFormatted);
