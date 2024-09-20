document.addEventListener('DOMContentLoaded', function () {
  const pureUrlTextArea = document.getElementById('pureurl');
  const copyUrlButton = document.getElementById('copy_url');
  const copyMarkdownButton = document.getElementById('copy_markdown');
  const copyHtmlButton = document.getElementById('copy_html');
  const addToWhitelistButton = document.getElementById('add_to_whitelist');
  // const closePopupButton = document.getElementById('close_popup');
  const tipsDiv = document.getElementById('popup_tips');
  const notificationDiv = document.getElementById('notification');

  // i18n
  copyUrlButton.innerHTML = chrome.i18n.getMessage('popup_copy_url');
  copyMarkdownButton.innerHTML = chrome.i18n.getMessage('popup_copy_markdown');
  copyHtmlButton.innerHTML = chrome.i18n.getMessage('popup_copy_html');
  addToWhitelistButton.innerHTML = chrome.i18n.getMessage('popup_add_to_whitelist');
  // closePopupButton.innerHTML = chrome.i18n.getMessage('popup_close');

  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    const currentUrl = tabs[0].url;
    const cleanedUrl = await cleanUrl(currentUrl);
    pureUrlTextArea.value = cleanedUrl;
    adjustTextAreaHeight(pureUrlTextArea);

    const title = tabs[0].title.split(/[_|]/)[0].trim();
    const markdownFormat = `[${title}](${cleanedUrl})`;
    const htmlFormat = `<a href="${cleanedUrl}">${title}</a>`;

    const isWhitelisted = await isUrlWhitelisted(new URL(currentUrl).hostname);

    // 根据白名单匹配结果显示提示
    tipsDiv.innerHTML = isWhitelisted
      ? chrome.i18n.getMessage('popup_tips_true') // 白名单匹配成功
      : chrome.i18n.getMessage('popup_tips_false'); // 白名单匹配失败

    // 按钮事件处理
    copyUrlButton.onclick = () => {
      copyToClipboard(cleanedUrl);
    };
    copyMarkdownButton.onclick = () => {
      copyToClipboard(markdownFormat);
    };
    copyHtmlButton.onclick = () => {
      copyToClipboard(htmlFormat);
    };

    // closePopupButton.onclick = () => {
    //   window.close();
    // };

    addToWhitelistButton.onclick = () => {
      addToWhitelist(new URL(currentUrl).hostname);
    };
  });

  async function cleanUrl(url) {
    const defaultWhitelist = [
      'github.com',
      '*.1688.com',
      '*.aliyun.com',
      '*.baidu.com',
      '*.bing.com',
      '*.bilibili.com',
      '*.fliggy.com',
      '*.google.com',
      '*.jd.com',
      '*.jd.hk',
      '*.so.com',
      '*.taobao.com',
      '*.tmall.com',
      '*.tmall.hk',
      '*.yandex.com',
      'b23.tv',
      'cloud.tencent.com'
    ];

    return new Promise((resolve) => {
      chrome.storage.sync.get('whitelist', function (data) {
        const whitelist = data.whitelist || defaultWhitelist;
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const params = new URLSearchParams(urlObj.search);
        let cleanedUrl = urlObj.origin + urlObj.pathname;

        // 将泛域名转换为正则表达式
        const regexWhitelist = whitelist.map(domain => {
          if (domain.startsWith('*.')) {
            const baseDomain = domain.slice(2);
            return new RegExp(`^(.+\\.)?${baseDomain.replace(/\./g, '\\.')}$`);
          } else {
            return new RegExp(`^${domain.replace(/\./g, '\\.')}$`);
          }
        });

        // 检查是否匹配白名单
        const isWhitelisted = regexWhitelist.some(regex => regex.test(hostname));

        if (isWhitelisted) {
          // 处理特定域名的参数保留逻辑
          if (['taobao.com', 'tmall.com', 'tmall.hk', 'aliyun.com', 'so.com', 'google.com', 'baidu.com', 'bind.com', 'yandex.com', 'bilibili.com'].some(domain => hostname.endsWith(domain))) {
            const id = params.get('id');
            const liveId = params.get('liveId');
            const q = params.get('q');
            const wd = params.get('wd');
            const text = params.get('text');
            const t = params.get('t');
            const sessionId = params.get('sessionId');
            const retainedParams = [];
            if (id) retainedParams.push(`id=${id}`);
            if (liveId) retainedParams.push(`liveId=${liveId}`);
            if (q) retainedParams.push(`q=${q}`);
            if (wd) retainedParams.push(`wd=${wd}`);
            if (text) retainedParams.push(`text=${text}`);
            if (t) retainedParams.push(`t=${t}`);
            if (sessionId) retainedParams.push(`sessionId=${sessionId}`);
            if (retainedParams.length > 0) {
              cleanedUrl += `?${retainedParams.join('&')}`;
            }
          }
          resolve(cleanedUrl);
        } else {
          resolve(url); // 若不在白名单中，返回原始 URL
        }
      });
    });
  }

  function isUrlWhitelisted(domain) {
    return new Promise((resolve) => {
      chrome.storage.sync.get('whitelist', function (data) {
        const whitelist = data.whitelist || [];
        const regexWhitelist = whitelist.map(domain => {
          if (domain.startsWith('*.')) {
            const baseDomain = domain.slice(2);
            return new RegExp(`^(.+\\.)?${baseDomain.replace(/\./g, '\\.')}$`);
          } else {
            return new RegExp(`^${domain.replace(/\./g, '\\.')}$`);
          }
        });

        // 检查当前域名是否匹配白名单中的任何规则
        const isWhitelisted = regexWhitelist.some(regex => regex.test(domain));
        resolve(isWhitelisted);
      });
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification(chrome.i18n.getMessage('popup_copy_true'), true);
    }, () => {
      showNotification(chrome.i18n.getMessage('popup_copy_false'), false);
    });
  }

  function addToWhitelist(domain) {
    chrome.storage.sync.get('whitelist', function (data) {
      const whitelist = data.whitelist || [];
      if (!whitelist.includes(domain)) {
        whitelist.push(domain);
        chrome.storage.sync.set({ whitelist: whitelist }, function () {
          showNotification(chrome.i18n.getMessage('popup_add_true'), true);
        });
      } else {
        showNotification(chrome.i18n.getMessage('popup_add_exist'), false);
      }
    });
  }

  function showNotification(message, shouldClosePopup) {
    notificationDiv.textContent = message;
    notificationDiv.style.display = 'block';
    setTimeout(() => {
      notificationDiv.style.display = 'none';
      if (shouldClosePopup) {
        window.close(); // 关闭弹出窗口
      }
    }, 1500);
  }

  function adjustTextAreaHeight(textarea) {
    textarea.style.height = 'auto'; // 重置高度
    textarea.style.height = textarea.scrollHeight + 'px'; // 设置为内容高度
  }
});
