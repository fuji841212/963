window.onload = function() {
    console.log("🚀 模擬器核心已啟動");

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const watermark = document.getElementById('watermark');
    let originalImage = null;

    // --- 這裡是最重要的地方：請確認檔名！ ---
    const imgName = 'my-pic.jpg'; 
    // -------------------------------------

    const defaultImg = new Image();
    defaultImg.src = imgName;

    defaultImg.onload = () => {
        console.log("✅ 成功抓到圖片：" + imgName);
        originalImage = defaultImg;
        render();
    };

    defaultImg.onerror = () => {
        console.error("❌ 找不到圖片！請檢查：");
        console.error("1. GitHub 上是否有一個檔案叫 " + imgName);
        console.error("2. 大小寫是否完全一致（.jpg 還是 .JPG？）");
    };

    function render() {
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        applyFilters();
    }

    function applyFilters() {
        if (!originalImage) return;
        const ev = document.getElementById('ev').value;
        const sat = document.getElementById('sat').value;
        const temp = document.getElementById('temp').value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = `brightness(${100 + parseInt(ev)}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        ctx.drawImage(originalImage, 0, 0);
        console.log("🎨 畫面已渲染");
    }

    // 監聽拉桿
    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    // 水印
    document.getElementById('toggleWatermark').addEventListener('click', (e) => {
        watermark.classList.toggle('hidden');
        e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
    });

    // 存檔
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'my-retro-photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};
