// posts.js - إضافة وظيفة النشر (معدل ومصحح)
class Posts {
    static async loadPosts() {
        try {
            console.log('جاري تحميل المنشورات من قاعدة البيانات...');
            const { data: posts, error } = await supabase
                .from('marketing')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            console.log(`تم تحميل ${posts ? posts.length : 0} منشور`);
            this.displayPosts(posts || []);
        } catch (error) {
            console.error('Error loading posts:', error);
            Utils.showStatus(`خطأ في تحميل المنشورات: ${error.message}`, 'error', 'connection-status');
        }
    }

    static async publishPost(postData) {
        try {
            console.log('جاري نشر منشور جديد:', postData);
            let imageUrl = null;
            
            // رفع الصورة إذا وجدت
            if (postData.imageFile && postData.imageFile.size > 0) {
                console.log('جاري رفع الصورة...');
                imageUrl = await this.uploadImage(postData.imageFile);
            }

            // إضافة المنشور إلى قاعدة البيانات
            const { data, error } = await supabase
                .from('marketing')
                .insert([{ 
                    name: postData.name,
                    description: postData.description, 
                    location: postData.location,
                    category: postData.category,
                    price: parseFloat(postData.price) || 0,
                    image_url: imageUrl,
                    user_id: currentUser ? currentUser.email : 'غير معروف'
                }])
                .select();
            
            if (error) throw error;
            
            console.log('تم نشر المنشور بنجاح:', data);
            
            // إعادة تحميل المنشورات في الصفحة الرئيسية
            if (typeof HomePage !== 'undefined' && HomePage.refreshPosts) {
                await HomePage.refreshPosts();
            }
            
            return true;
        } catch (error) {
            console.error('Error publishing post:', error);
            throw error;
        }
    }

    static async uploadImage(file) {
        try {
            console.log('جاري رفع الصورة:', file.name);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('marketing')
                .upload(fileName, file);
            
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage
                .from('marketing')
                .getPublicUrl(fileName);
            
            console.log('تم رفع الصورة بنجاح:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    static displayPosts(posts) {
        console.log('عرض المنشورات:', posts);
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
            console.error('عنصر posts-container غير موجود');
            return;
        }
        
        postsContainer.innerHTML = '';
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد.</p>';
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
                <h3 class="post-title">${post.name || 'بدون عنوان'}</h3>
                <p class="post-description">${post.description || 'بدون وصف'}</p>
                <div class="post-details">
                    <span class="post-detail post-price"><i class="fas fa-money-bill-wave"></i> ${Utils.formatPrice(post.price)}</span>
                    <span class="post-detail"><i class="fas fa-tag"></i> ${post.category || 'غير محدد'}</span>
                    <span class="post-detail"><i class="fas fa-map-marker-alt"></i> ${post.location || 'غير محدد'}</span>
                </div>
                <div class="post-author">
                    <i class="fas fa-user"></i> 
                    ${post.user_id ? `تم النشر بواسطة: ${post.user_id}` : 'مستخدم غير معروف'}
                </div>
                <small>${post.created_at ? new Date(post.created_at).toLocaleString('ar-SA') : 'تاريخ غير معروف'}</small>
            `;
            
            // إضافة event listener للنقر على المنشور
            postElement.addEventListener('click', () => {
                console.log('النقر على المنشور:', post.id);
                if (post.id) {
                    Navigation.showPage('post-details', { postId: post.id });
                } else {
                    console.error('معرف المنشور غير موجود');
                    Utils.showStatus('خطأ في تحميل المنشور', 'error');
                }
            });
            
            postsContainer.appendChild(postElement);
        });
    }
}