// 強制在控制台印出訊息，確認檔案有讀取
console.log("--- 程式檔案已成功讀取 ---");

const startSimulator = () => {
    console.log("--- 模擬器邏輯啟動 ---");

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const watermark = document.getElementById('watermark');
    let originalImage = null;

    // 1. 預設圖片載入
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; // 請確保 GitHub 倉庫裡有這張圖
    
    defaultImg.onload = () => {
        console.log("✅ 預設圖片載入成功");
        originalImage = defaultImg;
        render();
    };

    defaultImg.onerror = () => {
        console.log("❌ 預設圖片載入失敗，請確認檔名是否正確");
    };

    // 2. 渲染與濾鏡
    function render() {
        if (!originalImage) return;
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
        
        // 套用濾鏡
        ctx.filter = `
            brightness(${100 + parseInt(ev)}%) 
            saturate(${sat}%) 
            hue-rotate(${temp}deg)
            contrast(110%)
        `;
        
        ctx.drawImage(originalImage, 0, 0);
        console.log("🎨 畫面已更新");
    }

    // 3. 事件監聽
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    render();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    document.getElementById('toggleWatermark').addEventListener('click', (e) => {
        watermark.classList.toggle('hidden');
        e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};

// 確保 HTML 跑完才執行 JS
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSimulator);
} else {
    startSimulator();
}
