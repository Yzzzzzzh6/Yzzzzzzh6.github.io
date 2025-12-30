// 回声谷网站主要JavaScript功能
class EchoValleyApp {
    constructor() {
        this.currentUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            level: '新声',
            echoValue: 0,
            avatar: this.generateAvatar(),
            isAnonymous: true
        };
        
        this.posts = this.generateMockPosts();
        this.topics = this.generateMockTopics();
        this.resources = this.generateMockResources();
        
        this.init();
    }

    init() {
        this.initNavigation();
        this.initAnimations();
        this.initCurrentPage();
        this.initScrollEffects();
    }

    // 导航功能
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target && target !== '#') {
                    window.location.href = target;
                }
            });
        });

        // 移动端菜单切换
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    // 初始化页面动画
    initAnimations() {
        // 页面加载动画
        anime({
            targets: '.fade-in',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutQuart'
        });

        // 卡片悬停动画
        const cards = document.querySelectorAll('.card-hover');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -8,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
        });
    }

    // 滚动效果
    initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        easing: 'easeOutQuart'
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // 根据当前页面初始化功能
    initCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';

        switch (page) {
            case 'index':
                this.initHomePage();
                break;
            case 'voices':
                this.initVoicesPage();
                break;
            case 'square':
                this.initSquarePage();
                break;
            case 'station':
                this.initStationPage();
                break;
            case 'profile':
                this.initProfilePage();
                break;
        }
    }

    // 首页功能
    initHomePage() {
        this.initEmotionChart();
        this.initContentFeed();
        this.initHeroAnimation();
    }

    // 心声树洞页面功能
    initVoicesPage() {
        this.initPostForm();
        this.initPostList();
        this.initEmotionGalaxy();
    }

    // 共鸣广场页面功能
    initSquarePage() {
        this.initTopicList();
        this.initDebateFeature();
        this.initRankingList();
    }

    // 心灵驿站页面功能
    initStationPage() {
        this.initMysteryBox();
        this.initMentorSystem();
        this.initResourceLibrary();
    }

    // 个人中心页面功能
    initProfilePage() {
        this.initUserStats();
        this.initEmotionTrend();
        this.initAchievementSystem();
    }

    // 情绪图表
    initEmotionChart() {
        const chartContainer = document.getElementById('emotion-chart');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        const option = {
            title: {
                text: '校园情绪分布',
                textStyle: {
                    color: '#2C3E50',
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}%'
            },
            series: [{
                name: '情绪分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                data: [
                    { value: 35, name: '焦虑', itemStyle: { color: '#E8A598' } },
                    { value: 25, name: '开心', itemStyle: { color: '#4A90A4' } },
                    { value: 20, name: '压力', itemStyle: { color: '#F4B084' } },
                    { value: 12, name: '孤独', itemStyle: { color: '#85C1E9' } },
                    { value: 8, name: '其他', itemStyle: { color: '#D5DBDB' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        chart.setOption(option);
    }

    // 内容信息流
    initContentFeed() {
        const feedContainer = document.getElementById('content-feed');
        if (!feedContainer) return;

        this.renderPosts(feedContainer, this.posts.slice(0, 6));
        this.initInfiniteScroll(feedContainer);
    }

    // 发布表单
    initPostForm() {
        const form = document.getElementById('post-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit(form);
        });

        // 实时字数统计
        const contentInput = document.getElementById('post-content');
        const wordCount = document.getElementById('word-count');
        if (contentInput && wordCount) {
            contentInput.addEventListener('input', () => {
                const count = contentInput.value.length;
                wordCount.textContent = `${count}/1000`;
                wordCount.style.color = count > 1000 ? '#E74C3C' : '#7F8C8D';
            });
        }
    }

    // 处理发布提交
    handlePostSubmit(form) {
        const formData = new FormData(form);
        const content = formData.get('content');
        const category = formData.get('category');
        const emotion = formData.get('emotion');

        if (!content || content.trim().length < 10) {
            this.showNotification('内容至少需要10个字符', 'error');
            return;
        }

        const newPost = {
            id: 'post_' + Date.now(),
            content: content.trim(),
            category: category,
            emotion: emotion,
            author: this.currentUser,
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            echoes: 0,
            isAiReplied: false
        };

        this.posts.unshift(newPost);
        this.showNotification('发布成功！AI正在为您生成温暖的回应...', 'success');
        
        // 模拟AI回复
        setTimeout(() => {
            this.generateAiReply(newPost);
        }, 2000);

        form.reset();
        this.refreshPostList();
    }

    // 生成AI回复
    generateAiReply(post) {
        const replies = [
            `亲爱的同学，感受到你的${this.getEmotionText(post.emotion)}。你的声音我听到了，在这里你可以放心倾诉。记住，每一种情绪都是正常的，重要的是学会与之相处。💙`,
            
            `看到你的分享，我想给你一个温暖的拥抱🤗。${post.emotion}的时候确实不好受，但你愿意说出来已经很勇敢了。如果需要，我可以为你推荐一些相关的资源。`,
            
            `回声谷收到你的心声了！你的感受我完全理解。${this.getEmotionAdvice(post.emotion)}你并不孤单，这里有很多同学愿意倾听和支持你。`,
            
            `谢谢你愿意在这里分享。${this.getEmotionText(post.emotion)}是很多人都会经历的情绪，你的坦诚很有力量。如果需要专业支持，心灵驿站有很多资源可以帮助你。`,
            
            `你的声音，必有回响。我在这里，回声谷的每一位朋友都在这里。${this.getEmotionSupport(post.emotion)}让我们一起面对，一起成长。✨`
        ];

        const reply = replies[Math.floor(Math.random() * replies.length)];
        post.aiReply = reply;
        post.isAiReplied = true;
        
        this.showNotification('AI回复已生成！', 'success');
        this.refreshPostList();
    }

    // 获取情绪文本
    getEmotionText(emotion) {
        const emotionMap = {
            'anxiety': '焦虑',
            'stress': '压力',
            'lonely': '孤独',
            'sad': '难过',
            'confused': '困惑',
            'happy': '开心'
        };
        return emotionMap[emotion] || '情绪';
    }

    // 获取情绪建议
    getEmotionAdvice(emotion) {
        const adviceMap = {
            'anxiety': '深呼吸，给自己一些时间，焦虑会慢慢过去的。',
            'stress': '适当的压力是正常的，试着分解任务，一步步来完成。',
            'lonely': '孤独感很多人都会有的，试着主动与他人连接，你会发现温暖。',
            'sad': '悲伤是正常的情绪，允许自己感受它，但也要记得照顾自己。',
            'confused': '困惑意味着你在思考，这是成长的过程，相信自己的判断力。',
            'happy': '开心的时候记得分享给身边的人，快乐会传染的！'
        };
        return adviceMap[emotion] || '每一种情绪都值得被尊重和理解。';
    }

    // 获取情绪支持
    getEmotionSupport(emotion) {
        const supportMap = {
            'anxiety': '焦虑只是暂时的，你比想象中更强大。',
            'stress': '压力是成长的催化剂，相信你能应对挑战。',
            'lonely': '虽然此刻感到孤独，但请记住你并不孤单。',
            'sad': '悲伤会过去，阳光总会再次照进心里。',
            'confused': '困惑是成长的必经之路，答案会慢慢清晰。',
            'happy': '保持这份快乐，让它成为你前进的动力。'
        };
        return supportMap[emotion] || '无论什么时候，我们都在这里陪伴你。';
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // 显示动画
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });

        // 自动关闭
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);

        // 手动关闭
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.closeNotification(notification);
        });
    }

    // 关闭通知
    closeNotification(notification) {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                notification.remove();
            }
        });
    }

    // 渲染帖子列表
    renderPosts(container, posts) {
        container.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
        
        // 添加交互事件
        container.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLike(btn.dataset.postId);
            });
        });

        container.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCommentModal(btn.dataset.postId);
            });
        });
    }

    // 创建帖子HTML
    createPostHTML(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        const emotionColor = this.getEmotionColor(post.emotion);
        
        return `
            <div class="post-card card-hover" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar" style="background-color: ${post.author.avatar}"></div>
                        <div class="author-info">
                            <span class="author-name">匿名用户</span>
                            <span class="post-time">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="post-category">
                        <span class="category-tag" style="background-color: ${emotionColor}20; color: ${emotionColor}">
                            ${this.getCategoryText(post.category)}
                        </span>
                    </div>
                </div>
                
                <div class="post-content">
                    <p class="post-text">${this.escapeHtml(post.content)}</p>
                    ${post.aiReply ? `
                        <div class="ai-reply">
                            <div class="ai-avatar">🤖</div>
                            <div class="ai-content">
                                <div class="ai-label">AI回声仪回应</div>
                                <p class="ai-text">${post.aiReply}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="post-footer">
                    <div class="post-actions">
                        <button class="action-btn like-btn" data-post-id="${post.id}">
                            <span class="btn-icon">👍</span>
                            <span class="btn-text">共鸣</span>
                            <span class="btn-count">${post.likes}</span>
                        </button>
                        <button class="action-btn comment-btn" data-post-id="${post.id}">
                            <span class="btn-icon">💬</span>
                            <span class="btn-text">评论</span>
                            <span class="btn-count">${post.comments}</span>
                        </button>
                        <button class="action-btn share-btn" data-post-id="${post.id}">
                            <span class="btn-icon">📤</span>
                            <span class="btn-text">分享</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 处理点赞
    handleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.refreshPostList();
            
            // 点赞动画
            const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
            anime({
                targets: likeBtn,
                scale: [1, 1.2, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });
        }
    }

    // 刷新帖子列表
    refreshPostList() {
        const container = document.getElementById('posts-container');
        if (container) {
            this.renderPosts(container, this.posts);
        }
    }

    // 显示评论模态框
    showCommentModal(postId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>发表评论</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <textarea class="comment-input" placeholder="写下你的温暖回应..." maxlength="500"></textarea>
                    <div class="comment-tools">
                        <span class="word-count">0/500</span>
                        <button class="submit-comment-btn" data-post-id="${postId}">发布评论</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 显示动画
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });

        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });

        // 关闭模态框
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // 提交评论
        modal.querySelector('.submit-comment-btn').addEventListener('click', () => {
            this.submitComment(postId, modal.querySelector('.comment-input').value);
            this.closeModal(modal);
        });
    }

    // 关闭模态框
    closeModal(modal) {
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                modal.remove();
            }
        });
    }

    // 提交评论
    submitComment(postId, content) {
        if (!content || content.trim().length < 5) {
            this.showNotification('评论至少需要5个字符', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments++;
            this.refreshPostList();
            this.showNotification('评论发布成功！', 'success');
        }
    }

    // 生成用户头像
    generateAvatar() {
        const colors = ['#4A90A4', '#E8A598', '#85C1E9', '#F4B084', '#D5DBDB'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 获取时间差
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        return `${days}天前`;
    }

    // 获取情绪颜色
    getEmotionColor(emotion) {
        const colorMap = {
            'study': '#4A90A4',
            'relationship': '#E8A598',
            'emotion': '#85C1E9',
            'family': '#F4B084',
            'career': '#D5DBDB',
            'anxiety': '#E8A598',
            'stress': '#F4B084',
            'lonely': '#85C1E9',
            'sad': '#E8A598',
            'confused': '#D5DBDB',
            'happy': '#4A90A4'
        };
        return colorMap[emotion] || '#D5DBDB';
    }

    // 获取分类文本
    getCategoryText(category) {
        const categoryMap = {
            'study': '学业压力',
            'relationship': '人际关系',
            'emotion': '情感困惑',
            'family': '家庭问题',
            'career': '就业焦虑'
        };
        return categoryMap[category] || '其他';
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 生成模拟帖子数据
    generateMockPosts() {
        const mockPosts = [
            {
                id: 'post_1',
                content: '最近考试压力好大，感觉自己快要撑不下去了。每天都在图书馆学到深夜，但是成绩还是不理想。看到同学们都很轻松的样子，心里更加焦虑了...',
                category: 'study',
                emotion: 'anxiety',
                author: { id: 'user_1', avatar: '#4A90A4' },
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                likes: 45,
                comments: 12,
                echoes: 23,
                isAiReplied: true,
                aiReply: '亲爱的同学，感受到你的压力。考试焦虑很正常，说明你很在乎成绩。但请记住，成绩不是衡量你价值的唯一标准。试着调整学习方法，适当休息，相信自己的努力会有回报的。💙'
            },
            {
                id: 'post_2',
                content: '和室友的关系一直很紧张，他们总是深夜打游戏影响我休息。我试着沟通过几次，但是效果不明显。现在每天都很烦躁，不知道该怎么办...',
                category: 'relationship',
                emotion: 'stress',
                author: { id: 'user_2', avatar: '#E8A598' },
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                likes: 32,
                comments: 18,
                echoes: 15,
                isAiReplied: true,
                aiReply: '宿舍矛盾确实让人很困扰。你已经尝试沟通是很好的第一步。也许可以尝试和辅导员反映情况，或者申请调换宿舍。记住，保护自己的休息权利很重要，你值得拥有一个舒适的生活环境。'
            },
            {
                id: 'post_3',
                content: '刚和女朋友分手了，心里很难受。我们在一起两年多了，本来以为会一直走下去。现在看到校园里的情侣都会想起她，不知道该怎么走出来...',
                category: 'emotion',
                emotion: 'sad',
                author: { id: 'user_3', avatar: '#85C1E9' },
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                likes: 67,
                comments: 28,
                echoes: 34,
                isAiReplied: true,
                aiReply: '失恋的痛苦是真实而深刻的，两年多的感情不是说放下就能放下的。给自己一些时间，不要强迫自己快速走出来。试着做一些自己喜欢的事情，和朋友多交流，慢慢你会发现自己比想象中更坚强。'
            },
            {
                id: 'post_4',
                content: '家里出了一些事情，父母最近经常吵架，每次打电话回家都能感觉到紧张的气氛。我一个人在外地上学，感觉很无助，不知道能为家里做些什么...',
                category: 'family',
                emotion: 'confused',
                author: { id: 'user_4', avatar: '#F4B084' },
                timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
                likes: 28,
                comments: 15,
                echoes: 19,
                isAiReplied: true,
                aiReply: '家庭问题确实让人很担心，特别是远在他乡的时候。但请记住，你已经很勇敢了，能够关心家人就说明你是个有责任感的人。有时候我们能做的有限，但保持联系、表达关心就是很好的支持。'
            },
            {
                id: 'post_5',
                content: '大四了，面临着找工作的压力。投了很多简历都石沉大海，面试也总是失败。看着同学们一个个找到工作，我开始怀疑自己的能力，不知道未来的路在哪里...',
                category: 'career',
                emotion: 'anxiety',
                author: { id: 'user_5', avatar: '#D5DBDB' },
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                likes: 89,
                comments: 45,
                echoes: 52,
                isAiReplied: true,
                aiReply: '找工作的过程确实充满挑战，每一次拒绝都很打击人。但请记住，失败不代表你不够好，可能只是还没找到最适合的位置。继续提升自己，保持信心，属于你的机会一定会来的。'
            }
        ];

        return mockPosts;
    }

    // 生成模拟话题数据
    generateMockTopics() {
        return [
            {
                id: 'topic_1',
                title: '如何看待大学中的内卷现象？',
                participants: 1234,
                sameConfusion: 78,
                hot: true,
                category: 'study'
            },
            {
                id: 'topic_2',
                title: '室友之间应该如何建立良好的关系？',
                participants: 856,
                sameConfusion: 65,
                hot: true,
                category: 'relationship'
            },
            {
                id: 'topic_3',
                title: '大学生应该如何平衡学习和社交？',
                participants: 2341,
                sameConfusion: 82,
                hot: true,
                category: 'study'
            },
            {
                id: 'topic_4',
                title: '面对毕业即失业的压力，我们该怎么办？',
                participants: 1567,
                sameConfusion: 71,
                hot: false,
                category: 'career'
            },
            {
                id: 'topic_5',
                title: '异地恋能否经得起时间和距离的考验？',
                participants: 987,
                sameConfusion: 59,
                hot: false,
                category: 'emotion'
            }
        ];
    }

    // 生成模拟资源数据
    generateMockResources() {
        return [
            {
                id: 'resource_1',
                title: '24小时心理援助热线',
                type: 'hotline',
                description: '专业心理咨询师24小时在线，随时为你提供帮助',
                contact: '400-123-4567'
            },
            {
                id: 'resource_2',
                title: '校园心理咨询中心',
                type: 'counseling',
                description: '免费的心理咨询服务，预约制，保护隐私',
                contact: '预约电话：010-12345678'
            },
            {
                id: 'resource_3',
                title: '情绪调节呼吸练习',
                type: 'exercise',
                description: '简单的呼吸练习，帮助缓解焦虑和压力',
                content: '深呼吸练习：吸气4秒，屏息4秒，呼气6秒'
            },
            {
                id: 'resource_4',
                title: '治愈系音乐推荐',
                type: 'music',
                description: '精选的轻音乐和冥想音乐，帮助放松心情',
                content: '推荐歌单：《森林狂想曲》、《雨的印记》'
            }
        ];
    }

    // 无限滚动加载
    initInfiniteScroll(container) {
        let loading = false;
        
        window.addEventListener('scroll', () => {
            if (loading) return;
            
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= docHeight - 100) {
                loading = true;
                this.loadMoreContent(container);
                setTimeout(() => {
                    loading = false;
                }, 1000);
            }
        });
    }

    // 加载更多内容
    loadMoreContent(container) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<div class="loading-spinner"></div><span>加载中...</span>';
        container.appendChild(loadingIndicator);

        setTimeout(() => {
            loadingIndicator.remove();
            const morePosts = this.generateMockPosts().slice(0, 3);
            const postsHTML = morePosts.map(post => this.createPostHTML(post)).join('');
            container.insertAdjacentHTML('beforeend', postsHTML);
        }, 1500);
    }

    // 初始化帖子列表
    initPostList() {
        const container = document.getElementById('posts-container');
        if (!container) return;

        this.renderPosts(container, this.posts);
    }

    // 话题列表
    initTopicList() {
        const container = document.getElementById('topics-container');
        if (!container) return;

        container.innerHTML = this.topics.map(topic => `
            <div class="topic-card card-hover" data-topic-id="${topic.id}">
                <div class="topic-header">
                    <h3 class="topic-title">${topic.title}</h3>
                    ${topic.hot ? '<span class="hot-tag">热门</span>' : ''}
                </div>
                <div class="topic-stats">
                    <div class="stat-item">
                        <span class="stat-number">${topic.participants}</span>
                        <span class="stat-label">参与讨论</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${topic.sameConfusion}%</span>
                        <span class="stat-label">同类困惑</span>
                    </div>
                </div>
                <div class="topic-actions">
                    <button class="btn btn-primary">参与讨论</button>
                    <button class="btn btn-secondary">关注话题</button>
                </div>
            </div>
        `).join('');
    }

    // 盲盒功能
    initMysteryBox() {
        const boxContainer = document.getElementById('mystery-box');
        if (!boxContainer) return;

        boxContainer.addEventListener('click', () => {
            this.openMysteryBox();
        });
    }

    // 打开盲盒
    openMysteryBox() {
        const resources = [
            {
                type: 'breathing',
                title: '呼吸练习',
                content: '深呼吸：吸气4秒，屏息4秒，呼气6秒。重复5次，感受身心的放松。'
            },
            {
                type: 'music',
                title: '治愈音乐',
                content: '推荐：《森林狂想曲》- 让自然的旋律带走你的烦恼'
            },
            {
                type: 'quote',
                title: '温暖语录',
                content: '"每一个不曾起舞的日子，都是对生命的辜负。" - 尼采'
            },
            {
                type: 'exercise',
                title: '放松练习',
                content: '试试这个：闭上眼睛，想象自己在一个安全温暖的地方，感受那份宁静。'
            }
        ];

        const resource = resources[Math.floor(Math.random() * resources.length)];
        
        // 盲盒动画
        anime({
            targets: '#mystery-box',
            rotateY: [0, 360],
            scale: [1, 1.1, 1],
            duration: 800,
            easing: 'easeOutQuart'
        });

        setTimeout(() => {
            this.showResourceModal(resource);
        }, 400);
    }

    // 显示资源模态框
    showResourceModal(resource) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content resource-modal">
                <div class="modal-header">
                    <h3>🎁 解忧盲盒</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="resource-content">
                        <h4>${resource.title}</h4>
                        <p>${resource.content}</p>
                    </div>
                    <div class="resource-actions">
                        <button class="btn btn-primary">收藏资源</button>
                        <button class="btn btn-secondary">分享资源</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.showModal(modal);
    }

    // 显示模态框
    showModal(modal) {
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });

        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });

        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    // 用户统计
    initUserStats() {
        const statsContainer = document.getElementById('user-stats');
        if (!statsContainer) return;

        const stats = {
            posts: Math.floor(Math.random() * 50) + 1,
            likes: Math.floor(Math.random() * 200) + 50,
            echoes: this.currentUser.echoValue,
            level: this.currentUser.level
        };

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.posts}</div>
                    <div class="stat-label">发布帖子</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.likes}</div>
                    <div class="stat-label">获得共鸣</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.echoes}</div>
                    <div class="stat-label">回声值</div>
                </div>
                <div class="stat-card">
                    <div class="stat-level">${stats.level}</div>
                    <div class="stat-label">当前等级</div>
                </div>
            </div>
        `;
    }

    // 情绪趋势
    initEmotionTrend() {
        const chartContainer = document.getElementById('emotion-trend');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        const option = {
            title: {
                text: '情绪变化趋势',
                textStyle: {
                    color: '#2C3E50',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                min: -100,
                max: 100
            },
            series: [{
                name: '情绪指数',
                type: 'line',
                data: [-20, 30, -10, 50, 20, -30, 40],
                smooth: true,
                lineStyle: {
                    color: '#4A90A4'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(74, 144, 164, 0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(74, 144, 164, 0.1)'
                        }]
                    }
                }
            }]
        };
        chart.setOption(option);
    }

    // Hero区域动画
    initHeroAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // 打字机效果
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.opacity = '1';

            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            setTimeout(typeWriter, 500);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.echoValleyApp = new EchoValleyApp();
});

// 导出应用实例
window.EchoValleyApp = EchoValleyApp;