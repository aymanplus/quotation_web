// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- دالة إشعار Toast ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000); // 3 ثواني
    }

    // --- منطق تسجيل الخروج والهيدر ---
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeUsername = document.getElementById('welcome-username');
    
    const loggedInUser = sessionStorage.getItem('username');
    if (loggedInUser) {
        welcomeUsername.textContent = loggedInUser;
    }

    logoutBtn.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });

    // --- جلب العناصر ---
    const quotationForm = document.getElementById('quotation-form');
    // ... باقي العناصر ...
    const paymentTotalDisplay = document.getElementById('payment-total-display');

    // --- إدارة البنود ---
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsTableBody = document.querySelector('#items-table tbody');
    const itemDescInput = document.getElementById('item-desc');
    const itemUnitInput = document.getElementById('item-unit');
    const itemPriceInput = document.getElementById('item-price');
    
    let items = [];
    let itemCounter = 1;

    addItemBtn.addEventListener('click', () => {
        // ... (نفس الكود السابق لإضافة بند)
        const description = itemDescInput.value.trim();
        const unit = itemUnitInput.value.trim();
        const price = parseFloat(itemPriceInput.value);

        if (description && unit && !isNaN(price)) {
            items.push({ id: itemCounter++, description, unit, price });
            updateItemsTable();
            showToast('تمت إضافة البند بنجاح!', 'success');
            itemDescInput.value = ''; itemUnitInput.value = ''; itemPriceInput.value = '';
        } else {
            showToast('الرجاء ملء جميع حقول البند.', 'error');
        }
    });

    function updateItemsTable() { /* نفس الكود السابق */ 
        itemsTableBody.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${item.description}</td><td>${item.unit}</td><td>${item.price.toFixed(2)}</td><td><button type="button" class="remove-btn" data-id="${item.id}">حذف</button></td>`;
            itemsTableBody.appendChild(row);
        });
    }

    itemsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            // إضافة تأكيد قبل الحذف
            if (confirm('هل أنت متأكد من حذف هذا البند؟')) {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                items = items.filter(item => item.id !== itemId);
                updateItemsTable();
                showToast('تم حذف البند.', 'error');
            }
        }
    });

    // --- إدارة الدفعات ---
    const paymentsContainer = document.getElementById('payments-container');
    const addPaymentBtn = document.getElementById('add-payment-btn');
    const paymentDescInput = document.getElementById('payment-desc');
    const paymentPercentInput = document.getElementById('payment-percent');
    
    let payments = [];
    let paymentCounter = 1;
    
    addPaymentBtn.addEventListener('click', () => {
        const description = paymentDescInput.value.trim();
        const percentage = parseFloat(paymentPercentInput.value);

        if (description && !isNaN(percentage) && percentage > 0) {
            payments.push({ id: paymentCounter++, description, percentage });
            updatePaymentsList();
            showToast('تمت إضافة الدفعة بنجاح!', 'success');
            paymentDescInput.value = ''; paymentPercentInput.value = '';
        } else {
            showToast('الرجاء إدخال وصف ونسبة صحيحة.', 'error');
        }
    });

    function updatePaymentsList() {
        paymentsContainer.innerHTML = '';
        payments.forEach(payment => {
            const div = document.createElement('div');
            div.className = 'payment-item';
            div.innerHTML = `<span>${payment.description}: ${payment.percentage}%</span><button type="button" class="remove-payment-btn" data-id="${payment.id}">x</button>`;
            paymentsContainer.appendChild(div);
        });
        updatePaymentTotalDisplay(); // تحديث المجموع
    }
    
    paymentsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-payment-btn')) {
            if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
                const paymentId = parseInt(e.target.getAttribute('data-id'));
                payments = payments.filter(p => p.id !== paymentId);
                updatePaymentsList();
                showToast('تم حذف الدفعة.', 'error');
            }
        }
    });
    
    function updatePaymentTotalDisplay() {
        const total = payments.reduce((sum, p) => sum + p.percentage, 0);
        paymentTotalDisplay.textContent = `(المجموع: ${total}%)`;
        if (total !== 100 && payments.length > 0) {
            paymentTotalDisplay.style.color = 'var(--danger-color)';
        } else {
            paymentTotalDisplay.style.color = 'var(--success-color)';
        }
        return total === 100;
    }
    
    // --- إرسال الفورم الرئيسي ---
    const quotationDateInput = document.getElementById('quotation-date');
    const customerNameInput = document.getElementById('customer-name');

    quotationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = customerNameInput.value.trim();
        const quotationDate = quotationDateInput.value;
        
        if (!customerName || items.length === 0 || !quotationDate) {
            showToast('الرجاء إكمال الحقول الأساسية.', 'error'); return;
        }
        if (payments.length > 0 && !updatePaymentTotalDisplay()) {
            showToast('مجموع الدفعات يجب أن يساوي 100%.', 'error'); return;
        }
        
        generatePrintableHTML(customerName, items, quotationDate, payments);
        window.print();
    });

    // --- دالة إنشاء PDF ---
    function generatePrintableHTML(customerName, items, quotationDate, payments) {
        // ... نفس الكود السابق لدالة generatePrintableHTML ...
        const logoUrl = 'images/logo.png';
        const footerUrl = 'images/footer.png';

        const dateParts = quotationDate.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        const tableRows = items.map((item, index) => `<tr><td>${index + 1}</td><td style="text-align: right;">${item.description}</td><td>${item.unit}</td><td>${item.price.toFixed(2)}</td></tr>`).join('');
        
        const paymentsText = payments.map(p => `# ${p.description} ${p.percentage}%`).join('     ');

        const printOutput = document.getElementById('print-output');
        printOutput.innerHTML = `
            <div class="a4-page">
                <header class="page-header"><img src="${logoUrl}" alt="Company Logo"></header>
                <main class="page-main">
                    <div class="header-info">
                        <span>السادة / ${customerName} المحترمين</span>
                        <span>التاريخ: ${formattedDate}</span>
                    </div>
                    <div class="subject">
                        <h3>السلام عليكم ورحمة الله وبركاته</h3>
                        <h2>الموضوع ( عرض سعر )</h2>
                    </div>
                    <p class="intro-text">نتقدم لكم نحن مؤسسة السهم الشرقي للمقاولات العامة بعرض سعرنا هذا بخصوص توريد وتنفيذ أعمال أسفلت ونتمنى أن ينال رضاكم واسعارنا بالجدول التالي :</p>
                    <table class="print-table">
                        <thead><tr><th>م</th><th>البيان</th><th>الوحدة</th><th>السعر بالريال</th></tr></thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    
                    ${payments.length > 0 ? `<div class="subject"><h4>${paymentsText}</h4></div>` : ''}

                    <div class="note">
                        <h4>ملاحظة :-</h4>
                        <p>السعر لا يشمل ضريبة القيمة المضافة</p>
                    </div>
                </main>
                <footer class="page-footer"><img src="${footerUrl}" alt="Company Footer"></footer>
            </div>
        `;
    }
});