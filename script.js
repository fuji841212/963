// 使用最保險的啟動方式
console.log("JS 檔案已讀取");

function startApp() {
    console.log("模擬器邏輯啟動中...");
    
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const watermark = document.getElementById('watermark');
    let originalImage = null;

    // 1. 預設圖片載入
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; // 請再次確認檔名!
    
    defaultImg.onload = () => {
        console.log("✅ 預設圖片載入成功");
        originalImage = defaultImg;
        render();
    };

    defaultImg.onerror = () => {
        console.log("❌ 預設圖片載入失敗，請確認倉庫裡是否有 my-pic.jpg");
    };

    // 2. 上傳功能
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    console.log("✅ 使用者圖片載入成功");
                    originalImage = img;
                    render();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

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
        ctx.filter = `brightness(${100 + parseInt(ev)}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        ctx.drawImage(originalImage, 0, 0);
        console.log("🎨 已渲染濾鏡");
    }

    // 3. 監聽拉桿
    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    // 4. 水印
    document.getElementById('toggleWatermark').addEventListener('click', (e) => {
        watermark.classList.toggle('hidden');
        e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
    });

    // 5. 存檔
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 執行
startApp();
