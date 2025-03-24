document.addEventListener("DOMContentLoaded", function () {
    const messSelect = document.getElementById("mess-select");
    const menuList = document.getElementById("menu-list");
    const messList = document.getElementById("mess-list");
    const addMenuForm = document.getElementById("add-menu-form");
    const addMessForm = document.getElementById("add-mess-form");
    
    // Update API URL to match your PHP backend
    const API_URL = 'http://localhost/mealsnow/api';

    // Fetch and populate mess list
    function loadMesses() {
        fetch(`${API_URL}/get_messes_with_menus.php`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                messSelect.innerHTML = '<option value="" disabled selected>Select a Mess</option>';
                messList.innerHTML = "";
                data.forEach(mess => {
                    // Populate mess dropdown
                    const option = document.createElement("option");
                    option.value = mess.id; // Use 'id' instead of '_id'
                    option.textContent = mess.name;
                    messSelect.appendChild(option);

                    // Populate mess list
                    const li = document.createElement("li");
                    li.textContent = `${mess.name} - ${mess.location}`;
                    messList.appendChild(li);
                });
            })
            .catch(error => console.error("Error loading messes:", error));
    }

    // Fetch and populate menu list
    function loadMenus() {
        fetch(`${API_URL}/get_messes_with_menus.php`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                menuList.innerHTML = "";
                data.forEach(mess => {
                    mess.menus.forEach(menu => {
                        const li = document.createElement("li");
                        li.textContent = `${mess.name} - ${menu.day} (${menu.meal_type}): ${menu.items}`;
                        menuList.appendChild(li);
                    });
                });
            })
            .catch(error => console.error("Error loading menus:", error));
    }

    // Add/update menu
    addMenuForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const messId = messSelect.value;
        const day = document.getElementById("menu-day").value;
        const mealType = document.getElementById("meal-type").value;
        
        // Get items as a comma-separated string
        const items = document.getElementById("menu-items").value;

        // Basic client-side validation
        if (!messId || !day || !mealType || !items) {
            alert("Please fill all required fields");
            return;
        }

        fetch(`${API_URL}/add_menu.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                messId: messId, 
                day: day, 
                mealType: mealType, 
                items: items // Send as string
            })
        })
        .then(async response => {
            const text = await response.text();
            try {
                const data = JSON.parse(text); // Try parsing JSON
                if (!response.ok) throw new Error(data.message || 'Failed to add menu');
                return data;
            } catch (e) {
                throw new Error(text); // Show raw error if JSON parsing fails
            }
        })
        .then(() => {
            loadMenus();
            addMenuForm.reset();
            alert("Menu added successfully!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
        });
    });

    // Add new mess
    addMessForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("mess-name").value;
        const location = document.getElementById("mess-location").value;

        fetch(`${API_URL}/add_mess.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add mess');
            return response.json();
        })
        .then(() => {
            loadMesses();
            addMessForm.reset();
        })
        .catch(error => console.error("Error adding mess:", error));
    });

    // Initial load
    loadMesses();
    loadMenus();
});