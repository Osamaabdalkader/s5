// js/diagnostics.js - أداة تشخيص مبسطة
class Diagnostics {
    static async runFullDiagnosis() {
        console.log('🩺 بدء التشخيص الفوري...');
        
        const results = {
            classes: this.checkClasses(),
            pages: await this.checkPages(),
            supabase: await this.checkSupabase(),
            user: this.checkUser()
        };
        
        this.showResults(results);
    }
    
    static checkClasses() {
        const classes = ['Auth', 'Posts', 'PostDetails', 'HomePage', 'Navigation', 'Utils'];
        const results = {};
        
        classes.forEach(className => {
            results[className] = typeof window[className] !== 'undefined';
        });
        
        return results;
    }
    
    static async checkPages() {
        const pages = Object.keys(CONFIG.PAGE_FILES);
        const results = {};
        
        for (const page of pages) {
            try {
                const response = await fetch(CONFIG.PAGE_FILES[page], { method: 'HEAD' });
                results[page] = response.ok;
            } catch (error) {
                results[page] = false;
            }
        }
        
        return results;
    }
    
    static async checkSupabase() {
        try {
            const { error } = await supabase.from('marketing').select('count').limit(1);
            return { connected: !error, error: error ? error.message : null };
        } catch (error) {
            return { connected: false, error: error.message };
        }
    }
    
    static checkUser() {
        return { 
            loggedIn: !!currentUser, 
            email: currentUser ? currentUser.email : 'غير مسجل',
            metadata: currentUser ? currentUser.user_metadata : null
        };
    }
    
    static showResults(results) {
        let html = '<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">';
        html += '<h3>🔍 تقرير التشخيص الفوري</h3>';
        
        // الكلاسات
        html += '<h4>📚 الكلاسات المحملة:</h4>';
        Object.entries(results.classes).forEach(([className, loaded]) => {
            html += `<p>${loaded ? '✅' : '❌'} ${className}: ${loaded ? 'محمول' : 'غير محمل'}</p>`;
        });
        
        // الصفحات
        html += '<h4>📄 ملفات الصفحات:</h4>';
        Object.entries(results.pages).forEach(([page, exists]) => {
            html += `<p>${exists ? '✅' : '❌'} ${page}: ${exists ? 'موجود' : 'مفقود'}</p>`;
        });
        
        // Supabase
        html += `<h4>🔌 Supabase: ${results.supabase.connected ? '✅ متصل' : '❌ غير متصل'}</h4>`;
        if (results.supabase.error) {
            html += `<p><small>خطأ: ${results.supabase.error}</small></p>`;
        }
        
        // المستخدم
        html += `<h4>👤 المستخدم: ${results.user.loggedIn ? '✅ مسجل' : '❌ غير مسجل'}</h4>`;
        if (results.user.loggedIn) {
            html += `<p><small>البريد: ${results.user.email}</small></p>`;
        }
        
        html += '</div>';
        
        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            dynamicContent.innerHTML = html + (dynamicContent.innerHTML || '');
        }
    }
    }
