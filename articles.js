document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");
    const categoryFilter = document.getElementById("category-filter");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let articles = []; // Tous les articles
    let filteredArticles = []; // Articles après filtrage par catégorie
    let currentPage = 1;
    const articlesPerPage = 3;

    // Charger les articles depuis le fichier JSON
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            articles = data;
            filteredArticles = data;
            renderPage();
        })
        .catch(error => {
            articlesContainer.innerHTML = "<p>Impossible de charger les articles.</p>";
            console.error("Erreur de chargement des articles :", error);
        });

    // Afficher une page donnée
    function renderPage() {
        articlesContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToDisplay = filteredArticles.slice(startIndex, endIndex);

        if (articlesToDisplay.length === 0) {
            articlesContainer.innerHTML = "<p>Aucun article trouvé.</p>";
            return;
        }

        articlesToDisplay.forEach(article => {
            const articleElement = document.createElement("article");
            articleElement.classList.add("blog-article");

            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p><strong>Auteur:</strong> ${article.author} | <strong>Date:</strong> ${article.date}</p>
                <img src="${article.image}" alt="${article.title}" />
                <p>${article.content}</p>
            `;

            articlesContainer.appendChild(articleElement);
        });

        // Mettre à jour les boutons de pagination
        pageInfo.textContent = `Page ${currentPage} / ${Math.ceil(filteredArticles.length / articlesPerPage)}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(filteredArticles.length / articlesPerPage);
    }

    // Filtrer les articles par catégorie
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;

        if (selectedCategory === "all") {
            filteredArticles = articles;
        } else {
            filteredArticles = articles.filter(article => article.category === selectedCategory);
        }

        currentPage = 1;
        renderPage();
    });

    // Gestion des boutons de pagination
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(filteredArticles.length / articlesPerPage)) {
            currentPage++;
            renderPage();
        }
    });
});
