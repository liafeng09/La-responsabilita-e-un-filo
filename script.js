// Video Player with better streaming support
const player = document.getElementById('videoPlayer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Hide loading indicator when video starts playing
player.addEventListener('play', () => {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
});

// Show loading indicator when buffering
player.addEventListener('waiting', () => {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
});

// Hide loading indicator when buffering is done
player.addEventListener('canplay', () => {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            if (player.paused) {
                player.play();
            } else {
                player.pause();
            }
            break;
        case 'KeyF':
            e.preventDefault();
            if (!document.fullscreenElement) {
                player.requestFullscreen().catch(err => {
                    console.error(`Error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
            break;
        case 'KeyM':
            e.preventDefault();
            player.muted = !player.muted;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.currentTime -= 5;
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.currentTime += 5;
            break;
    }
});
