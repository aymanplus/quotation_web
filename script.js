document.addEventListener('DOMContentLoaded', () => {
    // جلب العناصر من الـ HTML
    const quotationForm = document.getElementById('quotation-form');
    const customerNameInput = document.getElementById('customer-name');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsTableBody = document.querySelector('#items-table tbody');
    const printOutput = document.getElementById('print-output');

    // مدخلات البند الجديد
    const itemDescInput = document.getElementById('item-desc');
    const itemUnitInput = document.getElementById('item-unit');
    const itemPriceInput = document.getElementById('item-price');

    // مصفوفة لتخزين البنود
    let items = [];
    let itemCounter = 1;

    // إضافة بند جديد
    addItemBtn.addEventListener('click', () => {
        const description = itemDescInput.value.trim();
        const unit = itemUnitInput.value.trim();
        const price = parseFloat(itemPriceInput.value);

        if (description && unit && !isNaN(price)) {
            items.push({ id: itemCounter++, description, unit, price });
            updateItemsTable();
            itemDescInput.value = '';
            itemUnitInput.value = '';
            itemPriceInput.value = '';
        } else {
            alert('الرجاء ملء جميع حقول البند بشكل صحيح.');
        }
    });

    // تحديث جدول عرض البنود
    function updateItemsTable() {
        itemsTableBody.innerHTML = ''; // تفريغ الجدول
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.description}</td>
                <td>${item.unit}</td>
                <td>${item.price.toFixed(2)}</td>
                <td><button type="button" class="remove-btn" data-id="${item.id}">حذف</button></td>
            `;
            itemsTableBody.appendChild(row);
        });
    }

    // حذف بند من الجدول
    itemsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            items = items.filter(item => item.id !== itemId);
            updateItemsTable();
        }
    });

    // إنشاء وطباعة عرض السعر
    quotationForm.addEventListener('submit', (e) => {
        e.preventDefault(); // منع إرسال الفورم

        const customerName = customerNameInput.value.trim();
        if (!customerName || items.length === 0) {
            alert('الرجاء إدخال اسم العميل وإضافة بند واحد على الأقل.');
            return;
        }

        // إنشاء محتوى HTML للطباعة
        generatePrintableHTML(customerName, items);

        // استدعاء نافذة الطباعة
        window.print();
    });

    
function generatePrintableHTML(customerName, items) {
    // --- بناء المسار المطلق للصور ---
    const origin = window.location.origin; //  مثلاً: "http://127.0.0.1:5500" أو "https://my-website.com"
    const pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')); // المسار إلى المجلد الحالي
    const basePath = `${origin}${pathname}`;
    
    const logoUrl = `${basePath}/images/logo.png`;
    const footerUrl = `${basePath}/images/footer.png`;
    // ------------------------------------

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    const tableRows = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td style="text-align: right;">${item.description}</td>
            <td>${item.unit}</td>
            <td>${item.price.toFixed(2)}</td>
        </tr>
    `).join('');

    const printableHTML = `
        <div class="a4-page">
            <header class="page-header">
                <!-- استخدام المسار المطلق الذي قمنا ببنائه -->
                <img src="${logoUrl}" alt="Company Logo">
            </header>
            
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
                    <thead>
                        <tr>
                            <th>م</th>
                            <th>البيان</th>
                            <th>الوحدة</th>
                            <th>السعر بالريال</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <div class="subject">
                    <h4># دفعة أولى 70%     # دفعة ثانية 30%</h4>
                </div>

                <div class="note">
                    <h4>ملاحظة :-</h4>
                    <p>السعر لا يشمل ضريبة القيمة المضافة</p>
                </div>
            </main>
            
            <footer class="page-footer">
                <!-- استخدام المسار المطلق الذي قمنا ببنائه -->
                <img src="${footerUrl}" alt="Company Footer">
            </footer>
        </div>
    `;

    printOutput.innerHTML = printableHTML;
}
});