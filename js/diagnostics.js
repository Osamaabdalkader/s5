// diagnostics.js - أداة تشخيص المشكلات
class Diagnostics {
    static async runFullDiagnosis() {
        console.log('🩺 بدء التشخيص الكامل للموقع...');
        
        const results = {
            config: await this.checkConfig(),
            pages: await this.checkPages(),
            supabase: await this.checkSupabase(),
            navigation: await this.checkNavigation(),
            auth: await this.checkAuth()
        };
        
        this.displayResults(results);
        return results;
    }
    
    static async checkConfig() {
        console.log('🔧 التحقق من الإعدادات...');
        const issues = [];
        
        if (!CONFIG) {
            issues.push('CONFIG غير معرف');
            return { ok: false, issues };
        }
        
        if (!CONFIG.SUPABASE_URL) issues.push('SUPABASE_URL غير معرف');
        if (!CONFIG.SUPABASE_KEY) issues.push('SUPABASE_KEY غير معرف');
        if (!CONFIG.PAGE_FILES) issues.push('PAGE_FILES غير معرف');
        
        if (CONFIG.PAGE_FILES) {
            const requiredPages = ['home', 'publish', 'login', 'register', 'profile'];
            for (const page of requiredPages) {
                if (!CONFIG.PAGE_FILES[page]) {
                    issues.push(`الصفحة ${page} غير معرفة في PAGE_FILES`);
                }
            }
        }
        
        return { 
            ok: issues.length === 0, 
            issues,
            config: CONFIG 
        };
    }
    
    static async checkPages() {
        console.log('📄 التحقق من وجود الملفات...');
        return await Utils.checkAllPages();
    }
    
    static async checkSupabase() {
        console.log('🔌 التحقق من اتصال Supabase...');
        try {
            const { data, error } = await supabase.from('marketing').select('count').limit(1);
            return { 
                ok: !error, 
                error: error ? error.message : null,
                connected: !error
            };
        } catch (error) {
            return { ok: false, error: error.message, connected: false };
        }
    }
    
    static async checkNavigation() {
        console.log('🧭 التحقق من نظام التنقل...');
        const issues = [];
        
        if (typeof Navigation === 'undefined') issues.push('Navigation غير معرف');
        if (typeof Navigation.showPage !== 'function') issues.push('Navigation.showPage غير معرف');
        if (typeof Utils.loadPageContent !== 'function') issues.push('Utils.loadPageContent غير معرف');
        
        return { ok: issues.length === 0, issues };
    }
    
    static async checkAuth() {
        console.log('🔐 التحقق من نظام المصادقة...');
        const issues = [];
        
        if (typeof Auth === 'undefined') issues.push('Auth غير معرف');
        if (typeof currentUser === 'undefined') issues.push('currentUser غير معرف');
        
        return { ok: issues.length === 0, issues, currentUser };
    }
    
    static displayResults(results) {
        console.log('📊 نتائج التشخيص:', results);
        
        const diagnosticInfo = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>🔍 تقرير التشخيص</h3>
                <p><strong>الإعدادات:</strong> ${results.config.ok ? '✅' : '❌'} ${results.config.issues.join(', ') || 'جيد'}</p>
                <p><strong>Supabase:</strong> ${results.supabase.connected ? '✅ متصل' : '❌ غير متصل'}</p>
                <p><strong>التنقل:</strong> ${results.navigation.ok ? '✅' : '❌'} ${results.navigation.issues.join(', ') || 'جيد'}</p>
                <p><strong>المصادقة:</strong> ${results.auth.ok ? '✅' : '❌'} ${results.auth.issues.join(', ') || 'جيد'}</p>
                <p><strong>المستخدم:</strong> ${results.auth.currentUser ? results.auth.currentUser.email : 'غير مسجل'}</p>
                <button onclick="Diagnostics.runFullDiagnosis()" class="btn-secondary" style="margin-top: 10px;">
                    <i class="fas fa-redo"></i> إعادة التشخيص
                </button>
            </div>
        `;
        
        // عرض النتائج في الصفحة إذا أمكن
        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            const existingDiagnostic = dynamicContent.querySelector('.diagnostic-results');
            if (existingDiagnostic) {
                existingDiagnostic.innerHTML = diagnosticInfo;
            } else {
                dynamicContent.insertAdjacentHTML('afterbegin', `<div class="diagnostic-results">${diagnosticInfo}</div>`);
            }
        }
    }
}

// إضافة زر التشخيص إلى الهيدر
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
        const diagnosticLi = document.createElement('li');
        diagnosticLi.innerHTML = `
            <a href="#" onclick="Diagnostics.runFullDiagnosis()">
                <i class="fas fa-stethoscope"></i> 
                <span class="nav-text">التشخيص</span>
            </a>
        `;
        nav.appendChild(diagnosticLi);
    }
});
