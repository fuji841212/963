window.onload = function() {
    console.log("🚀 模擬器核心啟動");

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    let originalImage = null;

    // 預設圖片路徑
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; 

    defaultImg.onload = () => {
        console.log("✅ 圖片載入成功");
        originalImage = defaultImg;
        updateCanvasSize();
    };

    // 上傳功能
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    updateCanvasSize();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 關鍵：更新畫布尺寸並立刻渲染
    function updateCanvasSize() {
        if (!originalImage) return;
        // 設定畫布的「畫素大小」等於「圖片大小」
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        applyFilters(); 
    }

    function applyFilters() {
        if (!originalImage) return;

        // 取得三個拉桿的數值
        const ev = parseInt(document.getElementById('ev').value);
        const sat = parseInt(document.getElementById('sat').value);
        const temp = parseInt(document.getElementById('temp').value);

        // 重置畫布與濾鏡
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 使用 CSS 濾鏡語法
        ctx.filter = `brightness(${100 + ev}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        
        // 畫出圖片
        ctx.drawImage(originalImage, 0, 0);
        console.log(`🎨 更新成功: EV=${ev}, SAT=${sat}, TEMP=${temp}`);
    }

    // 監聽所有拉桿 (使用 'input' 事件保證即時反應)
    const allRanges = document.querySelectorAll('input[type=range]');
    allRanges.forEach(range => {
        range.addEventListener('input', () => {
            applyFilters();
        });
    });
};
