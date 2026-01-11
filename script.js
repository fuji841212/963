window.onload = function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    let originalImage = null;

    function handleImage(imgSource) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            draw(); 
        };
        img.src = imgSource;
    }

    handleImage('my-pic.jpg');

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => handleImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    });

    function draw() {
        if (!originalImage) return;
        const ev = document.getElementById('ev').value;
        const sat = document.getElementById('sat').value;
        const temp = document.getElementById('temp').value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = `brightness(${100 + parseInt(ev)}%) saturate(${sat}%) hue-rotate(${temp}deg) contrast(110%)`;
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    }

    // --- 底片模擬按鈕邏輯 ---
    document.querySelectorAll('.preset-item').forEach(button => {
        button.addEventListener('click', (e) => {
            // 切換按鈕亮起狀態
            document.querySelectorAll('.preset-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const preset = e.target.dataset.preset;
            
            // 根據不同底片設定數值
            if (preset === 'kodak') {
                document.getElementById('ev').value = 10;
                document.getElementById('sat').value = 140;
                document.getElementById('temp').value = 10; // 偏暖
            } else if (preset === 'fuji') {
                document.getElementById('ev').value = 5;
                document.getElementById('sat').value = 110;
                document.getElementById('temp').value = -15; // 偏冷
            } else if (preset === 'bw') {
                document.getElementById('ev').value = 0;
                document.getElementById('sat').value = 0; // 黑白
                document.getElementById('temp').value = 0;
            } else { // Classic 重置
                document.getElementById('ev').value = 0;
                document.getElementById('sat').value = 100;
                document.getElementById('temp').value = 0;
            }
            draw(); // 立即套用
        });
    });

    ['ev', 'sat', 'temp'].forEach(id => {
        document.getElementById(id).addEventListener('input', draw);
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'retro-photo.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};
