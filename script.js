document.addEventListener('DOMContentLoaded', () => {
    const quotationForm = document.getElementById('quotation-form');
    const customerNameInput = document.getElementById('customer-name');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsTableBody = document.querySelector('#items-table tbody');
    const printOutput = document.getElementById('print-output');
    const itemDescInput = document.getElementById('item-desc');
    const itemUnitInput = document.getElementById('item-unit');
    const itemPriceInput = document.getElementById('item-price');

    let items = [];
    let itemCounter = 1;

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

    function updateItemsTable() {
        itemsTableBody.innerHTML = '';
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

    itemsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            items = items.filter(item => item.id !== itemId);
            updateItemsTable();
        }
    });

    quotationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = customerNameInput.value.trim();
        if (!customerName || items.length === 0) {
            alert('الرجاء إدخال اسم العميل وإضافة بند واحد على الأقل.');
            return;
        }

        generatePrintableHTML(customerName, items);
        window.print();
    });

    function generatePrintableHTML(customerName, items) {
        // --- استخدام مسار مطلق من جذر الخادم ---
        // هذا هو الأسلوب الأكثر قوة وموثوقية عند التشغيل عبر خادم.
        const logoUrl = '/images/logo.png';
        const footerUrl = '/images/footer.png';
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
                    <img src="${footerUrl}" alt="Company Footer">
                </footer>
            </div>
        `;
    
        printOutput.innerHTML = printableHTML;
    }
});