// ==========================================
// 1. 初始化元件
// ==========================================
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const watermark = document.getElementById('watermark');
let originalImage = null;

// ==========================================
// 2. 自動載入預設圖片 (網頁打開時執行)
// ==========================================
const defaultImg = new Image();
defaultImg.src = 'my-pic.jpg'; // ⚠️ 請確認你的圖片檔名真的是 my-pic.jpg

defaultImg.onload = () => {
    console.log("預設圖片載入成功");
    originalImage = defaultImg;
    canvas.width = defaultImg.width;
    canvas.height = defaultImg.height;
    applyFilters(); 
};

defaultImg.onerror = () => {
    console.log("找不到預設圖片，請檢查檔名或路徑。");
};

// ==========================================
// 3. 使用者自行上傳圖片處理
// ==========================================
imageUpload.addEventListener('change', (e) => {
    console.log("偵測到使用者選取檔案");
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        console.log("檔案讀取完成，準備建立圖片物件");
        const img = new Image();
        img.onload = () => {
            console.log("圖片物件建立成功，寬度:", img.width, "高度:", img.height);
            originalImage = img;
            // 根據圖片大小調整畫布，避免拉伸
            canvas.width = img.width;
            canvas.height = img.height;
            applyFilters();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// ==========================================
// 4. 濾鏡應用邏輯
// ==========================================
function applyFilters() {
    if (!originalImage) {
        console.log("尚未載入任何圖片，無法套用濾鏡");
        return;
    }

    const ev = document.getElementById('ev').value;
    const sat = document.getElementById('sat').value;
    const temp = document.getElementById('temp').value;

    // 清除畫布並套用濾鏡
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // CSS Filter 語法：亮度、飽和度、色相、對比度
    ctx.filter = `
        brightness(${100 + parseInt(ev)}%) 
        saturate(${sat}%) 
        hue-rotate(${temp}deg)
        contrast(110%)
    `;
    
    ctx.drawImage(originalImage, 0, 0);
    console.log("濾鏡已套用至畫布");
}

// ==========================================
// 5. 監聽拉桿與功能按鈕
// ==========================================

// 監聽拉桿變化
document.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', applyFilters);
});

// 水印開關
document.getElementById('toggleWatermark').addEventListener('click', (e) => {
    watermark.classList.toggle('hidden');
    e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
});

// 儲存圖片
document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retro-photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
