// js/app.js - الكود الرئيسي (معدل ومصحح)
class App {
    static async init() {
        console.log('تهيئة التطبيق...');
        
        try {
            await this.testConnection();
            await Auth.checkAuth();
            Auth.initAuthListener();
            
            // إعداد معالجة الأحداث العالمية
            this.setupGlobalEventHandlers();
            
            // تحميل الصفحة الرئيسية بعد التأكد من أن كل شيء جاهز
            setTimeout(() => {
                Navigation.showPage('home');
            }, 100);
            
            console.log('تم تهيئة التطبيق بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة التطبيق:', error);
            Utils.showStatus(`خطأ في التهيئة: ${error.message}`, 'error', 'connection-status');
        }
    }

    static async testConnection() {
        try {
            const { data, error } = await supabase.from('marketing').select('count').limit(1);
            if (error) throw error;
            Utils.showStatus('الاتصال مع قاعدة البيانات ناجح', 'success', 'connection-status');
        } catch (error) {
            Utils.showStatus(`خطأ في الاتصال: ${error.message}`, 'error', 'connection-status');
        }
    }

    // إعداد معالجات الأحداث العالمية
    static setupGlobalEventHandlers() {
        // معالجة النقر على المحتوى الديناميكي
        document.addEventListener('click', (event) => {
            EventHandlers.handleGlobalClick(event);
        });

        // معالجة تقديم النماذج
        document.addEventListener('submit', (event) => {
            EventHandlers.handleGlobalSubmit(event);
        });
    }

    static toggleDebug() {
        debugMode = !debugMode;
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.style.display = debugMode ? 'block' : 'none';
            if (debugMode) Utils.loadDebugInfo();
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});