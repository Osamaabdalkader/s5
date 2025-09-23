// utils.js - مصحح بالكامل مع تحسينات التصحيح
class Utils {
    static async loadPageContent(pageId) {
        console.log(`📄 جاري تحميل محتوى الصفحة: ${pageId}`);
        
        // التحقق من وجود تعريف الصفحة
        if (!CONFIG.PAGE_FILES[pageId]) {
            throw new Error(`الصفحة غير معروفة في الإعدادات: ${pageId}`);
        }

        const fileName = CONFIG.PAGE_FILES[pageId];
        console.log(`🔍 الملف المستهدف: ${fileName}`);
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = fileName + '?v=' + Date.now();
            
            console.log(`🌐 جاري طلب URL: ${url}`);
            
            xhr.open('GET', url, true);
            xhr.timeout = 10000; // 10 ثواني timeout
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    console.log(`📊 حالة الاستجابة: ${xhr.status} لـ ${url}`);
                    
                    if (xhr.status === 200) {
                        const dynamicContent = document.getElementById('dynamic-content');
                        if (dynamicContent) {
                            dynamicContent.innerHTML = xhr.responseText;
                            console.log(`✅ تم تحميل الصفحة بنجاح: ${pageId}`);
                            resolve(true);
                        } else {
                            reject(new Error('❌ عنصر dynamic-content غير موجود في DOM'));
                        }
                    } else if (xhr.status === 404) {
                        reject(new Error(`❌ الملف غير موجود (404): ${fileName}`));
                    } else {
                        reject(new Error(`❌ فشل في تحميل الصفحة: ${xhr.status} - ${fileName}`));
                    }
                }
            };
            
            xhr.ontimeout = () => {
                reject(new Error(`⏰ انتهى الوقت أثناء تحميل: ${fileName}`));
            };
            
            xhr.onerror = () => {
                reject(new Error(`🌐 خطأ في الشبكة أثناء تحميل: ${fileName}`));
            };
            
            xhr.send();
        });
    }

    static showStatus(message, type, elementId = 'upload-status') {
        console.log(`💬 عرض حالة: ${type} - ${message}`);
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
            console.warn(`⚠️  عنصر الرسالة غير موجود: ${elementId}`);
        }
    }

    static formatPrice(price) {
        if (!price && price !== 0) return "0 ريال يمني";
        return new Intl.NumberFormat('ar-YE').format(price) + " ريال يمني";
    }

    static getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️  العنصر غير موجود: ${id}`);
        }
        return element;
    }

    static loadDebugInfo() {
        const debugEl = document.getElementById('debug-info');
        if (debugEl) {
            debugEl.innerHTML = `
                <h3>معلومات التصحيح:</h3>
                <p><strong>Supabase URL:</strong> ${CONFIG.SUPABASE_URL}</p>
                <p><strong>Supabase Key:</strong> ${CONFIG.SUPABASE_KEY.substring(0, 20)}...</p>
                <p><strong>آخر تحميل:</strong> ${new Date().toLocaleString('ar-SA')}</p>
                <p><strong>حالة المستخدم:</strong> ${currentUser ? 'مسجل الدخول - ' + currentUser.email : 'غير مسجل'}</p>
                <p><strong>الصفحة الحالية:</strong> ${Navigation.currentPage}</p>
                <p><strong>المتصفح:</strong> ${navigator.userAgent}</p>
                <p><strong>الصفحات المتاحة:</strong> ${Object.keys(CONFIG.PAGE_FILES).join(', ')}</p>
            `;
        }
    }

    // دالة جديدة للتحقق من وجود الملفات
    static async checkAllPages() {
        console.log('🔍 التحقق من وجود جميع الملفات...');
        const results = {};
        
        for (const [pageId, fileName] of Object.entries(CONFIG.PAGE_FILES)) {
            try {
                const response = await fetch(fileName, { method: 'HEAD' });
                results[pageId] = response.ok;
                console.log(`${response.ok ? '✅' : '❌'} ${pageId} -> ${fileName}`);
            } catch (error) {
                results[pageId] = false;
                console.log(`❌ ${pageId} -> ${fileName} (خطأ: ${error.message})`);
            }
        }
        
        return results;
    }
                    }
