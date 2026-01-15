// Video Player Application
class VideoPlayer {
    constructor() {
        this.player = document.getElementById('videoPlayer');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.urlInput = document.getElementById('urlInput');
        this.loadUrlBtn = document.getElementById('loadUrlBtn');
        this.playlist = document.getElementById('playlist');
        this.videoTitle = document.getElementById('videoTitle');
        this.videoDescription = document.getElementById('videoDescription');
        
        this.videos = [];
        this.currentVideoIndex = -1;
        
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
        
        // URL loading
        this.loadUrlBtn.addEventListener('click', () => this.loadFromUrl());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadFromUrl();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Video events
        this.player.addEventListener('ended', () => this.playNext());
    }

    handleFileSelect(event) {
        const files = event.target.files;
        for (let file of files) {
            this.addVideo(file);
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
        for (let file of files) {
            if (file.type.startsWith('video/')) {
                this.addVideo(file);
            }
        }
    }

    addVideo(file) {
        const videoUrl = URL.createObjectURL(file);
        const videoData = {
            id: Date.now() + Math.random(),
            name: file.name,
            url: videoUrl,
            type: file.type,
            size: this.formatFileSize(file.size)
        };
        
        this.videos.push(videoData);
        this.updatePlaylist();
        
        // Auto-play if it's the first video
        if (this.videos.length === 1) {
            this.playVideo(0);
        }
    }

    loadFromUrl() {
        const url = this.urlInput.value.trim();
        if (!url) {
            alert('请输入有效的视频链接');
            return;
        }
        
        // Validate URL format
        try {
            new URL(url);
        } catch {
            alert('请输入有效的URL');
            return;
        }
        
        const videoData = {
            id: Date.now() + Math.random(),
            name: url.split('/').pop() || '在线视频',
            url: url,
            type: this.getVideoTypeFromUrl(url),
            size: '在线'
        };
        
        this.videos.push(videoData);
        this.updatePlaylist();
        this.urlInput.value = '';
        
        if (this.videos.length === 1) {
            this.playVideo(0);
        }
    }

    getVideoTypeFromUrl(url) {
        const ext = url.split('.').pop().toLowerCase();
        const types = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime'
        };
        return types[ext] || 'video/mp4';
    }

    playVideo(index) {
        if (index < 0 || index >= this.videos.length) return;
        
        this.currentVideoIndex = index;
        const video = this.videos[index];
        
        // Update video player
        this.player.src = video.url;
        this.player.type = video.type;
        this.player.play();
        
        // Update video info
        this.videoTitle.textContent = video.name;
        this.videoDescription.textContent = `大小: ${video.size} | 格式: ${video.type}`;
        
        // Update playlist
        this.updatePlaylist();
    }

    playNext() {
        if (this.currentVideoIndex < this.videos.length - 1) {
            this.playVideo(this.currentVideoIndex + 1);
        }
    }

    updatePlaylist() {
        if (this.videos.length === 0) {
            this.playlist.innerHTML = '<li class="empty-message">暂无视频</li>';
            return;
        }
        
        this.playlist.innerHTML = this.videos.map((video, index) => `
            <li class="${index === this.currentVideoIndex ? 'active' : ''}" onclick="videoPlayer.playVideo(${index})">
                <span class="video-item-name">${video.name}</span>
                <button class="remove-btn" onclick="event.stopPropagation(); videoPlayer.removeVideo(${index})">删除</button>
            </li>
        `).join('');
    }

    removeVideo(index) {
        this.videos.splice(index, 1);
        
        if (index === this.currentVideoIndex) {
            if (this.videos.length > 0) {
                this.playVideo(Math.min(index, this.videos.length - 1));
            } else {
                this.player.src = '';
                this.videoTitle.textContent = '选择一个视频开始播放';
                this.videoDescription.textContent = '没有选择视频';
                this.currentVideoIndex = -1;
            }
        }
        
        this.updatePlaylist();
    }

    handleKeyboard(event) {
        if (event.target === this.urlInput) return;
        
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
                console.error(`错误: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

// Preset videos
function loadPresetVideo(presetName) {
    const presetVideos = {
        sample1: {
            name: '示例视频 1 - 海洋生物',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
            type: 'video/mp4'
        },
        sample2: {
            name: '示例视频 2 - 风景',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
            type: 'video/mp4'
        }
    };
    
    if (presetVideos[presetName]) {
        const video = presetVideos[presetName];
        videoPlayer.videos.push({
            id: Date.now(),
            name: video.name,
            url: video.url,
            type: video.type,
            size: '在线'
        });
        videoPlayer.updatePlaylist();
        videoPlayer.playVideo(videoPlayer.videos.length - 1);
    }
}

// Initialize
let videoPlayer;
document.addEventListener('DOMContentLoaded', () => {
    videoPlayer = new VideoPlayer();
    
    // Load the default video
    const defaultVideo = {
        id: Date.now(),
        name: 'La responsabilità è un filo V.mp4',
        url: 'La responsabilità è un filo V.mp4',
        type: 'video/mp4',
        size: '默认视频'
    };
    videoPlayer.videos.push(defaultVideo);
    videoPlayer.updatePlaylist();
    videoPlayer.playVideo(0);
});
