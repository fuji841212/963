window.onload = function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    let originalImage = null;

    // 1. 預設圖片載入
    const defaultImg = new Image();
    defaultImg.src = 'my-pic.jpg'; 
    defaultImg.onload = () => {
        originalImage = defaultImg;
        render();
    };

    // 2. 上傳功能
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

    function render() {
        if (!originalImage) return;
        // 重要：這兩行決定了圖片的「清晰度」
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
        
        // 濾鏡效果
        ctx.filter = `brightness(${100 + parseInt(ev)}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        
        // 將原圖完整畫入畫布
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        console.log("🎨 濾鏡更新完成");
    }

    // 監聽所有拉桿
    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    // 預設模式按鈕功能 (CLASSIC, KODAK 等)
    document.querySelectorAll('.preset-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const preset = e.target.dataset.preset;
            if(preset === 'bw') {
                document.getElementById('sat').value = 0;
            } else if(preset === 'warm') {
                document.getElementById('temp').value = 20;
                document.getElementById('sat').value = 120;
            } else {
                // 重置
                document.getElementById('ev').value = 0;
                document.getElementById('sat').value = 100;
                document.getElementById('temp').value = 0;
            }
            applyFilters();
        });
    });
};
