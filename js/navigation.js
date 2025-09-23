// navigation.js - مصحح بالكامل
class Navigation {
    static currentPage = 'home';

    static async showPage(pageId, params = {}) {
        console.log(`=== جاري تحميل الصفحة: ${pageId}`, params);
        
        try {
            // إخفاء الصفحة الحالية
            const currentActive = document.querySelector('.page.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // إظهار رسالة تحميل
            const dynamicContent = document.getElementById('dynamic-content');
            if (dynamicContent) {
                dynamicContent.innerHTML = `
                    <div class="loading-page">
                        <div class="loading-spinner"></div>
                        <p>جاري تحميل الصفحة...</p>
                    </div>
                `;
            }

            // تحميل محتوى الصفحة
            await Utils.loadPageContent(pageId);
            
            // تهيئة الصفحة بعد التحميل
            await this.initializePage(pageId, params);
            
            this.currentPage = pageId;
            console.log(`✅ تم تحميل الصفحة بنجاح: ${pageId}`);
            
        } catch (error) {
            console.error(`❌ فشل في تحميل الصفحة: ${pageId}`, error);
            this.showErrorPage(error, pageId);
        }
    }

    static async initializePage(pageId, params = {}) {
        console.log(`🔄 جاري تهيئة الصفحة: ${pageId}`, params);
        
        // الانتظار حتى يكون DOM جاهزاً
        await new Promise(resolve => setTimeout(resolve, 150));
        
        try {
            switch (pageId) {
                case 'publish':
                    await this.handlePublishPage();
                    break;
                case 'login':
                    await this.handleLoginPage();
                    break;
                case 'register':
                    await this.handleRegisterPage();
                    break;
                case 'profile':
                    await this.handleProfilePage();
                    break;
                case 'home':
                    await this.handleHomePage();
                    break;
                case 'post-details':
                    await this.handlePostDetailsPage(params);
                    break;
                case 'notifications':
                case 'groups':
                case 'cart':
                case 'support':
                    await this.handleComingSoonPage(pageId);
                    break;
                default:
                    console.warn(`⚠️  الصفحة غير معروفة: ${pageId}`);
            }
            
            console.log(`✅ تم تهيئة الصفحة: ${pageId}`);
        } catch (error) {
            console.error(`❌ خطأ في تهيئة الصفحة ${pageId}:`, error);
            throw error;
        }
    }

    static async handlePublishPage() {
        console.log('🔄 تهيئة صفحة النشر');
        const publishContent = document.getElementById('publish-content');
        const loginRequired = document.getElementById('login-required-publish');
        
        if (!publishContent || !loginRequired) {
            throw new Error('عناصر صفحة النشر غير موجودة');
        }
        
        if (!currentUser) {
            publishContent.style.display = 'none';
            loginRequired.style.display = 'block';
        } else {
            publishContent.style.display = 'block';
            loginRequired.style.display = 'none';
        }
    }

    static async handleLoginPage() {
        console.log('🔄 تهيئة صفحة تسجيل الدخول');
        const statusEl = document.getElementById('login-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
        
        // التأكد من أن النموذج موجود
        const loginForm = document.getElementById('login-form');
        if (!loginForm) {
            console.warn('نموذج تسجيل الدخول غير موجود');
        }
    }

    static async handleRegisterPage() {
        console.log('🔄 تهيئة صفحة التسجيل');
        const statusEl = document.getElementById('register-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
        
        const registerForm = document.getElementById('register-form');
        if (!registerForm) {
            console.warn('نموذج التسجيل غير موجود');
        }
    }

    static async handleProfilePage() {
        console.log('🔄 تهيئة صفحة الملف الشخصي');
        const profileContent = document.getElementById('profile-content');
        const loginRequired = document.getElementById('login-required-profile');
        
        if (!profileContent || !loginRequired) {
            throw new Error('عناصر صفحة الملف الشخصي غير موجودة');
        }
        
        if (!currentUser) {
            profileContent.style.display = 'none';
            loginRequired.style.display = 'block';
        } else {
            profileContent.style.display = 'block';
            loginRequired.style.display = 'none';
            await this.loadProfileData();
        }
    }

    static async handleHomePage() {
        console.log('🔄 تهيئة الصفحة الرئيسية');
        if (typeof HomePage !== 'undefined' && HomePage.init) {
            await HomePage.init();
        } else {
            console.warn('HomePage غير معرف، جاري تحميل المنشورات مباشرة');
            if (typeof Posts !== 'undefined' && Posts.loadPosts) {
                await Posts.loadPosts();
            }
        }
    }

    static async handlePostDetailsPage(params) {
        console.log('🔄 تهيئة صفحة تفاصيل المنشور', params);
        if (!params || !params.postId) {
            throw new Error('معرف المنشور غير موجود');
        }
        
        if (typeof PostDetails !== 'undefined' && PostDetails.loadPostDetails) {
            await PostDetails.loadPostDetails(params.postId);
        } else {
            throw new Error('PostDetails غير معرف');
        }
    }

    static async handleComingSoonPage(pageId) {
        console.log('🔄 تهيئة صفحة قيد التطوير:', pageId);
        const pageTitles = {
            'notifications': 'الإشعارات',
            'groups': 'مجموعتي',
            'cart': 'سلة التسوق',
            'support': 'الدعم الفني'
        };
        
        const contentEl = document.getElementById('dynamic-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <section id="${pageId}-page" class="page active">
                    <h1 class="section-title">${pageTitles[pageId] || pageId}</h1>
                    <div class="coming-soon">
                        <i class="fas ${this.getPageIcon(pageId)} fa-3x"></i>
                        <h2>قريباً</h2>
                        <p>هذه الصفحة قيد التطوير</p>
                        <button onclick="Navigation.showPage('home')" class="btn-secondary">
                            <i class="fas fa-home"></i> العودة إلى الرئيسية
                        </button>
                    </div>
                </section>
            `;
        }
    }

    static getPageIcon(pageId) {
        const icons = {
            'notifications': 'fa-bell',
            'groups': 'fa-users',
            'cart': 'fa-shopping-cart',
            'support': 'fa-headset',
            'publish': 'fa-plus-circle',
            'profile': 'fa-user',
            'login': 'fa-sign-in-alt',
            'register': 'fa-user-plus'
        };
        return icons[pageId] || 'fa-cogs';
    }

    static async loadProfileData() {
        if (currentUser) {
            console.log('📊 تحميل بيانات الملف الشخصي:', currentUser);
            const setName = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value || 'غير محدد';
            };
            
            setName('profile-name', currentUser.user_metadata?.full_name);
            setName('profile-email', currentUser.email);
            setName('profile-phone', currentUser.user_metadata?.phone);
            setName('profile-address', currentUser.user_metadata?.address);
            
            if (currentUser.created_at) {
                setName('profile-created', new Date(currentUser.created_at).toLocaleString('ar-SA'));
            }
        }
    }

    static updateNavigation() {
        console.log('🔗 تحديث التنقل، المستخدم الحالي:', currentUser ? currentUser.email : 'غير مسجل');
        
        const navElements = {
            // عناصر الهيدر
            'notifications-link': currentUser,
            'logout-link': currentUser,
            'login-link': !currentUser,
            'register-link': !currentUser,
            
            // عناصر الفوتر
            'footer-profile-link': currentUser,
            'footer-publish-link': currentUser
        };

        for (const [id, shouldShow] of Object.entries(navElements)) {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = shouldShow ? 'flex' : 'none';
            }
        }
    }

    static showErrorPage(error, pageId) {
        console.error('💥 عرض صفحة الخطأ:', error);
        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            dynamicContent.innerHTML = `
                <div class="error-page">
                    <h1 class="section-title">خطأ في تحميل الصفحة</h1>
                    <p>تعذر تحميل الصفحة المطلوبة: <strong>${pageId}</strong></p>
                    <p><strong>الخطأ:</strong> ${error.message}</p>
                    <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                        <small>تفاصيل تقنية: ${error.stack || 'لا توجد تفاصيل إضافية'}</small>
                    </div>
                    <button onclick="Navigation.showPage('home')" class="btn-secondary" style="margin-top: 20px;">
                        <i class="fas fa-home"></i> العودة إلى الرئيسية
                    </button>
                </div>
            `;
        }
    }

    // دالة مساعدة للتحقق من وجود الصفحة
    static async checkPageExists(pageId) {
        if (!CONFIG.PAGE_FILES[pageId]) {
            return false;
        }
        
        try {
            const response = await fetch(CONFIG.PAGE_FILES[pageId]);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
                        }
