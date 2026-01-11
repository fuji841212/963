const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const watermark = document.getElementById('watermark');
let originalImage = null;

// 1. 圖片上傳處理
imageUpload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            applyFilters();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. 濾鏡應用邏輯
function applyFilters() {
    if (!originalImage) return;

    const ev = document.getElementById('ev').value;
    const sat = document.getElementById('sat').value;
    const temp = document.getElementById('temp').value;

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 套用濾鏡組合 (CSS Filter 語法)
    ctx.filter = `
        brightness(${100 + parseInt(ev)}%) 
        saturate(${sat}%) 
        hue-rotate(${temp}deg)
        contrast(110%)
    `;
    
    ctx.drawImage(originalImage, 0, 0);
}

// 監聽所有拉桿變化
document.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', applyFilters);
});

// 3. 水印功能
document.getElementById('toggleWatermark').addEventListener('click', (e) => {
    watermark.classList.toggle('hidden');
    e.target.innerText = watermark.classList.contains('hidden') ? 'OFF' : 'ON';
});

// 4. 另存圖片
document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retro-photo.png';
    link.href = canvas.toDataURL();
    link.click();
});

// --- Firebase 預留區 ---
// 你可以在此加入 firebase.initializeApp(config) 來同步資料