window.onload = function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    let originalImage = null;

    function handleImage(imgSource) {
        const img = new Image();
        // 關鍵：解決手機版 Canvas 跨域安全限制
        img.crossOrigin = "anonymous"; 
        
        img.onload = function() {
            originalImage = img;
            // 修正：針對手機視網膜螢幕，確保畫布寬高設定正確
            canvas.width = img.width;
            canvas.height = img.height;
            draw(); 
        };
        img.src = imgSource;
    }

    handleImage('my-pic.jpg');

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => handleImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    });

    function draw() {
        if (!originalImage) return;
        const ev = document.getElementById('ev').value;
        const sat = document.getElementById('sat').value;
        const temp = document.getElementById('temp').value;

        // 清除畫布，準備重新繪製
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 套用濾鏡 (針對手機瀏覽器優化語法)
        ctx.filter = `brightness(${100 + parseInt(ev)}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    }

    // --- 改進點：針對手機觸控優化 ---
    const controls = ['ev', 'sat', 'temp'];
    controls.forEach(id => {
        const el = document.getElementById(id);
        // 同時監聽 input 和 change，確保手機拉桿一動就有反應
        el.addEventListener('input', draw);
        el.addEventListener('change', draw); 
    });

    // 模式按鈕 (針對手機點擊延遲優化)
    document.querySelectorAll('.preset-item').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const preset = e.target.dataset.preset;
            if (preset === 'kodak') {
                updateInputs(10, 140, 10);
            } else if (preset === 'fuji') {
                updateInputs(5, 110, -15);
            } else if (preset === 'bw') {
                updateInputs(0, 0, 0);
            } else {
                updateInputs(0, 100, 0);
            }
            draw();
        });
    });

    function updateInputs(e, s, t) {
        document.getElementById('ev').value = e;
        document.getElementById('sat').value = s;
        document.getElementById('temp').value = t;
    }

    // 儲存圖片 (手機端下載優化)
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-photo-' + Date.now() + '.png';
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link); // 某些手機瀏覽器需要這行
        link.click();
        document.body.removeChild(link);
    });
};
