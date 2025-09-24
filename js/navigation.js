// navigation.js - العودة للإصدار الأساسي
class Navigation {
    static async showPage(pageId, params = {}) {
        console.log(`جاري تحميل الصفحة: ${pageId}`);
        
        try {
            // إخفاء جميع الصفحات
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            await Utils.loadPageContent(pageId);
            
            // إظهار الصفحة الجديدة
            const newPage = document.getElementById(`${pageId}-page`);
            if (newPage) {
                newPage.classList.add('active');
            }
            
            await this.initializePage(pageId, params);
        } catch (error) {
            console.error(`فشل في تحميل الصفحة: ${pageId}`, error);
            this.showErrorPage(error);
        }
    }

    static async initializePage(pageId, params = {}) {
        switch (pageId) {
            case 'home':
                Posts.loadPosts();
                break;
            case 'post-details':
                if (params.postId) {
                    PostDetails.loadPostDetails(params.postId);
                }
                break;
            case 'publish':
                this.handlePublishPage();
                break;
            case 'profile':
                this.handleProfilePage();
                break;
        }
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

    static loadProfileData() {
        if (currentUser) {
            document.getElementById('profile-name').textContent = currentUser.user_metadata?.full_name || 'غير محدد';
            document.getElementById('profile-email').textContent = currentUser.email || 'غير محدد';
            document.getElementById('profile-phone').textContent = currentUser.user_metadata?.phone || 'غير محدد';
            document.getElementById('profile-address').textContent = currentUser.user_metadata?.address || 'غير محدد';
            document.getElementById('profile-created').textContent = currentUser.created_at ? 
                new Date(currentUser.created_at).toLocaleString('ar-SA') : 'غير معروف';
        }
    }

    static updateNavigation() {
        const elements = {
            'publish-link': currentUser,
            'profile-link': currentUser,
            'logout-link': currentUser,
            'login-link': !currentUser,
            'register-link': !currentUser
        };

        for (const [id, shouldShow] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = shouldShow ? 'list-item' : 'none';
            }
        }
    }

    static showErrorPage(error) {
        document.getElementById('dynamic-content').innerHTML = `
            <div class="error-page">
                <h2>خطأ في تحميل الصفحة</h2>
                <p>${error.message}</p>
                <button onclick="Navigation.showPage('home')">العودة للرئيسية</button>
            </div>
        `;
    }
                                      }
