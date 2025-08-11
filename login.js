document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // --- بيانات الدخول الصحيحة ---
        const correctUsername = "النعيم";
        const correctPassword = "123456";
        // -----------------------------

        if (username === correctUsername && password === correctPassword) {
            // في حالة النجاح
            errorMessage.textContent = '';
            
            // تخزين حالة تسجيل الدخول في الجلسة
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // توجيه المستخدم إلى الصفحة الرئيسية
            window.location.href = 'index.html';
        } else {
            // في حالة الفشل
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        }
    });
});