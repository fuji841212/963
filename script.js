// 確保所有程式碼在網頁載入完成後才執行
window.onload = function() {
    console.log("網頁載入完成，啟動模擬器...");

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const watermark = document.getElementById('watermark');
    let originalImage = null;

    // 1. 自動載入預設圖片
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; 
    defaultImg.onload = () => {
        originalImage = defaultImg;
        resizeAndDraw();
    };

    // 2. 使用者上傳處理
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                resizeAndDraw();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 3. 調整畫布大小並繪製
    function resizeAndDraw() {
        if (!originalImage) return;
        // 讓畫布跟隨圖片大小，但在螢幕上不超過視窗寬度
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        applyFilters();
    }

    // 4. 濾鏡核心邏輯
    function applyFilters() {
        if (!originalImage) return;

        const ev = document.getElementById('ev')?.value || 0;
        const sat = document.getElementById('sat')?.value || 100;
        const temp = document.getElementById('temp')?.value || 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 套用濾鏡
        ctx.filter = `
            brightness(${100 + parseInt(ev)}%) 
            saturate(${sat}%) 
            hue-rotate(${temp}deg)
            contrast(110%)
        `;
        
        ctx.drawImage(originalImage, 0, 0);
        console.log("濾鏡套用成功: EV:", ev, "SAT:", sat, "TEMP:", temp);
    }

    // 5. 監聽所有拉桿 (確保在畫布渲染後也能運作)
    const inputs = document.querySelectorAll('input[type=range]');
    inputs.forEach(input => {
        input.addEventListener('input', applyFilters);
    });

    // 6. 水印開關
    const toggleBtn = document.getElementById('toggleWatermark');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            watermark.classList.toggle('hidden');
            e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
        });
    }

    // 7. 儲存圖片
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};
