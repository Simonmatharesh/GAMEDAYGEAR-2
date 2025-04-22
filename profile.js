// Function to fetch user's orders from the server
async function fetchUserOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/orders/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('ordersList').innerHTML = `
            <div class="no-orders">
                <p>No orders found or error loading orders.</p>
            </div>
        `;
    }
}

// Function to display orders in the profile page
function displayOrders(orders) {
    const ordersListElement = document.getElementById('ordersList');
    
    if (!orders || orders.length === 0) {
        ordersListElement.innerHTML = `
            <div class="no-orders">
                <p>No orders found.</p>
            </div>
        `;
        return;
    }

    const ordersHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-date">${new Date(order.orderDate).toLocaleDateString()}</span>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.productName}" class="item-image">
                        <div class="item-details">
                            <h4>${item.productName}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: £${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total">Total: £${order.totalAmount.toFixed(2)}</span>
                <span class="shipping-address">Shipping to: ${order.shippingAddress}</span>
            </div>
        </div>
    `).join('');

    ordersListElement.innerHTML = ordersHTML;
}

// Function to load user profile data
function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userName').textContent = userData.name || 'N/A';
        document.getElementById('userName1').textContent = userData.name || 'N/A';
        document.getElementById('userEmail').textContent = userData.email || 'N/A';
        document.getElementById('userEmail1').textContent = userData.email || 'N/A';
        document.getElementById('userPhone').textContent = userData.phone || 'N/A';
        document.getElementById('userAddress').textContent = userData.address || 'N/A';
    } else {
        window.location.href = 'login.html';
    }
}

// Event listener for logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
});

// Load user profile when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    fetchUserOrders();
});
