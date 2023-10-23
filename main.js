'use strict';

import { baseUrl } from './variables.js';
import { fetchData } from './utils.js';
import { restaurantRow, restaurantModal } from './component.js';

let restaurants = [];
const table = document.querySelector('table tbody');
const dialog = document.querySelector('dialog');
const companyFilter = document.getElementById('company-filter');

const renderRestaurants = (restaurantsToRender) => {
    table.innerHTML = '';
    restaurantsToRender.forEach(restaurant => {
        const row = restaurantRow(restaurant);
        table.appendChild(row);

        row.addEventListener('click', async () => {
            await createModal(restaurant);
            dialog.showModal();
        });
    });
};

const getData = async () => {
    try {
        const url = `${baseUrl}restaurants`;
        restaurants = await fetchData(url);
        renderRestaurants(restaurants);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const createModal = async (restaurant) => {
    dialog.innerHTML = '';

    try {
        const menuUrl = `${baseUrl}restaurants/daily/${restaurant._id}/fi`;
        const menu = await fetchData(menuUrl);
        const modalContent = restaurantModal(restaurant, menu);
        dialog.innerHTML = modalContent;

        const closeButton = dialog.querySelector('#close-button');
        closeButton.addEventListener('click', () => {
            dialog.close();
        });

        window.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        dialog.innerHTML = '<p>Failed to load menu. Please try again later.</p>';
    }
};

companyFilter.addEventListener('change', () => {
    const selectedCompany = companyFilter.value;
    const filteredRestaurants = selectedCompany === 'all'
        ? restaurants
        : restaurants.filter(restaurant => restaurant.company.trim().toLowerCase() === selectedCompany.toLowerCase());
    renderRestaurants(filteredRestaurants);
});

getData();
