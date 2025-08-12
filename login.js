// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = loginForm.querySelector('button');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // عرض مؤشر التحميل وتعطيل الزر
        loginButton.innerHTML = '<span class="spinner"></span> جارٍ التحقق...';
        loginButton.disabled = true;

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const correctUsername = "النعيم";
        const correctPassword = "123456";

        // محاكاة تأخير الشبكة (لإظهار المؤشر)
        setTimeout(() => {
            if (username === correctUsername && password === correctPassword) {
                errorMessage.textContent = '';
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username); // تخزين اسم المستخدم
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
                // إعادة الزر إلى حالته الطبيعية
                loginButton.innerHTML = 'تسجيل الدخول';
                loginButton.disabled = false;
            }
        }, 500); // 0.5 ثانية تأخير
    });
});