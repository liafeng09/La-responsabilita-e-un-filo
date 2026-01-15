// Simple Video Player
class SimpleVideoPlayer {
    constructor() {
        this.player = document.getElementById('videoPlayer');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Upload area events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.playFile(files[0]);
        }
        this.fileInput.value = '';
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            for (let file of files) {
                if (file.type.startsWith('video/')) {
                    this.playFile(file);
                    break;
                }
            }
        }
    }

    playFile(file) {
        const videoUrl = URL.createObjectURL(file);
        this.player.src = videoUrl;
        this.player.play();
    }

    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (this.player.paused) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
                break;
            case 'KeyF':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyM':
                event.preventDefault();
                this.player.muted = !this.player.muted;
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.player.currentTime -= 5;
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.player.currentTime += 5;
                break;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.player.requestFullscreen().catch(err => {
                console.error(`Error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize
let videoPlayer;
document.addEventListener('DOMContentLoaded', () => {
    videoPlayer = new SimpleVideoPlayer();
});
