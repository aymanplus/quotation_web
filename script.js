document.addEventListener('DOMContentLoaded', () => {
    // --- جلب العناصر ---
    const quotationForm = document.getElementById('quotation-form');
    const customerNameInput = document.getElementById('customer-name');
    const printOutput = document.getElementById('print-output');
    
    // عناصر البنود
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsTableBody = document.querySelector('#items-table tbody');
    const itemDescInput = document.getElementById('item-desc');
    const itemUnitInput = document.getElementById('item-unit');
    const itemPriceInput = document.getElementById('item-price');

    // عناصر الإعدادات الإضافية
    const quotationDateInput = document.getElementById('quotation-date');
    
    // ==== عناصر الدفعات الديناميكية ====
    const paymentsContainer = document.getElementById('payments-container');
    const addPaymentBtn = document.getElementById('add-payment-btn');
    const paymentDescInput = document.getElementById('payment-desc');
    const paymentPercentInput = document.getElementById('payment-percent');
    const paymentTotalError = document.getElementById('payment-total-error');
    // ===================================

    // --- إعدادات الحالة (State) ---
    let items = [];
    let payments = []; // مصفوفة لتخزين الدفعات
    let itemCounter = 1;
    let paymentCounter = 1;

    // ضبط التاريخ الافتراضي
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    quotationDateInput.value = `${yyyy}-${mm}-${dd}`;
    
    // --- منطق إدارة البنود (Items) ---
    addItemBtn.addEventListener('click', () => {
        const description = itemDescInput.value.trim();
        const unit = itemUnitInput.value.trim();
        const price = parseFloat(itemPriceInput.value);

        if (description && unit && !isNaN(price)) {
            items.push({ id: itemCounter++, description, unit, price });
            updateItemsTable();
            itemDescInput.value = ''; itemUnitInput.value = ''; itemPriceInput.value = '';
        } else {
            alert('الرجاء ملء جميع حقول البند بشكل صحيح.');
        }
    });

    function updateItemsTable() {
        itemsTableBody.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${item.description}</td><td>${item.unit}</td><td>${item.price.toFixed(2)}</td><td><button type="button" class="remove-btn" data-id="${item.id}">حذف</button></td>`;
            itemsTableBody.appendChild(row);
        });
    }

    itemsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            items = items.filter(item => item.id !== itemId);
            updateItemsTable();
        }
    });

    // --- منطق إدارة الدفعات (Payments) ---
    addPaymentBtn.addEventListener('click', () => {
        const description = paymentDescInput.value.trim();
        const percentage = parseFloat(paymentPercentInput.value);

        if (description && !isNaN(percentage) && percentage > 0) {
            payments.push({ id: paymentCounter++, description, percentage });
            updatePaymentsList();
            paymentDescInput.value = '';
            paymentPercentInput.value = '';
        } else {
            alert('الرجاء إدخال وصف ونسبة صحيحة للدفعة.');
        }
    });

    function updatePaymentsList() {
        paymentsContainer.innerHTML = '';
        payments.forEach(payment => {
            const div = document.createElement('div');
            div.className = 'payment-item';
            div.innerHTML = `
                <span>${payment.description}: ${payment.percentage}%</span>
                <button type="button" class="remove-payment-btn" data-id="${payment.id}">x</button>
            `;
            paymentsContainer.appendChild(div);
        });
        validatePaymentTotal();
    }
    
    paymentsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-payment-btn')) {
            const paymentId = parseInt(e.target.getAttribute('data-id'));
            payments = payments.filter(p => p.id !== paymentId);
            updatePaymentsList();
        }
    });
    
    function validatePaymentTotal() {
        const total = payments.reduce((sum, p) => sum + p.percentage, 0);
        if (total !== 100 && payments.length > 0) {
            paymentTotalError.textContent = `مجموع الدفعات حالياً ${total}%. يجب أن يكون المجموع 100%.`;
            paymentTotalError.style.color = 'var(--danger-color)';
        } else {
            paymentTotalError.textContent = '';
        }
        return total === 100;
    }


    // --- منطق إرسال الفورم الرئيسي ---
    quotationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = customerNameInput.value.trim();
        const quotationDate = quotationDateInput.value;
        
        // التحقق من صحة البيانات
        if (!customerName || items.length === 0 || !quotationDate) {
            alert('الرجاء إكمال جميع الحقول المطلوبة (العميل، التاريخ، وبند واحد على الأقل).');
            return;
        }

        if (payments.length > 0 && !validatePaymentTotal()) {
            alert('مجموع نسب الدفعات يجب أن يساوي 100%. الرجاء تعديل الدفعات.');
            return;
        }

        // تمرير البيانات الجديدة إلى دالة الإنشاء
        generatePrintableHTML(customerName, items, quotationDate, payments);
        
        window.print();
    });

    // --- دالة إنشاء HTML للطباعة (مُحدثة) ---
    function generatePrintableHTML(customerName, items, quotationDate, payments) {
        const logoUrl = 'images/logo.png';
        const footerUrl = 'images/footer.png';

        const dateParts = quotationDate.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        const tableRows = items.map((item, index) => `<tr><td>${index + 1}</td><td style="text-align: right;">${item.description}</td><td>${item.unit}</td><td>${item.price.toFixed(2)}</td></tr>`).join('');
        
        // بناء نص الدفعات
        const paymentsText = payments.map(p => `# ${p.description} ${p.percentage}%`).join('     ');

        const printableHTML = `
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
                    
                    <!-- عرض الدفعات الديناميكية -->
                    ${payments.length > 0 ? `<div class="subject"><h4>${paymentsText}</h4></div>` : ''}

                    <div class="note">
                        <h4>ملاحظة :-</h4>
                        <p>السعر لا يشمل ضريبة القيمة المضافة</p>
                    </div>
                </main>
                <footer class="page-footer"><img src="${footerUrl}" alt="Company Footer"></footer>
            </div>
        `;
        printOutput.innerHTML = printableHTML;
    }
});