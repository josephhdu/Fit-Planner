document.addEventListener('DOMContentLoaded', function() {
    const splash = document.querySelector('.splash');

    setTimeout(() => {
        splash.style.opacity = '0';
    }, 3000); // Display splash screen for 3 seconds

    splash.addEventListener('transitionend', () => {
        splash.classList.add('display-none');
        document.getElementById("main-content").classList.remove("hidden");
    });
});


