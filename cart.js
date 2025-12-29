/**
 * Shopping Cart JavaScript
 * E-commerce Lab - Cart Feature
 * Currency: Tanzanian Shillings (TSH)
 */

// Cart utility functions
const CartUtils = {
    /**
     * Get cart from localStorage
     * @returns {Array} Array of cart items
     */
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    /**
     * Save cart to localStorage
     * @param {Array} cart - Array of cart items
     */
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartBadge();
    },

    /**
     * Add item to cart
     * @param {Object} product - Product object with id, name, price, image
     * @returns {Object} Updated cart
     */
    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart(cart);
        return cart;
    },

    /**
     * Remove item from cart
     * @param {String} productId - Product ID to remove
     */
    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },

    /**
     * Update item quantity
     * @param {String} productId - Product ID
     * @param {Number} quantity - New quantity
     */
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },

    /**
     * Clear entire cart
     */
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartBadge();
    },

    /**
     * Get total number of items in cart
     * @returns {Number} Total item count
     */
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Calculate cart subtotal
     * @returns {Number} Subtotal amount
     */
    getCartSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * Calculate cart total with tax and shipping
     * @returns {Object} Object with subtotal, tax, shipping, and total
     */
    getCartTotal() {
        const subtotal = this.getCartSubtotal();
        const tax = subtotal * 0.18; // 18% VAT
        const shipping = subtotal > 0 ? 5000 : 0; // TSH 5,000 flat shipping
        const total = subtotal + tax + shipping;

        return {
            subtotal,
            tax,
            shipping,
            total
        };
    },

    /**
     * Format currency in TSH
     * @param {Number} amount - Amount to format
     * @returns {String} Formatted currency string
     */
    formatCurrency(amount) {
        return `TSH ${Math.round(amount).toLocaleString('en-US')}`;
    },

    /**
     * Update cart badge/counter in navigation
     */
    updateCartBadge() {
        const count = this.getCartCount();
        const cartLinks = document.querySelectorAll('a[href="cart.html"]');
        
        cartLinks.forEach(link => {
            // Remove existing badge if present
            const existingBadge = link.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add new badge if count > 0
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = count;
                badge.style.cssText = `
                    background-color: #dc3545;
                    color: white;
                    border-radius: 50%;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 5px;
                    display: inline-block;
                    min-width: 20px;
                    text-align: center;
                `;
                link.appendChild(badge);
            }
        });
    },

    /**
     * Show notification message
     * @param {String} message - Message to display
     * @param {String} type - Type of notification (success, error, info)
     */
    showNotification(message, type = 'success') {
        let notification = document.getElementById('cartNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cartNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                display: none;
                font-weight: bold;
            `;
            document.body.appendChild(notification);
        }

        // Set notification color based on type
        const colors = {
            success: '#4CAF50',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.success;
        notification.style.color = 'white';
        notification.textContent = message;
        notification.style.display = 'block';

        // Animate in
        notification.style.animation = 'slideIn 0.3s ease-out';

        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }
};

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
    CartUtils.updateCartBadge();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartUtils;
}
