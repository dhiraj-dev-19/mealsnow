document.addEventListener('DOMContentLoaded', function () {
    const messesList = document.getElementById('messesList');
    const dayFilter = document.getElementById('dayFilter');
    const mealFilter = document.getElementById('mealFilter');
    const API_URL = 'http://localhost/mealsnow/api';

    // Fetch messes and menus
    async function fetchMessesWithMenus() {
        try {
            const response = await fetch(`${API_URL}/get_messes_with_menus.php`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched data:", data); // Log fetched data
            renderMesses(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Render messes and menus
    function renderMesses(messes) {
        messesList.innerHTML = ''; // Clear existing content

        const selectedDay = dayFilter.value; // Get selected day
        const selectedMeal = mealFilter.value; // Get selected meal type

        messes.forEach(mess => {
            const messCard = document.createElement('div');
            messCard.className = 'messCard';

            // Filter menus based on selected day and meal type
            const filteredMenus = mess.menus.filter(menu => {
                const matchesDay = selectedDay === 'all' || menu.day === selectedDay;
                const matchesMeal = selectedMeal === 'all' || menu.meal_type === selectedMeal;
                return matchesDay && matchesMeal;
            });

            // Log filtered menus
            console.log("Filtered menus for mess:", mess.name, filteredMenus);

            // Mess details
            messCard.innerHTML = `
                <h3>${mess.name}</h3>
                <p><strong>Location:</strong> ${mess.location}</p>
                <div class="menus">
                    <h4>Menus:</h4>
                    ${filteredMenus.map(menu => `
                        <div class="menu">
                            <p><strong>Day:</strong> ${menu.day}</p>
                            <p><strong>Meal Type:</strong> ${menu.meal_type}</p>
                            <p><strong>Items:</strong> ${menu.items}</p> <!-- Display as string -->
                        </div>
                    `).join('')}
                </div>
            `;

            // Log rendered mess card
            console.log("Rendered mess card:", messCard.innerHTML);

            messesList.appendChild(messCard);
        });
    }

    // Add event listeners for filters
    dayFilter.addEventListener('change', () => {
        fetchMessesWithMenus();
    });

    mealFilter.addEventListener('change', () => {
        fetchMessesWithMenus();
    });

    // Initial fetch and render
    fetchMessesWithMenus();
});