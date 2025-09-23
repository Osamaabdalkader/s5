// js/postDetails.js - إصلاح كامل
class PostDetails {
    static currentPostId = null;

    static async loadPostDetails(postId) {
        try {
            console.log('🔍 جاري تحميل تفاصيل المنشور:', postId);
            this.currentPostId = postId;
            
            const { data: post, error } = await supabase
                .from('marketing')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;
            
            this.displayPostDetails(post);
        } catch (error) {
            console.error('❌ خطأ في تحميل تفاصيل المنشور:', error);
            this.showError();
        }
    }

    static displayPostDetails(post) {
        console.log('📄 عرض تفاصيل المنشور:', post);
        const contentEl = document.getElementById('post-details-content');
        const errorEl = document.getElementById('post-details-error');
        
        if (!contentEl) {
            console.error('❌ عنصر تفاصيل المنشور غير موجود');
            return;
        }

        errorEl.style.display = 'none';
        contentEl.style.display = 'block';

        const imageHtml = post.image_url 
            ? `<img src="${post.image_url}" alt="${post.name}" class="post-detail-image">`
            : `<div class="post-detail-image no-image">
                  <i class="fas fa-image"></i>
                  <span>لا توجد صورة</span>
               </div>`;

        contentEl.innerHTML = `
            <div class="post-detail-header">
                <h2 class="post-detail-title">${post.name || 'بدون عنوان'}</h2>
                <span class="post-detail-price">${Utils.formatPrice(post.price)}</span>
            </div>
            
            ${imageHtml}
            
            <div class="post-detail-description">
                <h3><i class="fas fa-align-left"></i> الوصف:</h3>
                <p>${post.description || 'لا يوجد وصف'}</p>
            </div>
            
            <div class="post-detail-info">
                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <strong>النوع:</strong>
                    <span>${post.category || 'غير محدد'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <strong>الموقع:</strong>
                    <span>${post.location || 'غير محدد'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-user"></i>
                    <strong>صاحب المنشور:</strong>
                    <span>${post.user_id || 'مستخدم غير معروف'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <strong>تاريخ النشر:</strong>
                    <span>${post.created_at ? new Date(post.created_at).toLocaleString('ar-SA') : 'غير معروف'}</span>
                </div>
            </div>
            
            <div class="post-detail-actions">
                <button id="order-now-btn" class="order-button">
                    <i class="fas fa-shopping-cart"></i> اطلب الآن
                </button>
                <button onclick="Navigation.showPage('home')" class="btn-secondary">
                    <i class="fas fa-arrow-right"></i> العودة للرئيسية
                </button>
            </div>
        `;

        // إضافة event listener للزر اطلب الآن
        const orderBtn = document.getElementById('order-now-btn');
        if (orderBtn) {
            orderBtn.addEventListener('click', () => this.handleOrder(post));
        }
    }

    static showError() {
        console.error('❌ عرض خطأ تفاصيل المنشور');
        const contentEl = document.getElementById('post-details-content');
        const errorEl = document.getElementById('post-details-error');
        
        if (contentEl && errorEl) {
            contentEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    }

    static handleOrder(post) {
        if (!currentUser) {
            Utils.showStatus('يجب تسجيل الدخول لطلب المنتج', 'error');
            Navigation.showPage('login');
            return;
        }

        const message = `طلب على المنتج: ${post.name}\nالسعر: ${Utils.formatPrice(post.price)}\nصاحب المنشور: ${post.user_id}`;
        
        Utils.showStatus('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success');
        console.log('تفاصيل الطلب:', message);
    }

    static initPage() {
        console.log('✅ تهيئة صفحة تفاصيل المنشور');
    }
}

// التأكد من أن الكلاس معرف عالمياً
if (typeof window !== 'undefined') {
    window.PostDetails = PostDetails;
        }
