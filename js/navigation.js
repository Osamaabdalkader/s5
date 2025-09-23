// navigation.js - معدل
class Navigation {
    static async showPage(pageId, params = {}) {
        console.log(`جاري تحميل الصفحة: ${pageId}`, params);
        
        // إخفاء جميع الصفحات أولاً
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // إظهار رسالة تحميل
        document.getElementById('dynamic-content').innerHTML = `
            <div class="loading-page">
                <div class="loading-spinner"></div>
                <p>جاري تحميل الصفحة...</p>
            </div>
        `;
        
        try {
            await Utils.loadPageContent(pageId);
            await this.initializePage(pageId, params);
            console.log(`تم تحميل الصفحة بنجاح: ${pageId}`);
        } catch (error) {
            console.error(`فشل في تحميل الصفحة: ${pageId}`, error);
            this.showErrorPage(error, pageId);
        }
    }

    static async initializePage(pageId, params = {}) {
        console.log(`جاري تهيئة الصفحة: ${pageId}`, params);
        
        // إعطاء وقت للعناصر لتصبح جاهزة في DOM
        await new Promise(resolve => setTimeout(resolve, 100));
        
        switch (pageId) {
            case 'publish':
                this.handlePublishPage();
                break;
            case 'login':
                this.handleLoginPage();
                break;
            case 'register':
                this.handleRegisterPage();
                break;
            case 'profile':
                this.handleProfilePage();
                break;
            case 'home':
                await HomePage.init(); // استخدام HomePage بدلاً من Posts
                break;
            case 'post-details':
                this.handlePostDetailsPage(params);
                break;
            case 'notifications':
            case 'groups':
            case 'cart':
            case 'support':
                this.handleComingSoonPage(pageId);
                break;
        }
        
        this.rebindPageEvents(pageId);
    }

    static rebindPageEvents(pageId) {
        console.log(`إعادة ربط أحداث الصفحة: ${pageId}`);
    }

    static handlePublishPage() {
        const publishContent = document.getElementById('publish-content');
        const loginRequired = document.getElementById('login-required-publish');
        
        if (publishContent && loginRequired) {
            if (!currentUser) {
                publishContent.style.display = 'none';
                loginRequired.style.display = 'block';
            } else {
                publishContent.style.display = 'block';
                loginRequired.style.display = 'none';
            }
        }
    }

    static handleLoginPage() {
        const statusEl = document.getElementById('login-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    static handleRegisterPage() {
        const statusEl = document.getElementById('register-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    static handleProfilePage() {
        const profileContent = document.getElementById('profile-content');
        const loginRequired = document.getElementById('login-required-profile');
        
        if (profileContent && loginRequired) {
            if (!currentUser) {
                profileContent.style.display = 'none';
                loginRequired.style.display = 'block';
            } else {
                profileContent.style.display = 'block';
                loginRequired.style.display = 'none';
                this.loadProfileData();
            }
        }
    }

    static handlePostDetailsPage(params) {
        if (params.postId) {
            PostDetails.loadPostDetails(params.postId);
        } else {
            PostDetails.showError();
        }
    }

    static handleComingSoonPage(pageId) {
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
                    <h1 class="section-title">${pageTitles[pageId]}</h1>
                    <div class="coming-soon">
                        <i class="fas ${this.getPageIcon(pageId)} fa-3x"></i>
                        <h2>قريباً</h2>
                        <p>هذه الصفحة قيد التطوير</p>
                        <button onclick="Navigation.showPage('home')" class="btn-secondary">
                            <i class="fas fa-arrow-right"></i> العودة إلى الرئيسية
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
            'support': 'fa-headset'
        };
        return icons[pageId] || 'fa-cogs';
    }

    static loadProfileData() {
        if (currentUser) {
            const setName = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            };
            
            setName('profile-name', currentUser.user_metadata.full_name || 'غير محدد');
            setName('profile-email', currentUser.email || 'غير محدد');
            setName('profile-phone', currentUser.user_metadata.phone || 'غير محدد');
            setName('profile-address', currentUser.user_metadata.address || 'غير محدد');
            setName('profile-created', new Date(currentUser.created_at).toLocaleString('ar-SA'));
        }
    }

    static updateNavigation() {
        const elements = {
            'notifications-link': currentUser,
            'footer-publish-link': currentUser,
            'footer-profile-link': currentUser,
            'logout-link': currentUser,
            'login-link': !currentUser,
            'register-link': !currentUser
        };

        for (const [id, shouldShow] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = shouldShow ? 'flex' : 'none';
            }
        }
    }

    static showErrorPage(error, pageId) {
        document.getElementById('dynamic-content').innerHTML = `
            <div class="error-page">
                <h1 class="section-title">خطأ في تحميل الصفحة</h1>
                <p>تعذر تحميل الصفحة المطلوبة: ${pageId}</p>
                <p>الخطأ: ${error.message}</p>
                <button onclick="Navigation.showPage('home')">العودة إلى الرئيسية</button>
            </div>
        `;
    }
    }
