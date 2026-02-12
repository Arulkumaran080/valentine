// Background music loader for index pages (excluded on index3.html)
(function(){
    try {
        const src = 'assets/audio/background-music.mp3';
        const bg = document.createElement('audio');
        bg.id = 'bgMusic';
        bg.src = src;
        bg.loop = true;
        bg.preload = 'auto';
        bg.volume = 0.25;
        // Start unmuted and paused; attempt to autoplay with sound when possible
        bg.muted = false;
        document.body.appendChild(bg);

        // Create a compact top-left play/pause toggle (no center prompt)
        const toggleWrap = document.createElement('div');
        toggleWrap.style.cssText = 'position:fixed;left:12px;top:12px;z-index:11000;';
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'bgSoundToggle';
        toggleBtn.setAttribute('aria-label','Toggle background music');
        // Use simple icon text (play / pause). Keep styles compact and circular.
        toggleBtn.innerHTML = '▶';
        toggleBtn.style.cssText = 'width:44px;height:44px;border-radius:50%;border:none;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;';
        toggleWrap.appendChild(toggleBtn);
        document.body.appendChild(toggleWrap);

        toggleBtn.addEventListener('click', function(){
            if (bg.paused) {
                bg.play().then(()=>{ toggleBtn.innerHTML = '⏸'; }).catch(()=>{ /* ignore */ });
            } else {
                bg.pause();
                toggleBtn.innerHTML = '▶';
            }
        });

        // Persist playback position and playing state across pages.
        const STORAGE_TIME_KEY = 'bgMusicTime';
        const STORAGE_PLAYING_KEY = 'bgMusicPlaying';
        let saveInterval = null;

        function savePosition() {
            try {
                localStorage.setItem(STORAGE_TIME_KEY, String(bg.currentTime || 0));
            } catch (e) { /* ignore */ }
        }

        function setPlayingFlag(isPlaying) {
            try {
                localStorage.setItem(STORAGE_PLAYING_KEY, isPlaying ? '1' : '0');
            } catch (e) { /* ignore */ }
        }

        // Try to autoplay on load; if allowed, update icon to pause. If blocked, remain as play icon.
        function tryPlay() {
            bg.play().then(()=>{
                toggleBtn.innerHTML = '⏸';
                setPlayingFlag(true);
                if (saveInterval) clearInterval(saveInterval);
                saveInterval = setInterval(savePosition, 1000);
            }).catch(()=>{ /* autoplay blocked — keep play icon */ });
        }

        // Resume from saved position if available.
        const savedTime = parseFloat(localStorage.getItem(STORAGE_TIME_KEY) || '0') || 0;
        const savedPlaying = localStorage.getItem(STORAGE_PLAYING_KEY) === '1';

        // Apply saved time after metadata is available
        bg.addEventListener('loadedmetadata', () => {
            if (savedTime && savedTime > 0 && savedTime < bg.duration - 0.5) {
                try { bg.currentTime = savedTime; } catch (e) { /* ignore */ }
            }
            // If last state was playing, attempt to resume playback
            if (savedPlaying) tryPlay();
        });

        // Update saved state when user toggles
        toggleBtn.addEventListener('click', function(){
            if (bg.paused) {
                bg.play().then(()=>{ toggleBtn.innerHTML = '⏸'; setPlayingFlag(true); if (saveInterval) clearInterval(saveInterval); saveInterval = setInterval(savePosition,1000); }).catch(()=>{ /* ignore */ });
            } else {
                bg.pause();
                toggleBtn.innerHTML = '▶';
                setPlayingFlag(false);
                savePosition();
                if (saveInterval) { clearInterval(saveInterval); saveInterval = null; }
            }
        });

        // Save position periodically and before unload
        window.addEventListener('beforeunload', savePosition);
        document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });

        // Run after DOM ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') tryPlay(); else window.addEventListener('DOMContentLoaded', tryPlay);
    } catch (e) { console.error('bg-music init failed', e); }
})();
