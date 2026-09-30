// 檢查並初始化 AOS 動畫庫
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,        // 動畫持續時間 (毫秒)
        easing: 'ease-out',   // 緩動函數
        once: true,           // 每個元素只在滾動時動畫一次
        offset: 50            // 距離 viewport 多少像素時觸發
    });
}

// 手機版選單切換功能
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    });
}

// 點擊手機版選單連結後自動關閉選單
const mobileLinks = document.querySelectorAll('#mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Google Apps Script 表單發送處理
const form = document.getElementById('contact-form');
if (form) {
    const submitBtn = document.getElementById('submit-btn');
    const loadingIcon = document.getElementById('loading-icon');
    const formMessage = document.getElementById('form-message');

    // ==========================================
    // 【重要】請將下方字串替換為您 GAS 部署的 Web App URL
    // ==========================================
    const GAS_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        if (GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' || GAS_WEB_APP_URL === '') {
            alert('開發提示：請先在 script.js 中設定您的 Google Apps Script Web App URL 才能順利送出表單！');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        loadingIcon.classList.remove('hidden');
        if (document.getElementById('submit-icon')) document.getElementById('submit-icon').classList.add('hidden');
        formMessage.classList.add('hidden');
        
        formMessage.className = 'mt-6 text-center hidden p-4 rounded-xl text-base font-medium border'; 

        const formData = new FormData(form);
        
        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                formMessage.textContent = '表單已成功送出！我們會盡快與您聯絡。';
                formMessage.classList.add('bg-green-50', 'text-green-800', 'border-green-200');
                formMessage.classList.remove('hidden');
                form.reset();
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('送出表單發生錯誤:', error);
            formMessage.innerHTML = '送出失敗，可能網路不穩。<br>請稍後再試，或直接來電聯繫。';
            formMessage.classList.add('bg-red-50', 'text-red-800', 'border-red-200');
            formMessage.classList.remove('hidden');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            loadingIcon.classList.add('hidden');
            if (document.getElementById('submit-icon')) document.getElementById('submit-icon').classList.remove('hidden');
        });
    });
}
