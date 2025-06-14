document.addEventListener('DOMContentLoaded', function() {
    // 创建通知元素
    var welcomeNotification = document.createElement('div');
    welcomeNotification.className = 'welcome-notification';
    welcomeNotification.innerHTML = `
        <div class="welcome-line1">Hello, World</div>
        <div class="welcome-line2">正在获取位置信息...</div>
    `;
    
    // 添加到body
    document.body.appendChild(welcomeNotification);
    
    // 获取用户IP信息（使用支持中文的API）
    fetch('https://ipapi.co/json/?lang=zh')
        .then(response => response.json())
        .then(data => {
            const location = formatLocationToChinese(data);
            const line2 = document.querySelector('.welcome-line2');
            line2.innerHTML = `欢迎来自<span class="location-text">${location}</span>的朋友`;
            
            // 添加闪烁效果
            const locationText = document.querySelector('.location-text');
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                locationText.style.opacity = locationText.style.opacity === '0.3' ? '1' : '0.3';
                blinkCount++;
                
                if (blinkCount >= 6) { // 闪烁3次
                    clearInterval(blinkInterval);
                    locationText.style.opacity = '1';
                }
            }, 300);
        })
        .catch(error => {
            console.error('获取位置失败:', error);
            document.querySelector('.welcome-line2').textContent = '欢迎访问我们的网站';
        });
    
    // 5秒后添加hide类
    setTimeout(function() {
        welcomeNotification.classList.add('hide');
        
        // 动画结束后移除元素
        welcomeNotification.addEventListener('transitionend', function() {
            welcomeNotification.remove();
        });
    }, 5000);
    
    // 格式化位置信息为中文
    function formatLocationToChinese(data) {
        if (!data) return '未知地区';
        
        // 使用中文国家名称映射
        const countryMap = {
            'CN': '中国',
            'US': '美国',
            'JP': '日本',
            'KR': '韩国',
            'UK': '英国',
            'FR': '法国',
            'DE': '德国',
            'CA': '加拿大',
            'AU': '澳大利亚',
            'TW': '台湾省',
            'HK': '香港',
            'MO': '澳门',
            'SG': '新加坡',
            'MY': '马来西亚',
            'TH': '泰国',
            'IN': '印度',
            'RU': '俄罗斯',
            'BR': '巴西',
            'MX': '墨西哥'
        };
        
        if (data.country === 'CN') {
            // 中国大陆地区
            let location = '';
            if (data.region) location += data.region;
            if (data.city && data.city !== data.region) {
                location += location ? ` ${data.city}` : data.city;
            }
            return location || '中国';
        } else if (data.country) {
            // 国外地区
            let countryName = countryMap[data.country] || data.country;
            let regionName = data.region || '';
            
            // 处理特殊地区
            if (data.country === 'TW') {
                return '台湾省' + (data.region ? ` ${data.region}` : '');
            }
            
            return countryName + (regionName ? ` ${regionName}` : '');
        }
        return '未知地区';
    }
});