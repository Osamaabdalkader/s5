// utils.js - معدل ومصحح
class Utils {
    // تحميل محتوى الصفحة من ملف منفصل
    static async loadPageContent(pageId) {
        console.log(`جاري تحميل الصفحة: ${pageId}`);
        
        if (!CONFIG.PAGE_FILES[pageId]) {
            throw new Error(`الصفحة غير معروفة: ${pageId}`);
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const fileName = CONFIG.PAGE_FILES[pageId];
            const url = fileName + '?v=' + Date.now();
            
            console.log(`جاري تحميل الملف: ${url}`);
            
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const dynamicContent = document.getElementById('dynamic-content');
                        if (dynamicContent) {
                            dynamicContent.innerHTML = xhr.responseText;
                            console.log(`تم تحميل الصفحة بنجاح: ${pageId}`);
                            resolve(true);
                        } else {
                            reject(new Error('عنصر dynamic-content غير موجود'));
                        }
                    } else {
                        reject(new Error(`فشل في تحميل الصفحة: ${xhr.status} - ${fileName}`));
                    }
                }
            };
            
            xhr.onerror = () => {
                reject(new Error(`خطأ في الشبكة أثناء تحميل: ${fileName}`));
            };
            
            xhr.send();
        });
    }

    // عرض رسائل الحالة
    static showStatus(message, type, elementId = 'upload-status') {
        const statusEl = document.getElementById(elementId);
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `upload-status ${type}`;
            statusEl.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    statusEl.style.display = 'none';
                }, CONFIG.SUCCESS_MESSAGE_DURATION);
            }
        } else {
            console.warn(`عنصر الرسالة غير موجود: ${elementId}`);
        }
    }

    // تنسيق الأرقام (الأسعار)
    static formatPrice(price) {
        if (!price) return "0 ريال يمني";
        return new Intl.NumberFormat('ar-YE').format(price) + " ريال يمني";
    }

    // تحقق من وجود عنصر
    static getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`العنصر غير موجود: ${id}`);
        }
        return element;
    }

    // تحميل معلومات التصحيح
    static loadDebugInfo() {
        const debugEl = document.getElementById('debug-info');
        if (debugEl) {
            debugEl.innerHTML = `
                <h3>معلومات التصحيح:</h3>
                <p>Supabase URL: ${CONFIG.SUPABASE_URL}</p>
                <p>Supabase Key: ${CONFIG.SUPABASE_KEY.substring(0, 20)}...</p>
                <p>تم تحميل الصفحة: ${new Date().toLocaleString('ar-SA')}</p>
                <p>حالة المستخدم: ${currentUser ? 'مسجل الدخول' : 'غير مسجل'}</p>
                <p>معلومات المتصفح: ${navigator.userAgent}</p>
            `;
        }
    }
}