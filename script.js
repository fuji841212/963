// 確保網頁所有內容都讀取完才開始執行
window.addEventListener('load', function() {
    console.log("模擬器已啟動");

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const watermark = document.getElementById('watermark');
    let originalImage = null;

    // --- 1. 自動載入預設圖片 ---
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; // ⚠️ 檢查 GitHub 上的檔名是否完全一致
    defaultImg.onload = () => {
        originalImage = defaultImg;
        initCanvas();
    };

    // --- 2. 使用者上傳圖片處理 ---
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                initCanvas();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // --- 3. 初始化畫布大小 ---
    function initCanvas() {
        if (!originalImage) return;
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        applyFilters();
    }

    // --- 4. 濾鏡核心計算 (EV, SAT, TEMP) ---
    function applyFilters() {
        if (!originalImage) return;

        const ev = document.getElementById('ev').value;
        const sat = document.getElementById('sat').value;
        const temp = document.getElementById('temp').value;

        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 套用複合濾鏡：亮度(EV)、飽和度(SAT)、冷暖(TEMP)
        // 使用 hue-rotate 近似處理冷暖色調
        ctx.filter = `
            brightness(${100 + parseInt(ev)}%) 
            saturate(${sat}%) 
            hue-rotate(${temp}deg)
            contrast(105%)
        `;
        
        ctx.drawImage(originalImage, 0, 0);
    }

    // --- 5. 監聽拉桿變化 ---
    const controls = ['ev', 'sat', 'temp'];
    controls.forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    // --- 6. 水印按鈕控制 ---
    const toggleWatermark = document.getElementById('toggleWatermark');
    if (toggleWatermark) {
        toggleWatermark.addEventListener('click', (e) => {
            watermark.classList.toggle('hidden');
            e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
        });
    }

    // --- 7. 儲存圖片功能 ---
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-photo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
