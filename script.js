// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const player = document.getElementById('videoPlayer');
    
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
