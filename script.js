window.onload = function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    let originalImage = null;

    // 通用的圖片載入與處理
    function handleImage(imgSource) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            // 設定畫布內部解析度為圖片原始尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            draw(); 
        };
        img.src = imgSource;
    }

    // 1. 預設載入 (請確認 GitHub 有這張圖)
    handleImage('my-pic.jpg');

    // 2. 上傳載入
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => handleImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    });

    // 3. 繪製與濾鏡
    function draw() {
        if (!originalImage) return;

        const ev = document.getElementById('ev').value;
        const sat = document.getElementById('sat').value;
        const temp = document.getElementById('temp').value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 套用底片模擬濾鏡
        ctx.filter = `
            brightness(${100 + parseInt(ev)}%) 
            saturate(${sat}%) 
            hue-rotate(${temp}deg)
            contrast(110%)
        `;
        
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    }

    // 4. 監聽拉桿連動
    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', draw);
    });

    // 5. 儲存圖片
    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-sim-photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};
