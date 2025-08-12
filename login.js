document.addEventListener('DOMContentLoaded', () => {
    // جلب عناصر النموذج من الـ HTML
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = loginForm.querySelector('button');

    // إضافة مستمع لحدث إرسال النموذج
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // عرض مؤشر التحميل وتعطيل الزر
        loginButton.innerHTML = '<span class="spinner"></span> جارٍ التحقق...';
        loginButton.disabled = true;
        errorMessage.textContent = '';

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // =======================================================
        // ==== مصفوفة المستخدمين الجدد ====
        const users = [
            { username: "النعيم", password: "123456" },
            { username: "ابو خالد", password: "112233" }
            // يمكنك إضافة المزيد من المستخدمين هنا
            // { username: "مستخدم آخر", password: "كلمة سر" }
        ];
        // =======================================================

        // محاكاة تأخير الشبكة
        setTimeout(() => {
            // البحث عن مستخدم مطابق في المصفوفة
            const foundUser = users.find(user => user.username === username && user.password === password);

            if (foundUser) {
                // في حالة نجاح تسجيل الدخول:
                
                // تخزين حالة تسجيل الدخول واسم المستخدم
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', foundUser.username); // تخزين اسم المستخدم الذي تم العثور عليه
                
                // توجيه المستخدم إلى الصفحة الرئيسية
                window.location.href = 'index.html';

            } else {
                // في حالة فشل تسجيل الدخول:

                // عرض رسالة خطأ
                errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
                
                // إعادة الزر إلى حالته الطبيعية
                loginButton.innerHTML = 'تسجيل الدخول';
                loginButton.disabled = false;
            }
        }, 500);
    });
});