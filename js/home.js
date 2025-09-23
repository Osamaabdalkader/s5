// home.js - إدارة الصفحة الرئيسية مع البحث والتصفية
class HomePage {
    static allPosts = [];
    static filteredPosts = [];

    static async init() {
        console.log('تهيئة الصفحة الرئيسية...');
        await this.loadPosts();
        this.setupSearchAndFilter();
    }

    static async loadPosts() {
        try {
            console.log('جاري تحميل المنشورات...');
            const { data: posts, error } = await supabase
                .from('marketing')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            this.allPosts = posts || [];
            this.filteredPosts = [...this.allPosts];
            this.displayPosts(this.filteredPosts);
            console.log(`تم تحميل ${this.allPosts.length} منشور`);
        } catch (error) {
            console.error('Error loading posts:', error);
            Utils.showStatus(`خطأ في تحميل المنشورات: ${error.message}`, 'error', 'connection-status');
        }
    }

    static displayPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
            console.error('عنصر posts-container غير موجود');
            return;
        }
        
        postsContainer.innerHTML = '';
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات لعرضها.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.style.cursor = 'pointer';
            
            const imageHtml = post.image_url 
                ? `<img src="${post.image_url}" alt="${post.name}" class="post-image" loading="lazy">`
                : `<div class="post-image no-image">لا توجد صورة</div>`;
            
            postElement.innerHTML = `
                ${imageHtml}
                <h3 class="post-title">${post.name}</h3>
                <p class="post-description">${post.description}</p>
                <div class="post-details">
                    <span class="post-detail post-price"><i class="fas fa-money-bill-wave"></i> ${Utils.formatPrice(post.price)}</span>
                    <span class="post-detail"><i class="fas fa-tag"></i> ${post.category}</span>
                    <span class="post-detail"><i class="fas fa-map-marker-alt"></i> ${post.location}</span>
                </div>
                <div class="post-author">
                    <i class="fas fa-user"></i> 
                    ${post.user_id ? `تم النشر بواسطة: ${post.user_id}` : 'مستخدم غير معروف'}
                </div>
                <small>${new Date(post.created_at).toLocaleString('ar-SA')}</small>
            `;
            
            postElement.addEventListener('click', () => {
                Navigation.showPage('post-details', { postId: post.id });
            });
            
            postsContainer.appendChild(postElement);
        });
    }

    static setupSearchAndFilter() {
        this.createSearchFilterInterface();
        this.bindSearchFilterEvents();
    }

    static createSearchFilterInterface() {
        const homePage = document.getElementById('home-page');
        if (!homePage) {
            console.error('صفحة الرئيسية غير موجودة');
            return;
        }

        // التحقق من عدم وجود واجهة البحث مسبقاً
        if (document.getElementById('search-filter-container')) {
            return;
        }

        const searchFilterHTML = `
            <div id="search-filter-container" class="search-filter-container">
                <div class="search-box">
                    <div class="form-group form-icon">
                        <i class="fas fa-search"></i>
                        <input type="text" id="search-input" placeholder="ابحث في المنشورات بالاسم أو الوصف...">
                    </div>
                </div>
                
                <div class="filter-controls">
                    <div class="form-group">
                        <select id="category-filter">
                            <option value="">جميع الأنواع</option>
                            <option value="سيارات">سيارات</option>
                            <option value="عقارات">عقارات</option>
                            <option value="أجهزة">أجهزة</option>
                            <option value="خدمات">خدمات</option>
                            <option value="أخرى">أخرى</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <select id="location-filter">
                            <option value="">جميع المواقع</option>
                            <option value="صنعاء">صنعاء</option>
                            <option value="عدن">عدن</option>
                            <option value="تعز">تعز</option>
                            <option value="حضرموت">حضرموت</option>
                            <option value="إب">إب</option>
                            <option value="أخرى">أخرى</option>
                        </select>
                    </div>
                    
                    <button id="reset-filters" class="btn-secondary">
                        <i class="fas fa-redo"></i> إعادة التعيين
                    </button>
                </div>
                
                <div id="search-results-info" class="search-results-info"></div>
            </div>
        `;

        // إدراج واجهة البحث بعد العنوان الرئيسي
        const title = homePage.querySelector('.section-title');
        if (title) {
            title.insertAdjacentHTML('afterend', searchFilterHTML);
            this.updateSearchResultsInfo();
        }
    }

    static bindSearchFilterEvents() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const locationFilter = document.getElementById('location-filter');
        const resetButton = document.getElementById('reset-filters');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', () => this.applyFilters());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFilters());
        }
    }

    static applyFilters() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const category = document.getElementById('category-filter')?.value || '';
        const location = document.getElementById('location-filter')?.value || '';

        this.filteredPosts = this.allPosts.filter(post => {
            const matchesSearch = !searchTerm || 
                (post.name && post.name.toLowerCase().includes(searchTerm)) || 
                (post.description && post.description.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !category || post.category === category;
            const matchesLocation = !location || post.location === location;

            return matchesSearch && matchesCategory && matchesLocation;
        });

        this.displayPosts(this.filteredPosts);
        this.updateSearchResultsInfo();
    }

    static resetFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const locationFilter = document.getElementById('location-filter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (locationFilter) locationFilter.value = '';

        this.filteredPosts = [...this.allPosts];
        this.displayPosts(this.allPosts);
        this.updateSearchResultsInfo();
    }

    static updateSearchResultsInfo() {
        const resultsInfo = document.getElementById('search-results-info');
        if (!resultsInfo) return;

        const totalPosts = this.allPosts.length;
        const filteredPosts = this.filteredPosts.length;

        if (filteredPosts === totalPosts) {
            resultsInfo.innerHTML = `عرض جميع المنشورات (${totalPosts})`;
        } else {
            resultsInfo.innerHTML = `عرض ${filteredPosts} من أصل ${totalPosts} منشور`;
        }
    }

    // دالة مساعدة للتحديث عند إضافة منشور جديد
    static async refreshPosts() {
        await this.loadPosts();
    }
    }
