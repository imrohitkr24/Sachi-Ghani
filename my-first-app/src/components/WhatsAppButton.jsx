import React from 'react';

const WhatsAppButton = () => {
    const phoneNumber = '918406831332';
    const message = 'Hello! I would like to know more about Sachi Ghani products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            aria-label="Chat on WhatsApp"
        >
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
            >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.913.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-2.846-.828-.307-.126-1.577-1.015-3.058-2.508-1.536-1.547-1.89-2.586-2.035-2.93-.207-.487-.197-1.125.106-1.423.238-.235.539-.327.816-.327.352 0 .616.185.748.435.158.3.541 1.341.591 1.441.05.099.083.215-.015.414-.099.198-.184.282-.365.498-.182.217-.383.284-.167.649.467.79 1.135 1.543 2.176 1.996.347.151.64.085.876-.148.235-.232.559-.693.708-.942.149-.249.298-.199.546-.1.249.099 1.578.745 1.826.894.249.149.414.232.48.331.066.1.066.579-.078.983zM12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10S6.486 2 12 2zm0 2h-.005C6.471 4 2 8.471 2 14c0 1.957.567 3.774 1.535 5.289l-1.085 3.961 4.102-1.076C8.077 23.333 9.947 24 12 24c5.514 0 10-4.486 10-10S17.514 4 12 4z" />
            </svg>
        </a>
    );
};

export default WhatsAppButton;
